const express = require("express");
const {
  createUser,
  loginUser,
  getMe,
  resetPassword,
  getUsers,
  updatePassword,
} = require("../controllers/auth");
const { protect, authorize, suspended } = require("../middlewares/auth");
const router = express.Router();

// router.route("/agents").get(getAgents);

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/me").get(protect,suspended, getMe);
router.route("/me/users").get(protect,suspended, getUsers);
router.route("/resetpassword/:id").put(protect,suspended,resetPassword);
router.route('/changepassword').put(protect,suspended,updatePassword);

module.exports = router;
