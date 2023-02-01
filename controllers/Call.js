const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const crypto = require("crypto");
// const Report = require("../models/Report");

const colors = require("colors");
const Report = require("../models/Report");
const Lager = require("../models/Lager");
const { calculateReport } = require("../utils/calculateReport");
const { calculateLager } = require("../utils/calculateLager");
const User = require("../models/User");
const Customer = require("../models/Customer");
const { removeListener } = require("../models/Call");
const moment = require("moment");

const { filterShortCut } = require("../utils/filterCallForShortcut");

// Desc    GET USERS
// Route   GET api/v1/users/:agentId/calls
exports.getCalls = asyncHandler(async (req, res, next) => {
  console.log(req.originalUrl);
  let query;
  let calls;
  const { _id } = req.user;
  const { lotteryId } = req.params;

  console.log(colors.bgGreen(_id, lotteryId));

  query = await Call.find({ lottery: lotteryId })
    .populate({
      path: "user",
      select: "name role",
    })
    .populate({
      path: "customer",
      select: "name",
    })
    .populate({
      path: "agent",
      select: "name role",
    })
    .populate({
      path: "master",
      select: "name role",
    });

  if (_id) {
    calls = query.filter((f, key) => f.user._id.toString() === _id.toString());
  } else {
    calls = query;
  }

  if (!calls) {
    return next(new ErrorResponse("Here no have bet lists", 404));
  }

  const newCalls = filterShortCut(calls)
  // const newCalls = calls

  // test

  // console.log(calls);
  // console.log(colors.bgBlue(calls));

  res.status(200).json({
    success: true,
    count: newCalls.length,
    data: newCalls,
    selfUrl: req.originalUrl,
  });
});

