const express = require("express");

const { getLager, getLagers } = require("../controllers/Lager");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.route("/:lotteryId").get(protect, getLager);
router.route("/").get(protect, getLagers);

module.exports = router;
