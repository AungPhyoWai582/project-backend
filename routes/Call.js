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

router.route("/").get(protect, getBets).post(protect, createCall);
router
  .route("/:id")
  .get(protect, getBet)
  .put(protect, authorize("Agent"), updateBet)
  .delete(protect, authorize("Agent"), deleteBet);

module.exports = router;
