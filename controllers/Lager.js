const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const User = require("../models/User");
const colors = require("colors");

exports.getLager = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  console.log(req.originalUrl);

  const lager = [];

  const users = await User.find({ createByUser: req.user._id });
  const calls = await Call.find({ user: users.map((usr) => usr._id) }).populate(
    { path: "user", select: "name role" }
  );
  console.log(users);
  console.log(calls);

  const setNumbers = Array.prototype.concat.apply(
    [],
    calls.map((cal) => cal.numbers)
  );
  setNumbers.map((sn, key) => {
    if (lager.length === 0) {
      console.log(lager.length);
      lager.push(sn);
    } else if (lager.map((l) => l.number).includes(sn.number)) {
      lager[lager.findIndex((obj) => obj.number === sn.number)] = {
        number: sn.number,
        amount:
          Number(
            lager[lager.findIndex((obj) => obj.number === sn.number)].amount
          ) + Number(sn.amount),
      };
    } else {
      lager.push(sn);
    }
    // console.log(
    //   colors.bgBlue(
    //     lager[lager.findIndex((l) => l.number === sn.number)].number ===
    //       sn.number
    //   )
    // );
  });

  const total = lager
    .map((l) => Number(l.amount))
    .reduce((pre, next) => pre + next, 0);

  console.log(colors.bgYellow(setNumbers));
  console.log(colors.bgGreen(lager));

  res
    .status(200)
    .json({ success: true, count: lager.length, total: total, data: lager });
});
