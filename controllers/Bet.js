const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Betting = require("../models/Bet");
const Report = require("../models/Report");
const BetDetail = require("../models/BetDetail");

// Desc    GET USERS
// Route   GET api/v1/users
exports.getBets = asyncHandler(async (req, res, next) => {
  const betLists = await Betting.find();

  if (!betLists) {
    return next(new ErrorResponse("Here no have bet lists", 404));
  }

  res.status(200).json({ success: true, data: betLists });
});

// Desc    GET USER
// Route   GET api/v1/user/:id
exports.getBet = asyncHandler(async (req, res, next) => {
  const bet = await Betting.findById(req.params.id);

  if (!bet) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bet });
});

// Desc    CREATE USERS
// Route   POST api/v1/user
exports.createBet = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  console.log(req.body);

  if (req.user.role !== "Agent") {
    return next(
      new ErrorResponse(
        `This user ${req.user.id} role is not authorize to access this route`,
        400
      )
    );
  }

  const bet = await Betting.create(req.body);
  console.log(bet);
  let betArr = [...bet.betNumbers.map((bet) => bet.amount)];
  console.log(betArr);
  let betamount = betArr.reduce((prev, next) => prev + next, 0);

  console.log(betamount, "bet-amount");

  const betdetails = {
    betId: bet._id,
    betamount: betamount,
    betTime: bet.betTime,
  };

  const betDetail = await BetDetail.create(betdetails);

  res.status(201).json({
    success: true,
    data: {
      bet: bet,
      details: betDetail,
    },
  });
});

// Desc    UPDATE USERS
// Route   PUT api/v1/user/:id
exports.updateBet = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "Agent") {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to get bet`, 401)
    );
  }

  const bet = await Betting.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bet) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bet });
});

// Desc    DELETE USER
// Route   DELETE api/v1/user/:id
exports.deleteBet = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "Agent") {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to get bet`, 401)
    );
  }

  const bet = await Betting.findByIdAndDelete(req.params.id);

  if (!bet) {
    return next(
      new ErrorResponse(`Bet not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
