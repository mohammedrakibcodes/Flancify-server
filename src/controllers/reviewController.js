const { ObjectId } = require("mongodb");

const {
  reviewsCollection,
  tasksCollection,
  paymentsCollection,
} = require("../db/collections");

const createReview = async (req, res) => {
  try {
    const reviewData = req.body;

    const task = await tasksCollection.findOne({
      _id: new ObjectId(reviewData.task_id),
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    if (task.status !== "completed") {
      return res.status(400).send({
        success: false,
        message: "Task not completed yet",
      });
    }

    const payment = await paymentsCollection.findOne({
      taskId: reviewData.task_id,
    });

    if (!payment) {
      return res.status(400).send({
        success: false,
        message: "Payment not found",
      });
    }

    const existingReview = await reviewsCollection.findOne({
      task_id: reviewData.task_id,
      reviewer_email: reviewData.reviewer_email,
    });

    if (existingReview) {
      return res.status(409).send({
        success: false,
        message: "You already reviewed this task",
      });
    }

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
