const express = require("express");
const {
  getAgent,
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} = require("../controllers/Agent");
const callRouter = require("./Call");
const { protect, authorize } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

router.use("/:agentId/call", callRouter);

router
  .route("/")
  .get(getAgents)
  .post(protect, authorize("Master"), createAgent);
router
  .route("/:id")
  .get(getAgent)
  .put(protect, authorize("Master"), updateAgent)
  .delete(protect, authorize("Master"), deleteAgent);

module.exports = router;
