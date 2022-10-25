const express = require("express");

const {
  membersCollections,
  outCollections,
  daily,
  dailyMembers,
  mainCollections,
} = require("../controllers/Report");
const callRouter = require("./Call");
const agentRouter = require("./Agent");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.route("/members-collections").get(protect, membersCollections);
router.route("/main-collections").get(protect,mainCollections);
router.route("/total-out").get(protect, outCollections);
router.route("/daily").get(protect, daily);
router.route("/daily/members").get(protect, dailyMembers);

module.exports = router;
