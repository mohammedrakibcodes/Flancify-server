const { ObjectId } = require("mongodb");

const {
  usersCollection,
  tasksCollection,
  paymentsCollection,
} = require("../db/collections");

const getAllUsersAdmin = async (req, res) => {
  try {
    const result = await usersCollection.find().toArray();

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

const toggleUserBlock = async (req, res) => {
  try {
    const id = req.params.id;
    const { isBlocked } = req.body;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { isBlocked },
      },
    );

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

const getAllTasksAdmin = async (req, res) => {
  try {
    const result = await tasksCollection.find().toArray();

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

const deleteTaskAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await tasksCollection.deleteOne({
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

const getTransactions = async (req, res) => {
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

module.exports = {
  getAllUsersAdmin,
  toggleUserBlock,
  getAllTasksAdmin,
  deleteTaskAdmin,
  getTransactions,
};
