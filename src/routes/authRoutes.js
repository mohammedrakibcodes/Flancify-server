const express = require("express");

const { createToken, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/jwt", createToken);

router.post("/logout", logout);

module.exports = router;
