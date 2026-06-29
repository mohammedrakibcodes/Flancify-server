const express = require("express");

const {
  getClientStats,
  getFreelancerStats,
  getAdminStats,
  getHomeStats,
} = require("../controllers/statsController");

const router = express.Router();

router.get("/client/:email", getClientStats);
router.get("/freelancer/:email", getFreelancerStats);
router.get("/admin", getAdminStats);
router.get("/", getHomeStats);

module.exports = router;
