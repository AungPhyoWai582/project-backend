const express = require("express");

const {
  createLottery,
  getLotteries,
  updateLottery,
  deleteLottery,
} = require("../controllers/Lottery");

const { protect, authorize } = require("../middlewares/auth");
const { calculateReport } = require("../utils/calculateReport");
const { calculatePoutTee } = require("../utils/calculatePoutTee");

const router = express.Router();

router.route("/").get(getLotteries).post(createLottery);
router.route("/:id").put(updateLottery).delete(deleteLottery);

module.exports = router;
