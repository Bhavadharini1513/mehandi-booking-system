require("dotenv").config();

const mongoose = require("mongoose");

const app = require("./app");

/* =========================================================
   DATABASE CONNECTION
========================================================= */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

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
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("=================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log("=================================");
  });
};

startServer();
