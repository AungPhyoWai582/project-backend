const express = require("express");
const {
  createMaster,
  getMaster,
  getMasters,
  updateMaster,
  deleteMaster,
} = require("../controllers/Master");
const agentRouter = require("./Agent");
const { protect, authorize, suspended } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

router.use("/agents", agentRouter);

router
  .route("/")
  .get(protect,suspended, getMasters)
  .post(protect,suspended, authorize("Admin"), createMaster);
router
  .route("/:id")
  .get(protect,suspended, getMaster)
  .put(protect,suspended, authorize("Admin"), updateMaster)
  .delete(protect,suspended, authorize("Admin"), deleteMaster);

module.exports = router;
