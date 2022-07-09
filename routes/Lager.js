const express = require("express");

const {
  getLager,
  getLagers,
  sendLager,
  sell,
} = require("../controllers/Lager");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.route("/:lotteryId").get(protect, getLager).put(protect, sell);
router.route("/").get(protect, getLagers).post(protect, sendLager);

module.exports = router;
