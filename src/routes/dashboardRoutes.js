const express = require("express");

const {
  getClientStats,
  getFreelancerStats,
  getClientDashboard,
} = require("../controllers/dashboardController");

const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

const router = express.Router();

router.get("/client-stats", verifyToken, verifyRole("client"), getClientStats);

router.get(
  "/freelancer-stats",
  verifyToken,
  verifyRole("freelancer"),
  getFreelancerStats,
);

router.get(
  "/client/:email",
  verifyToken,
  verifyRole("client"),

  getClientDashboard,
);

module.exports = router;
