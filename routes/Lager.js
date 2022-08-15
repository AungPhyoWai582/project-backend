const express = require("express");

const {
  getLager,
  getLagers,
  sendLager,
  InOut,
} = require("../controllers/Lager");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(protect, getLagers);
router.route("/:lotteryId").get(protect, getLager);
router.route("/:lotteryId/in").post(protect, InOut);
router.route("/:lotteryId/out").post(protect, InOut);

module.exports = router;