// Desc    GET USER
// Route   GET api/v1/agents/:agentId/calls
exports.getCall = asyncHandler(async (req, res, next) => {
  const call = await Call.findById(req.params.callId).populate({
    path: "user",
    select: "name role",
  });

  if (!call) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.callId}`, 404)
    );
  }

  const newCall = filterShortCut(call)

  res.status(200).json({ success: true, data: newCall });
});

// Desc    CREATE CALL
// Route   POST api/v1/agents/:agentId/calls
exports.createCall = asyncHandler(async (req, res, next) => {
  let betTime = moment(Date.now()).format("YYYY-MM-DD");

  console.log(betTime);

  let tAmt = req.body.numbers
    .map((item) => Number(item.amount))
    .reduce((pre, next) => pre + next, 0);
  // console.log(tAmt);
  let comUser;
  if (req.body.master) {
    comUser = await User.findById(req.body.master);
  } else if (req.body.agent) {
    comUser = await User.findById(req.body.agent);
  } else if (req.body.customer) {
    comUser = await Customer.findById(req.body.customer);
  }

  console.log(comUser);

  // Add user to req.body
  req.body.callId = Date.now().toString();
  req.body.user = req.user._id;
  req.body.user_role = req.user.role;
  req.body.lottery = req.params.lotteryId;
  req.body.totalAmount = tAmt;
  req.body.commission = tAmt * (comUser.commission / 100);
  req.body.win = Number(tAmt) - Number(tAmt * (comUser.commission / 100));
  req.body.betTime = betTime;

  console.log(req.body);
  // const lottery = await Lottery.findById(req.params.lotteryId);

  const call = await Call.create(req.body);

  if (!call) {
    return next(new ErrorResponse("Something was wrong", 500));
  }

  // For Lager

  const lager = await Lager.findOne({
    lottery: req.params.lotteryId,
    user: req.user._id,
  }).populate({ path: "user", select: "username name role commission" });

  // console.log(lager);
  const demolager = lager.numbers;

  const callNumbers = call.numbers;
  // const demolager = [...In.numbers];

  // console.log(demolager, callNumbers);

  // // for lager call
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
  const totalAmount = Number(lager.totalAmount) + Number(call.totalAmount);

  const updateLager = await Lager.findById(lager._id);

  // updateLager.calls = calls;
  updateLager.numbers = demolager;
  updateLager.totalAmount = totalAmount;
  updateLager.win = totalAmount;
  // updateLager.in.commission = com;

  const upL = await updateLager.save();

  res.status(201).json({
    success: true,
    data: call,
    lager: upL,
  });
});

// Desc    UPDATE USERS
// Route   PUT api/v1/user/:id
exports.updateCall = asyncHandler(async (req, res, next) => {
  const democall = await Call.findById(req.params.callId);

  let removeNumbers;
  const updateCallNumbers = req.body.numbers.filter((obj) => {
    console.log(obj);
    if (obj.amount == "0") {
      removeNumbers =
        democall.numbers[
          democall.numbers.findIndex(
            (fn) => fn.number.toString() === obj.number.toString()
          )
        ];
    } else {
      return obj;
    }
  });

  let tAmt = updateCallNumbers
    .map((item) => Number(item.amount))
    .reduce((pre, next) => pre + next, 0);
  console.log(tAmt);

  const comUser = await User.findById(democall.master);

  const commission = tAmt * (comUser.commission / 100);
  const win = Number(tAmt) - Number(tAmt * (comUser.commission / 100));
  console.log(updateCallNumbers);

  const call = await Call.findByIdAndUpdate(
    req.params.callId,
    {
      numbers: updateCallNumbers,
      totalAmount: tAmt,
      commission: commission,
      win: win,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!call) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.callId}`, 404)
    );
  }

  // // For Lager

  const lager = await Lager.findOne({
    lottery: req.params.lotteryId,
    user: req.user._id,
  }).populate({ path: "user", select: "username name role commission" });

  console.log(lager);
  const demolager = lager.numbers;

  const callNumbers = call.numbers;
  // const demolager = [...In.numbers];

  // console.log(demolager, callNumbers);

  // // for lager call
  callNumbers.map((cn) => {
    if (demolager.map((l) => l.number).includes(cn.number)) {
      demolager[demolager.findIndex((obj) => obj.number === cn.number)] = {
        number: cn.number,
        amount: (
          Number(
            demolager[demolager.findIndex((obj) => obj.number === cn.number)]
              .amount
          ) +
          (Number(cn.amount) -
            Number(
              democall.numbers[
                democall.numbers.findIndex((obj) => obj.number === cn.number)
              ].amount
            ))
        ).toString(),
      };
    }
  });

  if (removeNumbers !== undefined) {
    console.log("remove ma gui");
    demolager[
      demolager.findIndex(
        (obj) => obj.number.toString() === removeNumbers.number.toString()
      )
    ] = {
      number: removeNumbers.number,
      amount: (
        Number(
          demolager[
            demolager.findIndex(
              (obj) => obj.number.toString() === removeNumbers.number.toString()
            )
          ].amount
        ) - Number(removeNumbers.amount)
      ).toString(),
    };
  }

  const updatedemoLager = demolager.filter((obj) => obj.amount != 0);
  console.log(updatedemoLager);

  // for lager bet
  const totalAmount = updatedemoLager
    .map((dml) => Number(dml.amount))
    .reduce((pre, next) => pre + next, 0);

  const updateLager = await Lager.findById(lager._id);

  // updateLager.calls = calls;
  updateLager.numbers = updatedemoLager;
  updateLager.totalAmount = totalAmount;
  updateLager.win = totalAmount;
  // updateLager.in.commission = com;

  const upL = await updateLager.save();

  res.status(200).json({ success: true, data: call, lager: upL });
});

