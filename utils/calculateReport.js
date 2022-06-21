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
  // console.log(colors.bgBlue(reports, lottery));

  reports.map(async (rp) => {
    let obj;
    // console.log(rp._id);
    if (rp.userId.role === "Agent") {
      const filterCall = calls.filter(
        (cal) => rp.userId._id.toString() === cal.user.toString()
      );
      // console.log(filterCall);

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

      // console.log(colors.blue(win));

      obj = {
        bet: bet,
        commission: com,
        win: win,
        data: {
          calls: [...filterCall.map((fcal) => fcal._id)],
        },
      };
      // console.log(obj);
    } else if (rp.userId.role === "Master") {
      const filterCall = calls.filter((cal) =>
        rp.data.users.includes(cal.user)
      );

      // console.log(colors.bgYellow(filterCall));

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

      // console.log(colors.blue(win));

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
});
