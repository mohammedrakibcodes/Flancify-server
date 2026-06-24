const { ObjectId } = require("mongodb");
const { tasksCollection } = require("../db/collections");

const verifyTaskOwner = async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await tasksCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found",
      });
    }

    if (task.client_email !== req.user.email) {
      return res.status(403).send({
        success: false,
        message: "Access denied",
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = verifyTaskOwner;
