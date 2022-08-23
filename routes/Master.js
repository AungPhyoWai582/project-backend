const express = require("express");
const {
  createMaster,
  getMaster,
  getMasters,
  updateMaster,
  deleteMaster,
} = require("../controllers/Master");
const agentRouter = require("./Agent");
const { protect, authorize } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

router.use("/agents", agentRouter);

router
  .route("/")
  .get(protect, getMasters)
  .post(protect, authorize("Admin"), createMaster);
router
  .route("/:id")
  .get(protect, getMaster)
  .put(protect, authorize("Admin"), updateMaster)
  .delete(protect, authorize("Admin"), deleteMaster);

module.exports = router;
