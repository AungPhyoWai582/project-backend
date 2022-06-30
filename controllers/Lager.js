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
  // console.log(req.user);
  // console.log(req.originalUrl);

  // const { lotteryId } = req.params;

  // const lager = [];

  // const users = await User.find({ createByUser: req.user._id });
  // const calls = await Call.find({ lottery: lotteryId }).populate({
  //   path: "user",
  //   select: "name role",
  // });

  // const agentsId = users.map((usr) => usr._id);
  // // console.log(users);
  // console.log(agentsId);

  // const setNumbers = Array.prototype.concat.apply(
  //   [],
  //   calls
  //     .filter((fcal) => agentsId.toString().includes(fcal.user._id.toString()))
  //     .map((cal) => cal.numbers)
  // );
  // console.log(setNumbers);
  // setNumbers.map((sn, key) => {
  //   if (lager.length === 0) {
  //     console.log(lager.length);
  //     lager.push(sn);
  //   } else if (lager.map((l) => l.number).includes(sn.number)) {
  //     lager[lager.findIndex((obj) => obj.number === sn.number)] = {
  //       number: sn.number,
  //       amount:
  //         Number(
  //           lager[lager.findIndex((obj) => obj.number === sn.number)].amount
  //         ) + Number(sn.amount),
  //     };
  //   } else {
  //     lager.push(sn);
  //   }
  //   // console.log(
  //   //   colors.bgBlue(
  //   //     lager[lager.findIndex((l) => l.number === sn.number)].number ===
  //   //       sn.number
  //   //   )
  //   // );
  // });

  // const total = lager
  //   .map((l) => Number(l.amount))
  //   .reduce((pre, next) => pre + next, 0);

  // res
  //   .status(200)
  //   .json({ success: true, count: lager.length, total: total, data: lager });
});

// exports.getLager = asyncHandler(async (req, res, next) => {});
