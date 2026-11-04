/*
  End-to-end test of the whole business flow.

  Needs a running MongoDB:   npm test
  (uses its own database "mehandi_test" - it is wiped at the start)
*/
process.env.MONGO_URI =
  process.env.TEST_MONGO_URI || "mongodb://127.0.0.1:27017/mehandi_test";
process.env.JWT_SECRET = "test_secret";
process.env.CLIENT_URL = "http://localhost:5173";
delete process.env.RAZORPAY_KEY_ID; // force DEMO payment mode
delete process.env.SMTP_HOST;

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("http");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { io: ioClient } = require("socket.io-client");

const app = require("../app");
const initSocket = require("../socket");
const User = require("../models/User");
const SlotLock = require("../models/SlotLock");
const Booking = require("../models/Booking");
const { expireUnpaidBookings } = require("../utils/jobs");

let server;
let base;
const ctx = {};

/* ---------- tiny HTTP helper ---------- */
const call = async (method, path, body, token) => {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
};

const tomorrow = () => {
  const d = new Date(Date.now() + 36 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
};
const DATE = tomorrow();

const register = async (name, email) => {
  const r = await call("POST", "/api/auth/register", {
    name, email, phone: "9876543210", address: "1 Main St", city: "Chennai",
    password: "secret123",
  });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const l = await call("POST", "/api/auth/login", { email, password: "secret123" });
  assert.equal(l.status, 200);
  return { token: l.body.token, id: l.body.user._id };
};

const book = (token, start, end, extra = {}) =>
  call(
    "POST",
    "/api/bookings",
    {
      artistProfileId: ctx.profileId,
      service: "Bridal",
      date: DATE,
      startTime: start,
      endTime: end,
      ...extra,
    },
    token,
  );

test.before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.dropDatabase();
  await SlotLock.init();

  server = http.createServer(app);
  app.set("io", initSocket(server));
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  server.close();
});

/* ===================================================== */

test("1. users register and admin is created", async () => {
  ctx.c1 = await register("Customer One", "c1@test.com");
  ctx.c2 = await register("Customer Two", "c2@test.com");
  ctx.a1 = await register("Artist Anu", "artist@test.com");

  await User.create({
    name: "Admin", email: "admin@test.com", phone: "1", address: "x", city: "x",
    password: await bcrypt.hash("Admin@123", 10), role: "admin",
  });
  const l = await call("POST", "/api/auth/login", { email: "admin@test.com", password: "Admin@123" });
  ctx.admin = { token: l.body.token };
});

test("2. artist application: reject -> resubmit -> approve", async () => {
  const application = {
    experience: 4, specialization: "Bridal", location: "Chennai",
    availableLocations: ["Chennai"], availableTime: "9am-6pm",
    services: ["Bridal", "Arabic"], bio: "Experienced artist", pricePerHour: 700,
  };

  const apply = await call("POST", "/api/artist/become-artist", application, ctx.a1.token);
  assert.equal(apply.status, 201);
  ctx.profileId = apply.body.application._id;

  // not visible to customers before approval
  let list = await call("GET", "/api/artist/approved");
  assert.equal(list.body.count, 0);

  // a customer cannot approve
  const hack = await call("PUT", `/api/admin/applications/${ctx.profileId}/approve`, null, ctx.c1.token);
  assert.equal(hack.status, 403);

  const rej = await call("PUT", `/api/admin/applications/${ctx.profileId}/reject`, null, ctx.admin.token);
  assert.equal(rej.status, 200);

  const again = await call("POST", "/api/artist/become-artist", application, ctx.a1.token);
  assert.equal(again.status, 200);

  const ok = await call("PUT", `/api/admin/applications/${ctx.profileId}/approve`, null, ctx.admin.token);
  assert.equal(ok.status, 200);

  // role changed -> log in again
  const l = await call("POST", "/api/auth/login", { email: "artist@test.com", password: "secret123" });
  assert.equal(l.body.user.role, "artist");

  list = await call("GET", "/api/artist/approved");
  assert.equal(list.body.count, 1);
  assert.equal(list.body.artists[0].pricePerHour, 700);

  const one = await call("GET", `/api/artist/${ctx.profileId}`);
  assert.equal(one.status, 200);
  assert.equal(one.body.artist.name, "Artist Anu");
});

