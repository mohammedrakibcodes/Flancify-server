const express = require("express");

const {
  getAllUsersAdmin,
  toggleUserBlock,
  getAllTasksAdmin,
  deleteTaskAdmin,
  getTransactions,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", getAllUsersAdmin);
router.patch("/block/:id", toggleUserBlock);
router.get("/tasks", getAllTasksAdmin);
router.delete("/tasks/:id", deleteTaskAdmin);
router.get("/payments", getTransactions);

module.exports = router;
