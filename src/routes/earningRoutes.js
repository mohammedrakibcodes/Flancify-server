const express = require("express");

const { getMyEarnings } = require("../controllers/earningController");
const verifyEmailOwner = require("../middleware/verifyEmailOwner");

const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/:email", verifyToken, verifyEmailOwner, getMyEarnings);

module.exports = router;
