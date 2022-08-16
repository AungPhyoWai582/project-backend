const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const colors = require("colors");
const Lager = require("../models/Lager");
const Call = require("../models/Call");

exports.allTotal = asyncHandler(async (req, res, next) => {
  const start = new Date();
  console.log(req.originalUrl);
  const report = [];

  const lager = await Lager.find({
    user: req.user._id,
    _date: {
      $gte: start.getDate(),
    },
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
    return next(new ErrorResponse("Lager not found", 404));
  }

  // const IN = await lager.in;

  console.log(lager);

  lager.map(async (lgr) => {
    console.log(lgr.in.read);
    const mem = [];
    const read = [...lgr.in.read];
    read.map(async (m) => {
      // console.log(m);
      let mcall = await Call.findById(m)
        .populate({
          path: "user",
          select: "username name role",
        })
        .populate({ path: "agent", select: "username name role" });
      console.log(mcall);
      if (!mcall) {
        return next(new ErrorResponse("call not found", 404));
      }
      mem.push({
        totalAmount: mcall.totalAmount,
        commission: mcall.commission,
        win: mcall.win,
      });
      // console.log(colors.bgGreen(obj));
      // mem.push(m);
    });

    let obj = {
      // me: {
      totalAmount: lgr.in.totalAmount,
      commission: lgr.in.commission,
      win: lgr.in.win,
      // },
    };
    console.log(mem);
    report.push(obj);
  });

  // console.log(lager);
  console.log(report);
  // console.log(colors.bgBlue(mem));

  res.status(200).json({
    success: true,
    // data: IN,
    report,
    url: req.originalUrl,
  });
});
