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

const { protect, authorize, suspended } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(protect,suspended, getLagers);
router.route("/:lotteryId").get(protect,suspended, getLager);
router.route("/:lagerId").put(protect,suspended, updateLager);
router.route("/:lotteryId/outupdate").put(protect,suspended, lagerOutUpdate);
router.route("/:lotteryId/out").put(protect,suspended, lagerOut);

module.exports = router;
