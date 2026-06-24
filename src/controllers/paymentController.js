const { ObjectId } = require("mongodb");
const { paymentsCollection } = require("../db/collections");

const createPayment = async (req, res) => {
  try {
    const paymentData = req.body;

    paymentData.payment_status = "paid";
    paymentData.paid_at = new Date();

    const result = await paymentsCollection.insertOne(paymentData);

    res.status(201).send({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const result = await paymentsCollection.find().toArray();

    res.send({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await paymentsCollection.findOne({
      _id: new ObjectId(id),
    });

    res.send({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
};
