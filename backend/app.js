const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const artistRoutes = require("./routes/artistRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Maruthani World API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);

app.use(errorHandler);

module.exports = app;