test("3. availability + booking blocks the time for other customers", async () => {
  let av = await call("GET", `/api/bookings/availability/${ctx.profileId}?date=${DATE}`);
  assert.equal(av.status, 200);
  assert.deepEqual(av.body.bookedHours, []);

  const b = await book(ctx.c1.token, "10:00", "13:00", { notes: "Bridal henna", venue: "Hall 1" });
  assert.equal(b.status, 201, JSON.stringify(b.body));
  assert.equal(b.body.booking.amount, 2100); // 3h x 700
  assert.equal(b.body.booking.status, "pending");
  ctx.b1 = b.body.booking._id;

  av = await call("GET", `/api/bookings/availability/${ctx.profileId}?date=${DATE}`);
  assert.deepEqual(av.body.bookedHours, [10, 11, 12]);

  // same time, overlapping time -> rejected for customer 2
  assert.equal((await book(ctx.c2.token, "10:00", "13:00")).status, 409);
  assert.equal((await book(ctx.c2.token, "12:00", "14:00")).status, 409);
  assert.equal((await book(ctx.c2.token, "09:00", "11:00")).status, 409);

  // the failed attempts must not leave anything behind
  assert.equal(await Booking.countDocuments(), 1);
  assert.equal(await SlotLock.countDocuments(), 3);

  // a free time next to it is fine
  const ok = await book(ctx.c2.token, "13:00", "14:00");
  assert.equal(ok.status, 201);
  ctx.b2 = ok.body.booking._id;
});

test("4. validation", async () => {
  assert.equal((await book(ctx.c2.token, "15:30", "16:30")).status, 400); // not whole hour
  assert.equal((await book(ctx.c2.token, "16:00", "15:00")).status, 400); // reversed
  assert.equal((await book(ctx.c2.token, "06:00", "08:00")).status, 400); // before opening
  assert.equal((await book(ctx.c2.token, "20:00", "23:00")).status, 400); // after closing
  assert.equal((await book(ctx.c2.token, "10:00", "20:00")).status, 400); // > 8h
  assert.equal((await book(ctx.c2.token, "15:00", "16:00", { service: "Tattoo" })).status, 400);
  assert.equal((await book(ctx.c2.token, "15:00", "16:00", { date: "2020-01-01" })).status, 400); // past
  assert.equal((await book(ctx.a1.token, "15:00", "16:00")).status, 403); // artist cannot order
  assert.equal((await book(null, "15:00", "16:00")).status, 401);
});

test("5. artist rejects asking for more info -> chat -> resubmit -> accept", async () => {
  // customers cannot act as the artist
  assert.equal((await call("PUT", `/api/bookings/${ctx.b1}/accept`, null, ctx.c1.token)).status, 403);

  // reason is required
  assert.equal((await call("PUT", `/api/bookings/${ctx.b1}/reject`, { reason: "" }, ctx.a1.token)).status, 400);

  const rej = await call(
    "PUT", `/api/bookings/${ctx.b1}/reject`,
    { reason: "Which design do you want?", needMoreInfo: true }, ctx.a1.token,
  );
  assert.equal(rej.status, 200);
  assert.equal(rej.body.booking.status, "info_needed");

  // slot stays reserved while waiting
  assert.equal((await book(ctx.c2.token, "10:00", "11:00")).status, 409);

  // real-time chat between the two participants
  const sock = ioClient(base, { auth: { token: ctx.c1.token }, transports: ["websocket"] });
  const join = await new Promise((res) => sock.emit("join", ctx.b1, res));
  assert.equal(join.ok, true);
  const incoming = new Promise((res) => sock.once("message", res));

  const sent = await call("POST", `/api/chat/${ctx.b1}`, { text: "Arabic style please" }, ctx.c1.token);
  assert.equal(sent.status, 201);
  const pushed = await incoming;
  assert.equal(pushed.text, "Arabic style please");
  sock.close();

  // a stranger can neither read nor join
  assert.equal((await call("GET", `/api/chat/${ctx.b1}`, null, ctx.c2.token)).status, 403);
  const stranger = ioClient(base, { auth: { token: ctx.c2.token }, transports: ["websocket"] });
  const denied = await new Promise((res) => stranger.emit("join", ctx.b1, res));
  assert.equal(denied.ok, false);
  stranger.close();
  const noToken = ioClient(base, { transports: ["websocket"] });
  await new Promise((res) => noToken.once("connect_error", res));
  noToken.close();

  const history = await call("GET", `/api/chat/${ctx.b1}`, null, ctx.a1.token);
  assert.equal(history.body.canSend, true);
  assert.ok(history.body.messages.length >= 2); // system message + customer text

  const re = await call("PUT", `/api/bookings/${ctx.b1}/resubmit`, { notes: "Arabic, both hands" }, ctx.c1.token);
  assert.equal(re.body.booking.status, "pending");

  const acc = await call("PUT", `/api/bookings/${ctx.b1}/accept`, null, ctx.a1.token);
  assert.equal(acc.body.booking.status, "accepted");
});

