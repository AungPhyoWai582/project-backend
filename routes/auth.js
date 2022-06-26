const express = require("express");
const {
  createUser,
  loginUser,
  getMe,
  resetPassword,
  getUsers,
} = require("../controllers/auth");
const { protect, authorize } = require("../middlewares/auth");
const router = express.Router();

// router.route("/agents").get(getAgents);

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/me/").get(getMe);
router.route("/me/users").get(protect, getUsers);
router.route("/resetpassword/:id").put(resetPassword);

module.exports = router;
