const { ObjectId } = require("mongodb");
const { usersCollection } = require("../db/collections");

const createUser = async (req, res) => {
  try {
    const userData = req.body;

    const existingUser = await usersCollection.findOne({
      email: userData.email,
    });

    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    userData.createdAt = new Date();
    userData.isBlocked = false;

    const result = await usersCollection.insertOne(userData);

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

const getAllUsers = async (req, res) => {
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

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    const result = await usersCollection.findOne({ email });

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

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updatedData,
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

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
};
