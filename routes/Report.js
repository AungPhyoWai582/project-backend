const express = require("express");

const { membersCollections, outCollections } = require("../controllers/Report");
const callRouter = require("./Call");
const agentRouter = require("./Agent");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.route("/members-collections").get(protect, membersCollections);
router.route("/total-out").get(protect, outCollections);

module.exports = router;
