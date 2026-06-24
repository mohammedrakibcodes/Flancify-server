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
const verifyTaskOwner = require("../middleware/verifyTaskOwner");
const checkBlockedUser = require("../middleware/checkBlockedUser");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  checkBlockedUser,
  verifyRole("client"),
  createTask,
);

router.get("/", getAllTasks);

router.get("/latest", getLatestTasks);

router.get("/:id", getTaskById);

router.patch(
  "/:id",
  verifyToken,
  checkBlockedUser,
  verifyRole("client"),
  verifyTaskOwner,
  updateTask,
);

router.patch(
  "/:id/deliverable",
  verifyToken,
  checkBlockedUser,
  verifyRole("freelancer"),
  submitDeliverable,
);

router.delete(
  "/:id",
  verifyToken,
  checkBlockedUser,
  verifyRole("client"),
  verifyTaskOwner,
  deleteTask,
);

module.exports = router;
