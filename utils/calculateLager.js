const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("./ErrorResponse");
const Call = require("../models/Call");
const User = require("../models/User");
const Report = require("../models/Report");
const Lager = require("../models/Lager");
const colors = require("colors");
const { populate } = require("../models/Call");

exports.calculateLager = asyncHandler(async (lottery) => {
  console.log(colors.bgGreen(lottery.poutTee));
  const lagers = await Lager.find({ lottery: lottery._id });
  console.log(colors.bgBlue(lagers));
});
