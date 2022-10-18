const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const Lottery = require("../models/Lottery");
const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const colors = require("colors");
const Report = require("../models/Report");
const Lager = require("../models/Lager");
const { calculateReport } = require("../utils/calculateReport");
const { calculatePoutTee } = require("../utils/calculatePoutTee");
const { calculateLager } = require("../utils/calculateLager");
const OutCall = require("../models/OutCall");
const { report } = require("../routes/Call");

exports.getLotteries = asyncHandler(async (req, res, next) => {
  const lotteries = await Lottery.find();

  res
    .status(200)
    .json({ success: true, count: lotteries.length, lotteries: lotteries });
});

exports.createLottery = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const lottery = await Lottery.create(req.body);
  // const users = (await User.find()).filter((usr) => usr.role !== "Admin");
  const users = await User.find();
  // const calls = await Call.find({ lottery: lottery._id });
  users.map(async (usr, index) => {
    let obj = {
      lottery: lottery._id,
      user: usr._id,
      createByUser: usr.createByUser,
      type: usr.role,
      _date: lottery._date,
      _time: lottery._time,
    };
    const lager = await Lager.create(obj);

    if (!lager) {
      return next(
        new ErrorResponse(`There is no lager,something went wrong`, 404)
      );
    }
    // await Report.create({
    //   user: usr._id,
    //   Lottery: lottery._id,
    //   Role: usr.role,
    //   Type: "In",
    //   Divider: usr.divider,
    //   Lager: lager._id,
    //   Date: lottery._date,
    //   Time: lottery._time,
    // });
  });
  res.status(201).json({ success: true, lottery: lottery });
});

exports.updateLottery = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  const lottery = await Lottery.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!lottery) {
    return next(new ErrorResponse(`Lottery not found with id of ${id}`, 404));
  }

  if (lottery.pout_tee !== null) {
    console.log("pouttee");
    calculatePoutTee(lottery);
    // calculateLager(lottery);
  }
  res.status(200).json({ success: true, lottery: lottery });
});

exports.deleteLottery = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const lottery = await Lottery.findByIdAndDelete(id);
  const lagers = await Lager.deleteMany({ lottery: id });
  const calls = await Call.deleteMany({ lottery: id });
  const outcalls = await OutCall.deleteMany({ lottery: id });

  if (!lottery) {
    return next(new ErrorResponse(`Lottery not found with id of ${id}`, 404));
  }
  if (!lagers) {
    return next(new ErrorResponse(`Lagers not found with id of ${id}`, 404));
  }
  if (!calls) {
    return next(new ErrorResponse(`Calls not found with id of ${id}`, 404));
  }
  if (!outcalls) {
    return next(
      new ErrorResponse(`Out calls not found width id of ${id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
