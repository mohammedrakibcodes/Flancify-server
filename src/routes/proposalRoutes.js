const express = require("express");

const {
  createProposal,
  getAllProposals,
  updateProposal,
  acceptProposal,
} = require("../controllers/proposalController");

const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

const router = express.Router();

router.post("/", verifyToken, verifyRole("freelancer"), createProposal);

router.get("/", getAllProposals);

router.patch("/:id", verifyToken, verifyRole("freelancer"), updateProposal);

router.patch("/:id/accept", verifyToken, verifyRole("client"), acceptProposal);

module.exports = router;
