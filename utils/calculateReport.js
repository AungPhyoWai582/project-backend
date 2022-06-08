const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const colors = require("colors");

exports.calculateReport = asyncHandler(async (req, res, next) => {
  const users = (await User.find()).filter((usr) => usr.role !== "Admin");
  const calls = await Call.find();
  users.map(async (usr, index) => {
    if (usr.role === "Agent") {
      console.log(usr.createByUser.toString());
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
        type: usr.role,
        bet: bet,
        commission: com,
        win: win,
      };
      console.log(colors.bgGreen(obj));
    } else if (usr.role === "Master") {
      const filterUser = await User.find({ createByUser: usr._id.toString() });
      console.log(colors.bgCyan(filterUser));
      const calls = await Call.find({ user: filterUser.map((fusr) => fusr) });
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
        type: usr.role,
        bet: bet,
        win: win,
      };
      console.log(colors.bgWhite(obj));
    }
  });
  res.status(200).json({ success: true, result: "POUT TEE", users });
});
