const express = require("express");
const { result } = require("../controllers/Result");
const { createAgent } = require("../controllers/Report");

const { protect, authorize } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

router.post("/", result);

module.exports = router;
