const { reviewsCollection } = require("../db/collections");

const createReview = async (req, res) => {
  try {
    const reviewData = req.body;

    reviewData.created_at = new Date();

    const result = await reviewsCollection.insertOne(reviewData);

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

const getAllReviews = async (req, res) => {
  try {
    const result = await reviewsCollection.find().toArray();

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
  createReview,
  getAllReviews,
};
