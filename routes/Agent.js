const express = require("express");
const {
  getAgent,
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} = require("../controllers/Agent");
const callRouter = require("./Call");
const { protect, authorize, suspanded } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

router.use("/:agentId/call", callRouter);

router
  .route("/")
  .get(protect,suspanded, getAgents)
  .post(protect, suspanded,authorize("Master"), createAgent);
router
  .route("/:id")
  .get(protect,suspanded, getAgent)
  .put(protect, suspanded,authorize("Master"), updateAgent)
  .delete(protect,suspanded, authorize("Master"), deleteAgent);

module.exports = router;
