const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const colors = require("colors");
const Lager = require("../models/Lager");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getLagers = asyncHandler(async (req, res, next) => {
  const lagers = await Lager.find({ user: req.user._id })
    .populate({
      path: "user",
      select: "username name",
    })
    .populate({
      path: "createByUser",
      select: "username role",
    });
  if (!lagers) {
    return next(new ErrorResponse("Lagers not found", 404));
  }

  res.status(200).json({
    success: true,
    data: lagers,
  });
});

exports.getLager = asyncHandler(async (req, res, next) => {
  const lager = await Lager.findOne({
    lottery: req.params.lotteryId,
    user: req.user._id,
  })
    .populate({
      path: "user",
      select: "username name",
    })
    .populate({
      path: "createByUser",
      select: "username role",
    });

  if (!lager) {
    return next(new ErrorResponse("There is no lager", 404));
  }

  res.status(200).json({ success: true, data: lager });
});

exports.sendLager = asyncHandler(async (req, res, next) => {
  // const { data } = req.body;

  // const send = await Lager.find({
  //   user: req.user.createByUser,
  //   lottery: data.id,
  // })
  //   .populate({
  //     path: "user",
  //     select: "username name",
  //   })
  //   .populate({
  //     path: "createByUser",
  //     select: "username role",
  //   });
  res.status(200).json({
    success: true,
    msg: "Sended OK",
    data: { user: req.user._id, data: req.body },
  });
});
