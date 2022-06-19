const asyncHandler = require("../middlewares/async");
const Lottery = require("../models/Lottery");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getLotteries = asyncHandler(async (req, res, next) => {
  const lotteries = await Lottery.find();

  res
    .status(200)
    .json({ success: true, count: lotteries.length, lotteries: lotteries });
});

exports.createLottery = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const lottery = await Lottery.create(req.body);
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
  res.status(200).json({ success: true, lottery: lottery });
});

exports.deleteLottery = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const lottery = await Lottery.findByIdAndDelete(id);

  if (!lottery) {
    return next(new ErrorResponse(`Lottery not found with id of ${id}`, 404));
  }
  res.status(200).json({ success: true, data: {} });
});
