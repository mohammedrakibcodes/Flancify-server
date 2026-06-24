const express = require("express");

const {
  createPayment,
  getAllPayments,
  getPaymentById,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/", createPayment);
router.get("/", getAllPayments);
router.get("/:id", getPaymentById);

module.exports = router;
