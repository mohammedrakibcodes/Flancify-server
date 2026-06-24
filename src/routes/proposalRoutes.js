const express = require("express");

const {
  createProposal,
  getAllProposals,
  updateProposal,
} = require("../controllers/proposalController");

const router = express.Router();

router.post("/", createProposal);
router.get("/", getAllProposals);
router.patch("/:id", updateProposal);

module.exports = router;
