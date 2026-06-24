const express = require("express");

const {
  getAllUsersAdmin,
  toggleUserBlock,
  getAllTasksAdmin,
  deleteTaskAdmin,
  getTransactions,
} = require("../controllers/adminController");

const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

const router = express.Router();

router.get("/users", verifyToken, verifyRole("admin"), getAllUsersAdmin);

router.patch("/block/:id", verifyToken, verifyRole("admin"), toggleUserBlock);

router.get("/tasks", verifyToken, verifyRole("admin"), getAllTasksAdmin);

router.delete("/tasks/:id", verifyToken, verifyRole("admin"), deleteTaskAdmin);

router.get("/payments", verifyToken, verifyRole("admin"), getTransactions);

module.exports = router;
