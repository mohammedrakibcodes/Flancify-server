const express = require("express");

const {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserByQueryEmail,
  updateUser,
  getTopFreelancers,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/email", getUserByQueryEmail);
router.get("/id/:id", getUserById);
router.get("/freelancers/top", getTopFreelancers);
router.get("/:email", getUserByEmail);
router.patch("/:id", updateUser);

module.exports = router;
