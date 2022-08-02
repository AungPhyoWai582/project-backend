const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const colors = require("colors");
const Lager = require("../models/Lager");
const ErrorResponse = require("../utils/ErrorResponse");
const { inout } = require("../utils/InOut");

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
  console.log(lager);

  res.status(200).json({ success: true, data: lager });
});

exports.InOut = asyncHandler(async (req, res, next) => {
  const selfUrl = req.originalUrl.split("/").slice(-1).toString();

  const { lotteryId } = req.params;
  const { _id, commission } = req.user;
  const { customer, numbers } = req.body;

  const demolager = [];
  let totalAmount;
  const lager = await Lager.findOne({
    lottery: lotteryId,
    user: _id,
  }).populate({ path: "user", select: "username name role commission" });

  /******* FOR LAGER *******/
  numbers.map((cn) => {
    if (demolager.map((l) => l.number).includes(cn.number)) {
      demolager[demolager.findIndex((obj) => obj.number === cn.number)] = {
        number: cn.number,
        amount: (
          Number(
            demolager[demolager.findIndex((obj) => obj.number === cn.number)]
              .amount
          ) + Number(cn.amount)
        ).toString(),
      };
    } else {
      demolager.push(cn);
    }
  });
  /******************************** */

  /***  FOR TOTAL AMOUNT  */
  if (selfUrl === "in") {
    totalAmount =
      Number(lager.in.totalAmount) +
      Number(
        numbers
          .map((num) => Number(num.amount))
          .reduce((pre, next) => pre + next, 0)
      );
  }

  if (selfUrl === "out") {
    totalAmount =
      Number(lager.out.totalAmount) +
      Number(
        numbers
          .map((num) => Number(num.amount))
          .reduce((pre, next) => pre + next, 0)
      );
  }

  /****************************************************** */

  /***********FOR COMMISSION*************** */
  const com = totalAmount * (commission / 100);

  /**************************************** */

  /*********FOR UPDATE LAGER ********** */
  const obj = {};
  const read = [...lager.in.read];
  const send = [...lager.out.send];

  if (selfUrl === "in") {
    console.log("in");
    read.push(req.body);
    obj.in = {
      numbers: demolager,
      totalAmount: totalAmount,
      commission: com,
      read: read,
    };
    console.log(read);
  }

  if (selfUrl === "out") {
    console.log("out");
    send.push(req.body);
    obj.out = {
      numbers: demolager,
      totalAmount: totalAmount,
      commission: com,
      send: send,
    };
    console.log(send);
  }

  console.log(obj);

  const updateLager = await Lager.findByIdAndUpdate(lager._id, obj, {
    new: true,
    runValidators: true,
  });

  // const updateLager = inout(numbers, lotteryId, selfUrl);

  res.status(200).json({ success: true, updateLager });
});
