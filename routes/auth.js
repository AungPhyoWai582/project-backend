const express = require("express");
const {
  createUser,
  loginUser,
  getMe,
  resetPassword,
  getUsers,
  updatePassword,
} = require("../controllers/auth");
const { protect, authorize, suspanded } = require("../middlewares/auth");
const router = express.Router();

// router.route("/agents").get(getAgents);

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/me").get(protect,suspanded, getMe);
router.route("/me/users").get(protect,suspanded, getUsers);
router.route("/resetpassword/:id").put(protect,suspanded,resetPassword);
router.route('/changepassword').put(protect,suspanded,updatePassword);

module.exports = router;