// Desc    DELETE USER
// Route   DELETE api/v1/user/:id
exports.deleteCall = asyncHandler(async (req, res, next) => {
  // For delete Call

  const deletecall = await Call.findByIdAndDelete(req.params.callId);

  if (!deletecall) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.callId}`, 404)
    );
  }

  // const call = await Call.findById(req.params.callId);

  // if (!call) {
  //   return next(
  //     new ErrorResponse(`Bet not found with id of ${req.params.callId}`, 404)
  //   );
  // }
  // For delete Lager
  const lager = await Lager.findOne({
    lottery: req.params.lotteryId,
    user: req.user._id,
  }).populate({ path: "user", select: "username name role commission" });

  console.log(lager);
  const demolager = lager.numbers;

  const callNumbers = deletecall.numbers;
  // const demolager = [...In.numbers];

  console.log(demolager, callNumbers);

  // // for lager call
  callNumbers.map((cn) => {
    if (demolager.map((l) => l.number).includes(cn.number)) {
      demolager[demolager.findIndex((obj) => obj.number === cn.number)] = {
        number: cn.number,
        amount: (
          Number(
            demolager[demolager.findIndex((obj) => obj.number === cn.number)]
              .amount
          ) - Number(cn.amount)
        ).toString(),
      };
    }
  });

  const updatedemoLager = demolager.filter((obj) => obj.amount != 0);
  // for lager bet
  const totalAmount = updatedemoLager
    .map((dml) => Number(dml.amount))
    .reduce((pre, next) => pre + next, 0);

  const updateLager = await Lager.findById(lager._id);

  // updateLager.calls = calls;
  updateLager.numbers = updatedemoLager;
  updateLager.totalAmount = totalAmount;
  updateLager.win = totalAmount;
  // updateLager.in.commission = com;

  const upL = await updateLager.save();

  res.status(200).json({ success: true, data: {}, lager: upL });
});

exports.callNumbersTotal = asyncHandler(async (req, res, next) => {
  const { lotteryId, customerId } = req.params;
  const { id, role } = req.user;
  let calls;
  if (role === "Admin") {
    calls = await Call.find({
      lottery: lotteryId,
      user: id,
      master: customerId,
    })
      .populate({
        path: "user",
        select: "name role",
      })
      .populate({
        path: "master",
        select: "name role",
      });
  }
  if (role === "Master") {
    calls = await Call.find({ lottery: lotteryId, user: id, agent: customerId })
      .populate({
        path: "user",
        select: "name role",
      })
      .populate({
        path: "agent",
        select: "name role",
      });
  }
  if (role === "Agent") {
    calls = await Call.find({
      lottery: lotteryId,
      user: id,
      customer: customerId,
    })
      .populate({
        path: "user",
        select: "name role",
      })
      .populate({
        path: "customer",
        select: "name",
      });
  }

  console.log(calls);
  console.log(colors.bgBlack(id, role));

  const numsData = [];
  const obj = {};

  const numbers = Array.prototype.concat.apply(
    [],
    calls.map((cal) => cal.numbers)
  );

  numbers.forEach((num) => {
    if (obj.hasOwnProperty(num.number)) {
      obj[num.number] = Number(obj[num.number]) + Number(num.amount);
    } else {
      obj[num.number] = Number(num.amount);
    }
  });

  for (var prop in obj) {
    numsData.push({ number: prop, amount: obj[prop] });
  }

  const numsTotal = numsData
    .map((d) => Number(d.amount))
    .reduce((pre, next) => pre + next, 0);

  res.status(200).json({ success: true, numsData, numsTotal });
});

const generateCallId = async (customer, lotteryId) => {
  const betID = Date.now();
  // let callslength;
  // if (customer.role === 'Master') {
  //   callslength = await Call.find({lottery:lotteryId,master:customer._id}).count();
  // } else if (customer.role === 'Agent') {
  //   callslength = await Call.find({lottery:lotteryId,agent:customer._id}).count();
  // }else if(customer.role === 'Customer'){
  //   callslength = await Call.find({lottery:lotteryId,customer:customer._id}).count();
  // }

  // const betID = `${customer.username}-${callslength+1}`
  return betID;
};
