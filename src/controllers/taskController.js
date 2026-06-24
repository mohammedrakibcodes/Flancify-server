const { ObjectId } = require("mongodb");
const { tasksCollection } = require("../db/collections");

const createTask = async (req, res) => {
  try {
    const taskData = req.body;

    taskData.status = "open";
    taskData.deliverable_url = "";
    taskData.createdAt = new Date();

    const result = await tasksCollection.insertOne(taskData);

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

const getAllTasks = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 9 } = req.query;

    const query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);

    const totalTasks = await tasksCollection.countDocuments(query);

    const result = await tasksCollection
      .find(query)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 })
      .toArray();

    res.send({
      success: true,
      totalTasks,
      totalPages: Math.ceil(totalTasks / itemsPerPage),
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

const getTaskById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await tasksCollection.findOne({
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

const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await tasksCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
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

const deleteTask = async (req, res) => {
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

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
