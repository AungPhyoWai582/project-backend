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
const router = express.Router();

router.use("/:masterId/agent", agentRouter);

router
  .route("/")
  .get(getMasters)
  .post(protect, authorize("Admin"), createMaster);
router
  .route("/:id")
  .get(getMaster)
  .put(protect, authorize("Admin"), updateMaster)
  .delete(protect, authorize("Admin"), deleteMaster);

module.exports = router;
