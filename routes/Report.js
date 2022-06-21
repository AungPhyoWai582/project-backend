const express = require("express");

const {
  masterReports,
  getAdmins,
  agentReports,
  getMaster_select_agents,
} = require("../controllers/Report");
const callRouter = require("./Call");
const agentRouter = require("./Agent");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.use("/agent/calls", protect, callRouter);
router.route("/master/agents/:lotteryId").get(protect, getMaster_select_agents);
router.route("/master/agents/:agentId/:lotteryId").get(protect, agentReports);
router.use("/master/agents/:agentId/calls", protect, callRouter);

// router.route("/calls").get(getCalls);
router.route("/agent/:lotteryId").get(protect, agentReports);
// router.route("/:agentId", getAgents);
router
  .route("/master/:lotteryId")
  .get(protect, authorize("Master"), masterReports);
router.route("/admin").get(getAdmins);

module.exports = router;
