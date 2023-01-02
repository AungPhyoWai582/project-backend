const express = require("express");
const {
  createAdmin, memberView
} = require("../controllers/Admin");
const { protect } = require("../middlewares/auth");
// const { protect, authorize } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

// router.use("/agents", agentRouter);

router
  .route("/")
  .post(createAdmin);
  
  router.route('/member-view/:id').get(protect,memberView)


module.exports = router;
