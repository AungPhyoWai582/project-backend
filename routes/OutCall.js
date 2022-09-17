const express = require("express");

const {
  getCalls,
  createCall,
  getCall,
  updateCall,
  deleteCall,
  callNumbersTotal,
} = require("../controllers/OutCall");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });
// router.route("/:lotteryId/lager").get(protect, calculateLager);
// router
//   .route("/:lotteryId/call-numbers-total/:customerId")
//   .get(protect, callNumbersTotal);
router.route("/:lotteryId").get(protect, getCalls).post(protect, createCall);
router
  .route("/:lotteryId/:callId")
  .get(getCall)
  .put(protect, updateCall)
  .delete(protect, deleteCall);

module.exports = router;
