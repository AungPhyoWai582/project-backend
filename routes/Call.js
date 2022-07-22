const express = require("express");

const {
  getCalls,
  createCall,
  getCall,
  updateCall,
  deleteCall,
} = require("../controllers/Call");

const { protect, authorize } = require("../middlewares/auth");
const { calculateLager } = require("../utils/calculateLager");

const router = express.Router({ mergeParams: true });
router.route("/:lotteryId/lager").get(protect, calculateLager);
router.route("/:lotteryId").get(protect, getCalls).post(protect, createCall);
router
  .route("/:lotteryId/:callId")
  .get(getCall)
  .put(protect, authorize("Agent"), updateCall)
  .delete(protect, authorize("Agent"), deleteCall);

module.exports = router;
