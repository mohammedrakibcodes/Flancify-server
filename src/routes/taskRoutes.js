const express = require("express");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getLatestTasks,
  submitDeliverable,
} = require("../controllers/taskController");

const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

const router = express.Router();

router.post("/", verifyToken, verifyRole("client"), createTask);

router.get("/", getAllTasks);

router.get("/latest", getLatestTasks);

router.get("/:id", getTaskById);

router.patch("/:id", verifyToken, verifyRole("client"), updateTask);

router.patch(
  "/:id/deliverable",
  verifyToken,
  verifyRole("freelancer"),
  submitDeliverable,
);

router.delete("/:id", verifyToken, verifyRole("client"), deleteTask);

module.exports = router;
