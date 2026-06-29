const {
  usersCollection,
  tasksCollection,
  proposalsCollection,
  paymentsCollection,
} = require("../db/collections");

const getClientStats = async (req, res) => {
  try {
    const email = req.params.email;

    const totalTasks = await tasksCollection.countDocuments({
      client_email: email,
    });

    const openTasks = await tasksCollection.countDocuments({
      client_email: email,
      status: "open",
    });

    const inProgressTasks = await tasksCollection.countDocuments({
      client_email: email,
      status: "in_progress",
    });

    const payments = await paymentsCollection
      .find({ client_email: email })
      .toArray();

    const totalSpent = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    res.send({
      success: true,
      totalTasks,
      openTasks,
      inProgressTasks,
      totalSpent,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getFreelancerStats = async (req, res) => {
  try {
    const email = req.params.email;

    const totalProposals = await proposalsCollection.countDocuments({
      freelancer_email: email,
    });

    const pendingProposals = await proposalsCollection.countDocuments({
      freelancer_email: email,
      status: "pending",
    });

    const acceptedProposals = await proposalsCollection.countDocuments({
      freelancer_email: email,
      status: "accepted",
    });

    const payments = await paymentsCollection
      .find({ freelancer_email: email })
      .toArray();

    const totalEarnings = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    res.send({
      success: true,
      totalProposals,
      pendingProposals,
      acceptedProposals,
      totalEarnings,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await usersCollection.countDocuments();

    const totalTasks = await tasksCollection.countDocuments();

    const activeTasks = await tasksCollection.countDocuments({
      status: "in_progress",
    });

    const payments = await paymentsCollection.find().toArray();

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    res.send({
      success: true,
      totalUsers,
      totalTasks,
      activeTasks,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getHomeStats = async (req, res) => {
  try {
    const totalUsers = await usersCollection.countDocuments();

    const totalTasks = await tasksCollection.countDocuments();

    const payments = await paymentsCollection.find().toArray();

    const totalPayout = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    const completedProjects = await tasksCollection.countDocuments({
      status: "completed",
    });

    res.send({
      success: true,
      result: {
        totalUsers,
        totalTasks,
        totalPayout,
        completedProjects,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getClientStats,
  getFreelancerStats,
  getAdminStats,
  getHomeStats,
};
