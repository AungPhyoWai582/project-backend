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

exports.getLotteries = asyncHandler(async (req, res, next) => {
  const lotteries = await Lottery.find();

  res
    .status(200)
    .json({ success: true, count: lotteries.length, lotteries: lotteries });
});

exports.createLottery = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const lottery = await Lottery.create(req.body);
  const users = (await User.find()).filter((usr) => usr.role !== "Admin");
  const calls = await Call.find({ lottery: lottery._id });
  users.map(async (usr, index) => {
    if (usr.role === "Master") {
      console.log("Master");
      console.log(colors.bgRed(usr));
      const filterUser = await User.find({ createByUser: usr._id.toString() });
      console.log(colors.bgCyan(filterUser));
      const calls = await Call.find({ lottery: lottery });

      console.log(colors.bgYellow(calls));
      console.log(colors.bgYellow(calls));
      const bet = calls
        .map((cal) => Number(cal.totalAmount))
        .reduce((pre, next) => pre + next, 0);

      const com = bet * (usr.commission / 100);

      const win =
        bet -
        com -
        calls
          .map((cal) => Number(cal.win))
          .reduce((pre, next) => pre + next, 0);
      let obj = {
        userId: usr._id,
        createByUser: usr.createByUser,
        type: usr.role,
        lottery: lottery._id,
        commission: 0,
        bet: 0,
        win: 0,
        data: {
          users: [...filterUser.map((fusr) => fusr._id)],
        },
      };

      const lager = {
        lottery: lottery._id,
        user: usr._id,
        createByUser: usr.createByUser,
        type: usr.role,
        _date: lottery._date,
        _time: lottery._time,
      };
      console.log(colors.bgWhite(lager));

      try {
        // await Report.create(obj);
        await Lager.create(lager);
      } catch (error) {
        return next(new ErrorResponse(error, 500));
      }
    }
    if (usr.role === "Agent") {
      const calls = await Call.find({ lottery: lottery });
      console.log("Agent");
      console.log(usr.createByUser.toString());

      console.log(colors.bgYellow(calls));

      const filterCall = calls.filter(
        (cal) => cal.user.toString() === usr._id.toString()
      );

      const bet = filterCall
        .map((cal) => Number(cal.totalAmount))
        .reduce((pre, next) => pre + next, 0);

      const com = bet * (usr.commission / 100);

      const win =
        bet -
        com -
        filterCall
          .map((cal) => Number(cal.win))
          .reduce((pre, next) => pre + next, 0);

      let obj = {
        userId: usr._id,
        createByUser: usr.createByUser,
        type: usr.role,
        lottery: lottery._id,
        bet: bet,
        commission: com,
        win: win,
        data: {
          calls: [...filterCall.map((fcal) => fcal._id)],
        },
      };
      const lager = {
        lottery: lottery._id,
        user: usr._id,
        createByUser: usr.createByUser,
        type: usr.role,
        _date: lottery._date,
        _time: lottery._time,
      };
      console.log(colors.bgGreen(lager));
      try {
        // await Report.create(obj);
        await Lager.create(lager);
      } catch (error) {
        return next(new ErrorResponse("Something was wrong", 500));
      }
    }
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
    calculateLager(lottery);
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
