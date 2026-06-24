const Stripe = require("stripe");
const { ObjectId } = require("mongodb");

const {
  paymentsCollection,
  proposalsCollection,
  tasksCollection,
} = require("../db/collections");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { amount, proposalId, taskId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: "Flancify Project Payment",
            },

            unit_amount: Number(amount) * 100,
          },

          quantity: 1,
        },
      ],

      mode: "payment",

      metadata: {
        proposalId,
        taskId,
        amount,
      },

      success_url:
        "http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}",

      cancel_url: "http://localhost:3000/payment/cancel",
    });

    res.send({
      success: true,
      url: session.url,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const existingPayment = await paymentsCollection.findOne({
      sessionId,
    });

    if (existingPayment) {
      return res.status(409).send({
        success: false,
        message: "Payment already confirmed",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).send({
        success: false,
        message: "Payment not completed",
      });
    }

    const proposalId = session.metadata.proposalId;

    const taskId = session.metadata.taskId;

    const amount = session.metadata.amount;

    const proposal = await proposalsCollection.findOne({
      _id: new ObjectId(proposalId),
    });

    if (!proposal) {
      return res.status(404).send({
        success: false,
        message: "Proposal not found",
      });
    }

    await paymentsCollection.insertOne({
      sessionId,
      proposalId,
      taskId,
      amount,
      client_email: proposal.client_email,
      freelancer_email: proposal.freelancer_email,
      paid_at: new Date(),
    });

    await proposalsCollection.updateOne(
      {
        _id: new ObjectId(proposalId),
      },
      {
        $set: {
          status: "accepted",
        },
      },
    );

    await proposalsCollection.updateMany(
      {
        task_id: taskId,
        _id: {
          $ne: new ObjectId(proposalId),
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
        _id: new ObjectId(taskId),
      },
      {
        $set: {
          status: "in_progress",
        },
      },
    );

    res.send({
      success: true,
      message: "Payment confirmed successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCheckoutSession,
  confirmPayment,
};
