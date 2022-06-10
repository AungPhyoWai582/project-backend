const express = require("express");

const {
  getCalls,
  createCall,
  getCall,
  updateCall,
  deleteCall,
} = require("../controllers/Call");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getCalls)
  .post(protect, authorize("Agent"), createCall);
router
  .route("/:callId")
  .get(getCall)
  .put(protect, authorize("Agent"), updateCall)
  .delete(protect, authorize("Agent"), deleteCall);

module.exports = router;
