const { database } = require("./db");

const usersCollection = database.collection("users");
const tasksCollection = database.collection("tasks");
const proposalsCollection = database.collection("proposals");
const paymentsCollection = database.collection("payments");
const reviewsCollection = database.collection("reviews");

module.exports = {
  usersCollection,
  tasksCollection,
  proposalsCollection,
  paymentsCollection,
  reviewsCollection,
};
