const { ObjectId } = require("mongodb");
const { tasksCollection, proposalsCollection } = require("../db/collections");

const createTask = async (req, res) => {
  try {
    const taskData = req.body;

    taskData.status = "open";
    taskData.total_proposals = 0;
    taskData.selected_freelancer = null;
    taskData.deliverable_url = "";

    taskData.createdAt = new Date();
    taskData.updatedAt = new Date();

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

    const currentPage = Number(page);
    const itemsPerPage = Number(limit);

    const totalTasks = await tasksCollection.countDocuments(query);

    const result = await tasksCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage)
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
    const result = await tasksCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Task not found.",
      });
    }

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

const getClientTasks = async (req, res) => {
  try {
    const result = await tasksCollection
      .find({
        client_email: req.params.email,
      })
      .sort({
        createdAt: -1,
      })
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

const updateTask = async (req, res) => {
  try {
    const updatedData = req.body;

    updatedData.updatedAt = new Date();

    const result = await tasksCollection.updateOne(
      {
        _id: new ObjectId(req.params.id),
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

    const acceptedProposal = await proposalsCollection.findOne({
      task_id: id,
      status: "accepted",
    });

    if (acceptedProposal) {
      return res.status(400).send({
        success: false,
        message:
          "You cannot delete this task because a proposal has already been accepted.",
      });
    }

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

const getLatestTasks = async (req, res) => {
  try {
    const result = await tasksCollection
      .find({
        status: "open",
      })
      .sort({
        createdAt: -1,
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

const submitDeliverable = async (req, res) => {
  try {
    const { deliverable_url } = req.body;

    const result = await tasksCollection.updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: {
          deliverable_url,
          status: "completed",
          updatedAt: new Date(),
        },
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
  createTask,
  getAllTasks,
  getTaskById,
  getClientTasks,
  updateTask,
  deleteTask,
  getLatestTasks,
  submitDeliverable,
};
