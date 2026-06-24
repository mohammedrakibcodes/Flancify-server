const { ObjectId } = require("mongodb");
const { proposalsCollection } = require("../db/collections");

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

const updateProposal = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await proposalsCollection.updateOne(
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
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "accepted",
        },
      },
    );

    await proposalsCollection.updateMany(
      {
        task_id: proposal.task_id,
        _id: { $ne: new ObjectId(id) },
      },
      {
        $set: {
          status: "rejected",
        },
      },
    );

    res.send({
      success: true,
      message: "Proposal accepted",
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
  updateProposal,
  acceptProposal,
};
