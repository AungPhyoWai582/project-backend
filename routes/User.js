const express = require("express");
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/User");
const agentRouter = require("./Agent");
const { protect, authorize, suspended } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

// router.use("/agents", agentRouter);

router
  .route("/")
  .get(protect,suspended, getUsers)
  .post(protect,suspended, createUser);
router
  .route("/:id")
  .get(protect,suspended, getUser)
  .put(protect,suspended, updateUser)
  .delete(protect,suspended, deleteUser);

module.exports = router;
