const express = require("express");

const { getLager } = require("../controllers/Lager");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.route("/:lotteryId").get(protect, getLager);

module.exports = router;
