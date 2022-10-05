const express = require("express");
const {
  createAdmin
} = require("../controllers/Admin");
// const { protect, authorize } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

// router.use("/agents", agentRouter);

router
  .route("/")
  .post(createAdmin);


module.exports = router;
