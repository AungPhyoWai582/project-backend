const express = require("express");

const {
  getBets,
  createCall,
  getBet,
  updateBet,
  deleteBet,
} = require("../controllers/Bet");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.route("/").get(getBets).post(createCall);
router
  .route("/:id")
  .get(protect, authorize("Agent"), getBet)
  .put(protect, authorize("Agent"), updateBet)
  .delete(protect, authorize("Agent"), deleteBet);

module.exports = router;
