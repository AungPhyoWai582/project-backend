const express = require("express");
const {
  createMaster,
  getMaster,
  getMasters,
  updateMaster,
  deleteMaster,
} = require("../controllers/Master");
const agentRouter = require("./Agent");
const { protect, authorize, suspanded } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

router.use("/agents", agentRouter);

router
  .route("/")
  .get(protect,suspanded, getMasters)
  .post(protect,suspanded, authorize("Admin"), createMaster);
router
  .route("/:id")
  .get(protect,suspanded, getMaster)
  .put(protect,suspanded, authorize("Admin"), updateMaster)
  .delete(protect,suspanded, authorize("Admin"), deleteMaster);

module.exports = router;
