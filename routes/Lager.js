const express = require("express");

const {
  getLager,
  getLagers,
  sendLager,
  InOut,
  lagerOut,
  lagerOutUpdate,
} = require("../controllers/Lager");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(protect, getLagers);
router.route("/:lotteryId").get(protect, getLager);
router.route("/:lotteryId/outupdate").put(protect, lagerOutUpdate);
router.route("/:lotteryId/out").put(protect, lagerOut);

module.exports = router;
