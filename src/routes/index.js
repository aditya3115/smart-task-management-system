const express = require("express");

const authRoutes = require("./authRoutes");
const taskRoutes = require("./taskRoutes");
const eventRoutes = require("./eventRoutes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API health check successful",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/events", eventRoutes);

module.exports = router;
