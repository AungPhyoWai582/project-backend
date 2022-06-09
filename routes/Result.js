const express = require("express");
const { result } = require("../controllers/Result");
const { createAgent } = require("../controllers/Report");

const { protect, authorize } = require("../middlewares/auth");
const { calculateReport } = require("../utils/calculateReport");
const router = express.Router({ mergeParams: true });

router.post("/", result, calculateReport);

module.exports = router;
