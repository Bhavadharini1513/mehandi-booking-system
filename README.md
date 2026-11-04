# Maruthani World – Mehandi Artist Booking Platform (MERN + TypeScript)

An e-commerce style web application where customers book mehandi (henna) artists.
Built with **MongoDB, Express, React, Node.js**, TypeScript, Webpack and Docker.

## Features

| Role | What they can do |
|------|------------------|
| **Customer** | register / login, **forgot & reset password**, browse services and artists, **view artist profile**, pick a date + hours on a live calendar, place an order, **pay online**, **chat with the artist**, cancel |
| **Artist** | apply to become an artist, get approved, see booking requests, **accept** or **reject** (a reason is required; can ask for **more information**), chat, mark completed, see earnings |
| **Admin** | **approve / reject artist applications**, see customers, artists, all bookings, payments and revenue |

### Booking flow

```
Customer places order  ──►  hours are LOCKED for everybody else
        │
        ▼
Artist:  Accept ───────────►  Customer pays (24 h) ──► CONFIRMED ──► COMPLETED
         Reject + "need more info" ► customer chats / re-submits ► (time stays locked)
         Reject (final) ───► time is released
Unpaid for 24 h / cancelled ► time is released (paid + cancelled ► "refund pending")
```

**Double-booking is impossible.** Every booked hour is a document in the `slotlocks`
collection with a UNIQUE index on `(artist, date, hour)`. If two customers click at the
same moment the database accepts one and refuses the other (tested with 8 simultaneous requests).

## Run it (development)

Requirements: Node.js 20+ and MongoDB running locally (or a MongoDB Atlas URL).

```bash
# 1. backend
cd backend
cp .env.example .env        # then edit MONGO_URI / JWT_SECRET if needed
npm install
npm run create-admin        # creates the admin from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                 # http://localhost:5000

# 2. frontend (new terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173  (proxies /api and /socket.io to the backend)
```

If you already have a `backend/.env`, just add the new keys from `.env.example`
(`CLIENT_URL`, `APP_TZ`, `OPEN_HOUR`, `CLOSE_HOUR`, `SMTP_*`, `RAZORPAY_*`).

### E-mail and payments work without any account

* **E-mail** – if `SMTP_*` is empty, e-mails (including the password-reset link) are printed
  in the **backend console**. Fill `SMTP_*` (e.g. Gmail app password) to send real mail.
* **Payment** – if `RAZORPAY_KEY_ID/SECRET` are empty the app uses a **demo payment window**
  (no money). Add Razorpay *test* keys and the real Razorpay checkout is used; the payment
  signature is verified on the server with HMAC-SHA256. *(The live Razorpay path needs your keys, so it could not be tried in development – use test keys first.)*

### Tests

```bash
cd backend && npm test      # needs MongoDB running; uses its own database "mehandi_test"
```
11 end-to-end tests: artist approval, slot blocking, overlap detection, validation,
reject-for-info + live chat, payment (incl. forged payments), expiry, 8-way race,
forgot/reset password, admin statistics.

## Syllabus mapping

| Unit | Topic | Where in this project |
|------|-------|-----------------------|
| **I** Server side | Node & NPM, packaging | `backend/package.json` (scripts, dependencies) |
| | fs, http, https, os, path, process | `backend/node-demos/` → `npm run demo:fs`, `demo:http`, `demo:https`, `demo:os`, `demo:path`, `demo:process` |
| | Express REST API, JWT, MongoDB | `backend/` (controllers, routes, models, middleware) |
| | MERN stack | MongoDB (`models/`), Express (`app.js`), React (`frontend/`), Node (`server.js`) |
| | Git | `git init`, `git add .`, `git commit -m "..."`, `git branch`, `git merge`, `git push origin main`, `git pull`, `git log --oneline` (the project history is in `.git`) |
| **II** Client side | React components | `frontend/src/pages`, `components`, `context` (hooks, router, context API) |
| | TypeScript: boolean, arrays, tuples, enum, functions | `frontend/src/typescript-demo/basics/programming.ts`, `types/Booking.ts` (enums, tuple `BadgeStyle`, `HourRange`) – demo page at `/typescript-demo` |
| **III** Advanced TS | classes, inheritance, interfaces, namespaces, modules, decorators, debugging | `frontend/src/typescript-demo/*` |
| | Simple web app with TypeScript | `frontend/webpack-demo/` and the typed React pages (`.tsx`) |
| **IV** Webpack | dependency graph, plugins, modules, node modules, REST endpoint | `frontend/webpack-demo/` → `npm run webpack` (`DefinePlugin`, `HtmlWebpackPlugin`, `ts-loader`, axios, `/api` proxy) |
| | mailer | `backend/utils/mailer.js` (Nodemailer) – password reset and booking e-mails |
| **V** Containers | Dockerfile, images, compose, Docker Hub | `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml` |

## Docker (Unit V)

```bash
# run the whole stack (MongoDB + backend + React/nginx)
cp .env.example .env
docker compose up --build
docker compose exec backend npm run create-admin
# open http://localhost:8080

# pull an image
docker pull mongo:7
docker images

# build your own images and push them to Docker Hub
docker login
docker build -t <your-dockerhub-name>/mehandi-backend:1.0  ./backend
docker build -t <your-dockerhub-name>/mehandi-frontend:1.0 ./frontend
docker push <your-dockerhub-name>/mehandi-backend:1.0
docker push <your-dockerhub-name>/mehandi-frontend:1.0

# useful
docker ps            # running containers
docker logs <id>     # output of a container
docker compose down  # stop everything (add -v to delete the database volume)
```
*The Docker files were written to the standard patterns but Docker was not available in the environment where this was built, so run `docker compose up --build` once and check it.*

## Main API endpoints

| Method & path | Who | Purpose |
|---------------|-----|---------|
| `POST /api/auth/register`, `/login` | public | account |
| `POST /api/auth/forgot-password`, `/reset-password/:token` | public | password reset |
| `GET /api/artist/approved`, `/api/artist/:id`, `/api/artist/services` | public | browse artists |
| `POST /api/artist/become-artist` | customer | apply |
| `PUT /api/admin/applications/:id/approve` or `/reject` | admin | review application |
| `GET /api/bookings/availability/:artistProfileId?date=YYYY-MM-DD` | public | free / booked hours |
| `POST /api/bookings` | customer | place order |
| `PUT /api/bookings/:id/accept` · `/reject` · `/complete` | artist | handle order |
| `PUT /api/bookings/:id/resubmit` | customer | answer artist's question |
| `PUT /api/bookings/:id/cancel` | customer / artist | cancel |
| `POST /api/payments/create-order`, `/verify` | customer | pay |
| `GET/POST /api/chat/:bookingId` + Socket.IO | customer / artist | chat |
| `GET /api/admin/stats`, `/bookings`, `/customers`, `/artists` | admin | monitoring |

## Notes
* Booking hours are whole hours between `OPEN_HOUR` (8) and `CLOSE_HOUR` (22) in the `APP_TZ` time zone.
* Never commit `.env` (it is in `.gitignore`).