test("6. payment (demo mode) confirms the booking", async () => {
  const cfg = await call("GET", "/api/payments/config");
  assert.equal(cfg.body.mode, "demo");

  // cannot pay somebody else's booking, nor an unaccepted one
  assert.equal((await call("POST", "/api/payments/create-order", { bookingId: ctx.b1 }, ctx.c2.token)).status, 403);
  assert.equal((await call("POST", "/api/payments/create-order", { bookingId: ctx.b2 }, ctx.c2.token)).status, 400);

  const order = await call("POST", "/api/payments/create-order", { bookingId: ctx.b1 }, ctx.c1.token);
  assert.equal(order.status, 200);
  assert.equal(order.body.amount, 210000); // paise

  // forged payment is refused
  const bad = await call("POST", "/api/payments/verify",
    { bookingId: ctx.b1, orderId: order.body.orderId, paymentId: "hacked", signature: "x" }, ctx.c1.token);
  assert.equal(bad.status, 400);
  const wrongOrder = await call("POST", "/api/payments/verify",
    { bookingId: ctx.b1, orderId: "order_other", paymentId: "pay_demo_1", signature: "x" }, ctx.c1.token);
  assert.equal(wrongOrder.status, 400);

  const ok = await call("POST", "/api/payments/verify",
    { bookingId: ctx.b1, orderId: order.body.orderId, paymentId: "pay_demo_123", signature: "demo" }, ctx.c1.token);
  assert.equal(ok.status, 200);
  assert.equal(ok.body.booking.status, "confirmed");
  assert.equal(ok.body.booking.paymentStatus, "paid");

  // paying twice is refused
  assert.equal((await call("POST", "/api/payments/create-order", { bookingId: ctx.b1 }, ctx.c1.token)).status, 400);
});

test("7. plain rejection releases the slot, cancel of paid booking flags refund", async () => {
  const rej = await call("PUT", `/api/bookings/${ctx.b2}/reject`, { reason: "I am on leave that day" }, ctx.a1.token);
  assert.equal(rej.body.booking.status, "rejected");

  const av = await call("GET", `/api/bookings/availability/${ctx.profileId}?date=${DATE}`);
  assert.deepEqual(av.body.bookedHours, [10, 11, 12]); // 13 is free again

  const again = await book(ctx.c2.token, "13:00", "15:00");
  assert.equal(again.status, 201);
  ctx.b3 = again.body.booking._id;

  // rejected booking chat is closed
  const closed = await call("POST", `/api/chat/${ctx.b2}`, { text: "hello" }, ctx.c2.token);
  assert.equal(closed.status, 400);

  // cancel the PAID booking -> refund flagged, slot released
  const cancel = await call("PUT", `/api/bookings/${ctx.b1}/cancel`, { reason: "Wedding postponed" }, ctx.c1.token);
  assert.equal(cancel.status, 200);
  assert.equal(cancel.body.booking.paymentStatus, "refund_pending");
  assert.equal(await SlotLock.countDocuments({ booking: ctx.b1 }), 0);
});

