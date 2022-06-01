const express = require("express");

const {
  getCalls,
  getAgents,
  getMasters,
  getAdmins,
  agentReports,
  getMaster_select_agents,
} = require("../controllers/Report");
const callRouter = require("./Call");
const agentRouter = require("./Agent");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.use("/agent/calls", protect, callRouter);
router.use("/master/agents", protect, getMaster_select_agents);

router.route("/calls").get(getCalls);
router.route("/agent").get(protect, agentReports);
// router.route("/:agentId", getAgents);
router.route("/master").get(protect, getMasters);
router.route("/admin").get(getAdmins);

module.exports = router;
