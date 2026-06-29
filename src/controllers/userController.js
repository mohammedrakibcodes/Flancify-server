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

    userData.image = userData.image || "";

    userData.skills = userData.skills || [];

    userData.bio = userData.bio || "";

    userData.hourlyRate = userData.hourlyRate || 0;

    userData.averageRating = 0;

    userData.totalReviews = 0;

    userData.totalCompletedProjects = 0;

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

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await usersCollection.findOne({
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

const getUserByQueryEmail = async (req, res) => {
  try {
    const email = req.query.email;

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

const getTopFreelancers = async (req, res) => {
  try {
    const result = await usersCollection
      .find({
        role: "freelancer",
      })
      .limit(6)
      .toArray();

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

const getAllFreelancers = async (req, res) => {
  try {
    const { search = "", skill = "all", page = 1, limit = 9 } = req.query;

    const query = {
      role: "freelancer",
    };

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (skill !== "all") {
      query.skills = skill;
    }

    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    const totalFreelancers = await usersCollection.countDocuments(query);

    const result = await usersCollection
      .find(query)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({
        createdAt: -1,
      })
      .toArray();

    res.send({
      success: true,
      totalFreelancers,
      totalPages: Math.ceil(totalFreelancers / itemsPerPage),
      currentPage,
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
  getUserById,
  getUserByQueryEmail,
  updateUser,
  getTopFreelancers,
  getAllFreelancers,
};
