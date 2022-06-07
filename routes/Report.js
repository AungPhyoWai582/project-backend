const express = require("express");

const {
  getCalls,
  getAgents,
  getMasters,
  getAdmins,
  agentReports,
  getMaster_select_agents,
  getMaster_select_agents_select_agentId,
} = require("../controllers/Report");
const callRouter = require("./Call");
const agentRouter = require("./Agent");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.use("/agent/calls", protect, callRouter);
router.route("/master/agents").get(protect, getMaster_select_agents);
router.route("/master/agents/:agentId").get(protect, agentReports);
router.use("/master/agents/:agentId/calls", protect, callRouter);

// router.route("/calls").get(getCalls);
router.route("/agent").get(protect, agentReports);
// router.route("/:agentId", getAgents);
router.route("/master").get(protect, getMasters);
router.route("/admin").get(getAdmins);

module.exports = router;
