const express = require("express");

const {
  createProposal,
  getAllProposals,
  updateProposal,
  acceptProposal,
  getFreelancerProposals,
  getTaskProposals,
} = require("../controllers/proposalController");

const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const verifyEmailOwner = require("../middleware/verifyEmailOwner");

const router = express.Router();

router.post("/", verifyToken, verifyRole("freelancer"), createProposal);

router.get("/", getAllProposals);

router.get(
  "/freelancer/:email",
  verifyToken,
  verifyEmailOwner,
  getFreelancerProposals,
);

router.get(
  "/task/:taskId",
  verifyToken,
  verifyRole("client"),
  getTaskProposals,
);

router.patch("/:id", verifyToken, verifyRole("freelancer"), updateProposal);

router.patch("/:id/accept", verifyToken, verifyRole("client"), acceptProposal);

module.exports = router;
