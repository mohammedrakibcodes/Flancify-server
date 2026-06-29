const { ObjectId } = require("mongodb");

const { proposalsCollection, tasksCollection } = require("../db/collections");

const createProposal = async (req, res) => {
  try {
    const proposalData = req.body;

    const existingProposal = await proposalsCollection.findOne({
      task_id: proposalData.task_id,
      freelancer_email: proposalData.freelancer_email,
    });

    if (existingProposal) {
      return res.status(409).send({
        success: false,
        message: "You already applied for this task",
      });
    }

    proposalData.status = "pending";
    proposalData.submitted_at = new Date();

    await tasksCollection.updateOne(
      {
        _id: new ObjectId(proposalData.task_id),
      },
      {
        $inc: {
          total_proposals: 1,
        },
      },
    );

    const result = await proposalsCollection.insertOne(proposalData);

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

const getAllProposals = async (req, res) => {
  try {
    const result = await proposalsCollection.find().toArray();

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

const getTaskProposals = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const result = await proposalsCollection
      .find({
        task_id: taskId,
      })
      .sort({
        submitted_at: -1,
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

const getFreelancerProposals = async (req, res) => {
  try {
    const email = req.params.email;

    const result = await proposalsCollection
      .find({
        freelancer_email: email,
      })
      .sort({
        submitted_at: -1,
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

const updateProposal = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedData = req.body;

    const result = await proposalsCollection.updateOne(
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

const acceptProposal = async (req, res) => {
  try {
    const id = req.params.id;

    const proposal = await proposalsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!proposal) {
      return res.status(404).send({
        success: false,
        message: "Proposal not found",
      });
    }

    await proposalsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status: "accepted",
        },
      },
    );

    await proposalsCollection.updateMany(
      {
        task_id: proposal.task_id,
        _id: {
          $ne: new ObjectId(id),
        },
      },
      {
        $set: {
          status: "rejected",
        },
      },
    );

    await tasksCollection.updateOne(
      {
        _id: new ObjectId(proposal.task_id),
      },
      {
        $set: {
          status: "in-progress",
          selected_freelancer: proposal.freelancer_email,
          updatedAt: new Date(),
        },
      },
    );

    res.send({
      success: true,
      message: "Proposal accepted successfully.",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProposal,
  getAllProposals,
  getTaskProposals,
  getFreelancerProposals,
  updateProposal,
  acceptProposal,
};
