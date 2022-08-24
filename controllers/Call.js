const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
// const Report = require("../models/Report");
const BetDetail = require("../models/BetDetail");
const Lottery = require("../models/Lottery");

const colors = require("colors");
const Report = require("../models/Report");
const Lager = require("../models/Lager");
const { calculateReport } = require("../utils/calculateReport");
const { calculateLager } = require("../utils/calculateLager");

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

  // console.log(calls);
  console.log(colors.bgBlue(calls));

  res.status(200).json({
    success: true,
    count: calls.length,
    data: calls,
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

  res.status(200).json({ success: true, data: call });
});

// Desc    CREATE CALL
// Route   POST api/v1/agents/:agentId/calls
exports.createCall = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user._id;
  req.body.user_role = req.user.role;
  req.body.lottery = req.params.lotteryId;

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

  console.log(lager);
  const demolager = lager.in.numbers;

  const callNumbers = call.numbers;
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
          ) + Number(cn.amount)
        ).toString(),
      };
    } else {
      demolager.push(cn);
    }
  });

  // for lager bet
  const totalAmount = Number(lager.in.totalAmount) + Number(call.totalAmount);

  // for lager commission
  const com = totalAmount * (req.user.commission / 100);

  // for in data read
  const read = await lager.in.read;
  read.push(call.id);

  // for win/lose
  // const win = console.log(colors.bgGreen(demolager));

  const updateLager = await Lager.findByIdAndUpdate(
    lager._id,
    {
      in: {
        numbers: demolager,
        totalAmount: totalAmount,
        commission: com,
        read: read,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // For out

  if (req.user.role === "Master") {
    const downLineLager = await Lager.findOne({
      lottery: req.params.lotteryId,
      user: req.body.agent,
    });

    const demolager = downLineLager.out.numbers;

    const callNumbers = call.numbers;
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
            ) + Number(cn.amount)
          ).toString(),
        };
      } else {
        demolager.push(cn);
      }
    });

    // for lager bet
    const totalAmount =
      Number(downLineLager.out.totalAmount) + Number(call.totalAmount);

    // for lager commission
    const com = totalAmount * (req.user.commission / 100);

    const send = downLineLager.out.send;
    send.push(call.id);

    await Lager.findByIdAndUpdate(
      downLineLager._id,
      {
        out: {
          numbers: demolager,
          totalAmount: totalAmount,
          commission: com,
          send: send,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  res.status(201).json({
    success: true,
    data: call,
    lager: updateLager,
  });
});

// Desc    UPDATE USERS
// Route   PUT api/v1/user/:id
exports.updateCall = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "Agent") {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to get bet`, 401)
    );
  }

  const call = await Call.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!call) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: call });
});

// Desc    DELETE USER
// Route   DELETE api/v1/user/:id
exports.deleteCall = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "Agent") {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to get bet`, 401)
    );
  }

  const call = await Call.findByIdAndDelete(req.params.id);

  if (!call) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
