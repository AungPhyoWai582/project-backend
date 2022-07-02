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
  const data = req.body;
  let updateLager;

  data.map(async (d, key) => {
    console.log(d);
    const lager = await Lager.findOne({
      user: req.user.createByUser,
      lottery: d.lottery,
    }).populate({ path: "user", select: "username name role commission" });
    console.log(colors.bgGreen(lager));

    const demolager = lager.call;
    const downline = lager.downline;
    const callNumbers = d.call;

    console.log(typeof downline, typeof demolager, typeof callNumbers);

    // // for downline
    downline.push(d);

    // for lager call
    callNumbers.map((cn) => {
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

    // for lager bet
    const bet = Number(lager.totalAmount) + Number(d.totalAmount);

    // for lager commission
    const com = bet * (lager.user.commission / 100);

    let obj = {
      call: demolager,
      totalAmount: bet,
      downline: downline,
      commission: com,
    };

    console.log(colors.bgYellow(obj));

    await Lager.findByIdAndUpdate(
      lager._id,
      {
        call: demolager,
        totalAmount: bet,
        downline: downline,
        commission: com,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  });
  res.status(200).json({
    success: true,
    msg: "Sended OK",
    data: { user: req.user._id, data: req.body },
  });
});
