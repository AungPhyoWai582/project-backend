const express = require("express");

const { getLager } = require("../controllers/Lager");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.route("/").get(protect, authorize("Master"), getLager);

module.exports = router;
