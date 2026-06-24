const express = require("express");

const { getMyEarnings } = require("../controllers/earningController");

const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/:email", verifyToken, getMyEarnings);

module.exports = router;
