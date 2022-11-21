const express = require("express");

const {
  getCalls,
  createCall,
  getCall,
  updateCall,
  deleteCall,
  callNumbersTotal,
} = require("../controllers/OutCall");

const { protect, authorize, suspanded } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });
// router.route("/:lotteryId/lager").get(protect, calculateLager);
// router
//   .route("/:lotteryId/call-numbers-total/:customerId")
//   .get(protect, callNumbersTotal);
router.route("/:lotteryId").get(protect,suspanded, getCalls).post(protect,suspanded, createCall);
router
  .route("/:lotteryId/:callId")
  .get(getCall)
  .put(protect,suspanded, updateCall)
  .delete(protect,suspanded, deleteCall);

module.exports = router;
