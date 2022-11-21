const express = require("express");

const {
  getLager,
  getLagers,
  sendLager,
  InOut,
  lagerOut,
  lagerOutUpdate,
  updateLager
} = require("../controllers/Lager");

const { protect, authorize, suspanded } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(protect,suspanded, getLagers);
router.route("/:lotteryId").get(protect,suspanded, getLager);
router.route("/:lagerId").put(protect,suspanded, updateLager);
router.route("/:lotteryId/outupdate").put(protect,suspanded, lagerOutUpdate);
router.route("/:lotteryId/out").put(protect,suspanded, lagerOut);

module.exports = router;
