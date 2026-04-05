const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const logger = require("./config/logger");
const { errorHandler } = require("./api/v1/middlewares/error.middleware");

// Route imports
const authRoutes    = require("./api/v1/routes/auth.routes");
const userRoutes    = require("./api/v1/routes/user.routes");
const entryRoutes   = require("./api/v1/routes/entry.routes");
const analyticsRoutes = require("./api/v1/routes/analytics.routes");

const app = express();

// ─── Security & parsing middlewares ───────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
const path = require("path");
app.use(express.static(path.join(__dirname, "../../client")));

// ─── HTTP request logging (only in dev) ───────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── API routes ───────────────────────────────────────────────────────────────
app.use("/api/v1/auth",      authRoutes);
app.use("/api/v1/users",     userRoutes);
app.use("/api/v1/entries",   entryRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);


module.exports = app;