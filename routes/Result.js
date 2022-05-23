const express = require("express");
const { result } = require("../controllers/Result");

const { protect, authorize } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

router.post("/", result);

module.exports = router;
