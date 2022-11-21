const express = require("express");

const {
  getCalls,
  createCall,
  getCall,
  updateCall,
  deleteCall,
  callNumbersTotal,
} = require("../controllers/OutCall");

const { protect, authorize, suspended } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });
// router.route("/:lotteryId/lager").get(protect, calculateLager);
// router
//   .route("/:lotteryId/call-numbers-total/:customerId")
//   .get(protect, callNumbersTotal);
router.route("/:lotteryId").get(protect,suspended, getCalls).post(protect,suspended, createCall);
router
  .route("/:lotteryId/:callId")
  .get(getCall)
  .put(protect,suspended, updateCall)
  .delete(protect,suspended, deleteCall);

module.exports = router;
