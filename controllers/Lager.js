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

  let totalAmount;
  const lager = await Lager.findOne({
    lottery: lotteryId,
    user: _id,
  }).populate({ path: "user", select: "username name role commission" });

  /******* FOR LAGER *******/
  const demolager = [...lager.in.numbers];
  console.log(lager);

  numbers.map((cn) => {
    if (demolager.map((l) => l.number).includes(cn.number)) {
      // console.log(l);
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

exports.lagerOut = asyncHandler(async (req, res, next) => {
  const { customer, numbers } = req.body;
  const { lotteryId } = req.params;
  const { _id, commission } = req.user;

  const lager = await Lager.findOne({
    lottery: lotteryId,
    user: _id,
  }).populate({ path: "user", select: "username name role commission" });

  const inlager = [...lager.in.numbers];
  numbers.map((cn) => {
    // if (inlager.map((l) => l.number).includes(cn.number)) {
    // console.log(l);
    inlager[inlager.findIndex((obj) => obj.number === cn.number)] = {
      number: cn.number,
      amount: (
        Number(
          inlager[inlager.findIndex((obj) => obj.number === cn.number)].amount
        ) - Number(cn.amount)
      ).toString(),
    };
    // }
  });

  const obj = {};
  const inTotal = inlager
    .map((num) => Number(num.amount))
    .reduce((pre, next) => pre + next, 0);
  // const incommission =
  const outTotal = numbers
    .map((num) => Number(num.amount))
    .reduce((pre, next) => pre + next, 0);

  obj.in = {
    numbers: inlager,
    totalAmount: inTotal,
  };

  obj.out = {
    numbers: numbers,
    totalAmount: outTotal,
  };

  const updateLager = await Lager.findByIdAndUpdate(lager._id, obj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    updateLager,
  });
});

exports.lagerOutUpdate = asyncHandler(async (req, res, next) => {
  const { number, amount } = req.body;
  console.log(number, amount);
  const { lotteryId } = req.params;
  const { _id, commission } = req.user;

  const lager = await Lager.findOne({
    lottery: lotteryId,
    user: _id,
  }).populate({ path: "user", select: "username name role commission" });

  const inlager = [...lager.in.numbers];
  const outlager = [...lager.out.numbers];
  // numbers.map((cn) => {
  if (inlager.map((l) => l.number).includes(number)) {
    // consol
    outlager[outlager.findIndex((obj) => obj.number === number)] = {
      number: number,
      amount:
        Number(
          outlager[outlager.findIndex((obj) => obj.number === number)].amount
        ) - Number(amount),
    };
  }
  if (inlager.map((l) => l.number).includes(number)) {
    inlager[inlager.findIndex((obj) => obj.number === number)] = {
      number: number,
      amount: (
        Number(
          inlager[inlager.findIndex((obj) => obj.number === number)].amount
        ) + Number(amount)
      ).toString(),
    };
  }
  // });

  const obj = {};
  const inTotal = inlager
    .map((num) => Number(num.amount))
    .reduce((pre, next) => pre + next, 0);
  // const incommission =
  const outTotal = outlager
    .map((num) => Number(num.amount))
    .reduce((pre, next) => pre + next, 0);

  obj.in = {
    numbers: inlager,
    totalAmount: inTotal,
  };

  obj.out = {
    numbers: outlager,
    totalAmount: outTotal,
  };

  const updateLager = await Lager.findByIdAndUpdate(lager._id, obj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, updateLager });
});
