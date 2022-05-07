const express = require("express");

const {
  getBets,
  createBet,
  getBet,
  updateBet,
  deleteBet,
} = require("../controllers/Bet");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.route("/").get(getBets).post(createBet);
router
  .route("/:id")
  .get(protect, authorize("Agent"), getBet)
  .put(protect, authorize("Agent"), updateBet)
  .delete(protect, authorize("Agent"), deleteBet);

module.exports = router;
