require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const auth = require("./routes/authRoutes");
const users = require("./routes/userRoutes");
const requests = require("./routes/requestRoutes");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const FRONTEND = path.join(__dirname, "..");

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("MONGO_URI and JWT_SECRET are required in .env");
  process.exit(1);
}

mongoose.set("bufferCommands", false);

app.use(helmet({ crossOriginResourcePolicy: false }));

if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN }));
}

app.use(express.json({ limit: "100kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." }
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/requests", requests);

app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    ok: connected,
    database: connected ? "connected" : "unavailable",
    message: connected
      ? "Campus Skill Exchange API is running."
      : "Campus Skill Exchange API is running, but MongoDB is unavailable."
  });
});

app.use(express.static(FRONTEND));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.status(404).sendFile(path.join(FRONTEND, "404.html"));
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Campus Skill Exchange running at http://localhost:${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully.`);
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

module.exports = { app, server };
