const express = require("express");

const {
  getClientStats,
  getFreelancerStats,
  getAdminStats,
} = require("../controllers/statsController");

const router = express.Router();

router.get("/client/:email", getClientStats);
router.get("/freelancer/:email", getFreelancerStats);
router.get("/admin", getAdminStats);

module.exports = router;