test("8. 8 customers click at the same time -> exactly ONE wins", async () => {
  const people = [];
  for (let i = 0; i < 8; i += 1) people.push(await register(`Racer ${i}`, `racer${i}@test.com`));

  const results = await Promise.all(people.map((p) => book(p.token, "18:00", "20:00")));
  const winners = results.filter((r) => r.status === 201).length;
  const losers = results.filter((r) => r.status === 409).length;

  assert.equal(winners, 1, results.map((r) => r.status).join(","));
  assert.equal(losers, 7);
  assert.equal(await SlotLock.countDocuments({ dateKey: DATE, hour: 18 }), 1);
});

test("9. unpaid accepted bookings expire and release the slot", async () => {
  await call("PUT", `/api/bookings/${ctx.b3}/accept`, null, ctx.a1.token);
  assert.equal(await SlotLock.countDocuments({ booking: ctx.b3 }), 2);

  await Booking.updateOne({ _id: ctx.b3 }, { paymentDueAt: new Date(Date.now() - 1000) });
  await expireUnpaidBookings();

  const b = await Booking.findById(ctx.b3);
  assert.equal(b.status, "cancelled");
  assert.equal(await SlotLock.countDocuments({ booking: ctx.b3 }), 0);
});

test("10. forgot / reset password", async () => {
  // capture the e-mail the dev mailer prints
  const logs = [];
  const original = console.log;
  console.log = (...a) => logs.push(a.join(" "));

  const unknown = await call("POST", "/api/auth/forgot-password", { email: "nobody@test.com" });
  const known = await call("POST", "/api/auth/forgot-password", { email: "c1@test.com" });

  console.log = original;

  // same response -> no account enumeration
  assert.equal(unknown.status, 200);
  assert.deepEqual(unknown.body, known.body);

  const mail = logs.join("\n");
  const token = mail.match(/reset-password\/([a-f0-9]{64})/)?.[1];
  assert.ok(token, "reset link must be in the e-mail");

  // the raw token must not be stored in the database
  const stored = await User.findOne({ email: "c1@test.com" }).select("+resetPasswordToken");
  assert.notEqual(stored.resetPasswordToken, token);

  assert.equal((await call("POST", `/api/auth/reset-password/${token}`, { password: "weak" })).status, 400);
  assert.equal((await call("POST", "/api/auth/reset-password/deadbeef", { password: "NewPass@123" })).status, 400);

  const done = await call("POST", `/api/auth/reset-password/${token}`, { password: "NewPass@123" });
  assert.equal(done.status, 200);

  // link works only once
  assert.equal((await call("POST", `/api/auth/reset-password/${token}`, { password: "Another@123" })).status, 400);

  assert.equal((await call("POST", "/api/auth/login", { email: "c1@test.com", password: "secret123" })).status, 401);
  assert.equal((await call("POST", "/api/auth/login", { email: "c1@test.com", password: "NewPass@123" })).status, 200);
});

test("11. complete flow + admin statistics", async () => {
  const b = await book(ctx.c2.token, "09:00", "10:00");
  assert.equal(b.status, 201);
  const id = b.body.booking._id;

  await call("PUT", `/api/bookings/${id}/accept`, null, ctx.a1.token);
  const order = await call("POST", "/api/payments/create-order", { bookingId: id }, ctx.c2.token);
  await call("POST", "/api/payments/verify",
    { bookingId: id, orderId: order.body.orderId, paymentId: "pay_demo_9", signature: "demo" }, ctx.c2.token);

  assert.equal((await call("PUT", `/api/bookings/${id}/complete`, null, ctx.c2.token)).status, 403);
  const done = await call("PUT", `/api/bookings/${id}/complete`, null, ctx.a1.token);
  assert.equal(done.body.booking.status, "completed");

  const stats = await call("GET", "/api/admin/stats", null, ctx.admin.token);
  assert.equal(stats.body.stats.completedBookings, 1);
  // b1 was cancelled after payment (refund pending) so it is NOT revenue
  assert.equal(stats.body.stats.paidBookings, 1);
  assert.equal(stats.body.stats.totalRevenue, 700);

  const all = await call("GET", "/api/admin/bookings", null, ctx.admin.token);
  assert.ok(all.body.count >= 4);

  const mine = await call("GET", "/api/bookings/my", null, ctx.a1.token);
  assert.ok(mine.body.bookings.every((x) => String(x.artist._id) === ctx.a1.id));
});
