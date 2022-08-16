const express = require("express");

const { allTotal } = require("../controllers/Report");
const callRouter = require("./Call");
const agentRouter = require("./Agent");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.route("/all-total").get(protect, allTotal);

module.exports = router;
