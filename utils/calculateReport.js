const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("./ErrorResponse");
const Call = require("../models/Call");
const User = require("../models/User");
const Report = require("../models/Report");
const colors = require("colors");

exports.calculateReport = asyncHandler(async (lottery) => {
  // let { lottery } = req.body;
  const users = (await User.find()).filter((usr) => usr.role !== "Admin");
  // console.log(colors.bgYellow(users));
  const calls = await Call.find({ lottery: lottery._id });
  const reports = await Report.find({ lottery: lottery._id }).populate({
    path: "userId",
    select: "username role commission",
  });
  console.log(colors.bgBlue(reports, lottery));

  reports.map(async (rp) => {
    let obj;
    console.log(rp._id);
    if (rp.userId.role === "Agent") {
      const filterCall = calls.filter(
        (cal) => cal.user.toString() === rp.userId._id.toString()
      );
      console.log(filterCall);

      const bet = filterCall
        .map((cal) => Number(cal.totalAmount))
        .reduce((pre, next) => pre + next, 0);

      const com = bet * (rp.userId.commission / 100);

      const win =
        bet -
        com -
        filterCall
          .map((cal) => Number(cal.win))
          .reduce((pre, next) => pre + next, 0);

      obj = {
        bet: bet,
        commission: com,
        win: win,
        data: {
          calls: [...filterCall.map((fcal) => fcal._id)],
        },
      };
      console.log(obj);
    } else if (rp.userId.role === "Master") {
      const filterCall = calls.filter((cal) =>
        rp.data.users.includes(cal.user)
      );

      console.log(colors.bgYellow(filterCall));

      const bet = filterCall
        .map((cal) => Number(cal.totalAmount))
        .reduce((pre, next) => pre + next, 0);

      const com = bet * (rp.userId.commission / 100);

      const win =
        bet -
        com -
        filterCall
          .map((cal) => Number(cal.win))
          .reduce((pre, next) => pre + next, 0);

      obj = {
        bet: bet,
        commission: com,
        win: win,
        data: {
          users: [...rp.data.users],
        },
      };
    }
    console.log(colors.yellow(obj));
    await Report.findByIdAndUpdate(rp._id, obj, {
      new: true,
      runValidators: true,
    });
  });

  console.log(colors.green("Successfully Calculate Report"));

  // users.map(async (usr, index) => {
  //   if (usr.role === "Agent") {
  //     // console.log(usr.createByUser.toString());

  //     const filterCall = calls.filter(
  //       (cal) => cal.user.toString() === usr._id.toString()
  //     );

  //     const bet = filterCall
  //       .map((cal) => Number(cal.totalAmount))
  //       .reduce((pre, next) => pre + next, 0);

  //     const com = bet * (usr.commission / 100);

  //     const win =
  //       bet -
  //       com -
  //       filterCall
  //         .map((cal) => Number(cal.win))
  //         .reduce((pre, next) => pre + next, 0);

  //     let obj = {
  //       userId: usr._id,
  //       createByUser: usr.createByUser,
  //       type: usr.role,
  //       lottery: lotteryId,
  //       bet: bet,
  //       commission: com,
  //       win: win,
  //       data: {
  //         calls: [...filterCall.map((fcal) => fcal._id)],
  //       },
  //     };
  //     // console.log(colors.bgGreen(obj));
  //     try {
  //       await Report.findByIdAndUpdate(obj);
  //     } catch (error) {
  //       return next(new ErrorResponse("Something was wrong", 500));
  //     }
  //   } else if (usr.role === "Master") {
  //     // console.log(colors.bgRed(usr));
  //     const filterUser = await User.find({ createByUser: usr._id.toString() });
  //     console.log(colors.bgCyan(filterUser));
  //     const calls = await Call.find({ user: filterUser.map((fusr) => fusr) });
  //     const bet = calls
  //       .map((cal) => Number(cal.totalAmount))
  //       .reduce((pre, next) => pre + next, 0);

  //     const com = bet * (usr.commission / 100);

  //     const win =
  //       bet -
  //       com -
  //       calls
  //         .map((cal) => Number(cal.win))
  //         .reduce((pre, next) => pre + next, 0);
  //     let obj = {
  //       userId: usr._id,
  //       createByUser: usr.createByUser,
  //       type: usr.role,
  //       lottery: lotteryId,
  //       commission: com,
  //       bet: bet,
  //       win: win,
  //       data: {
  //         users: [...filterUser.map((fusr) => fusr._id)],
  //       },
  //     };
  //     // console.log(colors.bgWhite(obj));
  //     try {
  //       await Report.create(obj);
  //     } catch (error) {
  //       return next(new ErrorResponse(error, 500));
  //     }
  //   }
  // });
  // res.status(200).json({ success: true, result: reports });
});
