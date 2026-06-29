const {
  tasksCollection,
  paymentsCollection,
  proposalsCollection,
} = require("../db/collections");

const getClientStats = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required.",
      });
    }

    const totalTasks = await tasksCollection.countDocuments({
      client_email: email,
    });

    const openTasks = await tasksCollection.countDocuments({
      client_email: email,
      status: "open",
    });

    const inProgressTasks = await tasksCollection.countDocuments({
      client_email: email,
      status: "in-progress",
    });

    const completedTasks = await tasksCollection.countDocuments({
      client_email: email,
      status: "completed",
    });

    const payments = await paymentsCollection
      .find({
        client_email: email,
      })
      .toArray();

    const totalSpent = payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0,
    );

    res.send({
      success: true,
      result: {
        totalTasks,
        openTasks,
        inProgressTasks,
        completedTasks,
        totalSpent,
      },
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
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required.",
      });
    }

    const submittedProposals = await proposalsCollection.countDocuments({
      freelancer_email: email,
    });

    const activeProjects = await proposalsCollection.countDocuments({
      freelancer_email: email,
      status: "accepted",
    });

    const completedProjects = await proposalsCollection.countDocuments({
      freelancer_email: email,
      status: "completed",
    });

    const payments = await paymentsCollection
      .find({
        freelancer_email: email,
      })
      .toArray();

    const totalEarnings = payments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0,
    );

    res.send({
      success: true,
      result: {
        submittedProposals,
        activeProjects,
        completedProjects,
        totalEarnings,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const getClientDashboard = async (req, res) => {
  try {
    const email = req.params.email;

    const tasks = await tasksCollection
      .find({
        client_email: email,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    const payments = await paymentsCollection
      .find({
        client_email: email,
      })
      .toArray();

    const totalTasks = tasks.length;

    const openTasks = tasks.filter((task) => task.status === "open").length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === "in-progress",
    ).length;

    const completedTasks = tasks.filter(
      (task) => task.status === "completed",
    ).length;

    const totalSpent = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    const recentTasks = tasks.slice(0, 5);

    res.send({
      success: true,
      result: {
        totalTasks,
        openTasks,
        inProgressTasks,
        completedTasks,
        totalSpent,
        recentTasks,
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
  getClientDashboard,
};
