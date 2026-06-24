const express = require("express");

const {
  createUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:email", getUserByEmail);
router.patch("/:id", updateUser);

module.exports = router;
