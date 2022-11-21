const express = require("express");
const {
  getAgent,
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} = require("../controllers/Agent");
const callRouter = require("./Call");
const { protect, authorize, suspended } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

router.use("/:agentId/call", callRouter);

router
  .route("/")
  .get(protect,suspended, getAgents)
  .post(protect, suspended,authorize("Master"), createAgent);
router
  .route("/:id")
  .get(protect,suspended, getAgent)
  .put(protect, suspended,authorize("Master"), updateAgent)
  .delete(protect,suspended, authorize("Master"), deleteAgent);

module.exports = router;
