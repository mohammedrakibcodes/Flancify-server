const { paymentsCollection } = require("../db/collections");

const getMyEarnings = async (req, res) => {
  try {
    const email = req.params.email;

    const payments = await paymentsCollection
      .find({
        freelancer_email: email,
      })
      .toArray();

    const totalEarnings = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    res.send({
      success: true,
      totalEarnings,
      payments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyEarnings,
};
