const express = require("express");
const {
  createAgent,
  getAgent,
  getAgents,
  updateAgent,
} = require("../controllers/Agent");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("Admin"), getAgents)
  .post(protect, authorize("Admin"), createAgent);
router
  .route("/:id")
  .get(protect, authorize("Admin"), getAgent)
  .put(protect, authorize("Admin"), updateAgent);

module.exports = router;
