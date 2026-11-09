require("dotenv").config();

// Force Google + Cloudflare DNS so MongoDB Atlas SRV lookups work
// even when the system DNS is broken / corporate-firewalled.
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const initSocket = require("./socket");
const { startJobs } = require("./utils/jobs");
const { isConfigured } = require("./utils/mailer");

const SlotLock = require("./models/SlotLock");

/* =========================================================
   DATABASE CONNECTION
========================================================= */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // make sure the UNIQUE slot index exists before the first booking
    await SlotLock.init();

    // Ensure the system administrator profile uses Bhava Dharini
    const User = require("./models/User");
    await User.updateMany(
      { $or: [{ role: "admin" }, { email: "admin@mehandi.com" }] },
      { $set: { name: "Bhava Dharini" } }
    ).catch(() => {});

    console.log("=================================");
    console.log("MongoDB Connected Successfully");
    console.log("=================================");
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error.message);

    process.exit(1);
  }
};

/* =========================================================
   START SERVER  (plain HTTP server so Express + Socket.IO share one port)
========================================================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  // make io available inside controllers:  req.app.get("io")
  app.set("io", initSocket(server));

  startJobs();

  console.log(
    isConfigured()
      ? `E-mail: sending through SMTP (${process.env.SMTP_HOST})`
      : "E-mail: SMTP not configured -> e-mails are only PRINTED in this console",
  );

  server.listen(PORT, () => {
    console.log("=================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log("=================================");
  });

  // graceful shutdown (Docker sends SIGTERM)
  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down...`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
