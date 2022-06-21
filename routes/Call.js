const express = require("express");

const {
  getCalls,
  createCall,
  getCall,
  updateCall,
  deleteCall,
} = require("../controllers/Call");

const { protect, authorize } = require("../middlewares/auth");
const { calculateReport } = require("../utils/calculateReport");

const router = express.Router({ mergeParams: true });

router
  .route("/:lotteryId")
  .get(getCalls)
  .post(protect, authorize("Agent"), createCall);
router
  .route("/:lotteryId/:callId")
  .get(getCall)
  .put(protect, authorize("Agent"), updateCall)
  .delete(protect, authorize("Agent"), deleteCall);

module.exports = router;
