const express = require("express");
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/User");
const callRouter = require("./Call");
const { protect, authorize } = require("../middlewares/auth");
const router = express.Router();

// router.use("/:agentId/call", callRouter);

router.route("/").get(getUsers).post(protect, authorize("Admin"), createUser);
router
  .route("/:id")
  .get(getUser)
  .put(protect, authorize("Admin"), updateUser)
  .delete(protect, authorize("Admin"), deleteUser);

module.exports = router;
