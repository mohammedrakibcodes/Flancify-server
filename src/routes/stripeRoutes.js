const express = require("express");

const {
  createCheckoutSession,
  confirmPayment,
} = require("../controllers/stripeController");

const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/create-checkout-session", verifyToken, createCheckoutSession);

router.post("/confirm-payment", verifyToken, confirmPayment);

module.exports = router;
