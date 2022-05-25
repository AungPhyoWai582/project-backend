const express = require("express");

const { getReports } = require("../controllers/Report");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.route("/calls").get(getReports);
router.route("/agent").get(getReports);
router.route("/master").get(getReports);
router.route("/admin").get(getReports);

module.exports = router;
