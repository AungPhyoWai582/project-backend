const { bgBlue } = require("colors");
const asyncHandler = require("../middlewares/async");
const Call = require("../models/Call");
const Customer = require("../models/Customer");
const OutCall = require("../models/OutCall");
const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");

exports.createAdmin = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  // req.body.createByUser = req.user.id;

  // if (req.user.role !== "Admin") {
  //   return next(
  //     new ErrorResponse(
  //       `This user ${req.user.id} role is not authorize to access this route`,
  //       400
  //     )
  //   );
  // }
  req.body.role = "Admin";

  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

exports.memberView = asyncHandler(async (req, res, next) => {
  // console.log(req.user)
  const user = await User.findById(req.params.id);
  const customers = await Customer.find({ createByUser: req.params.id });
let downLineUsers;
  if(user.role === 'Agent'){
  downLineUsers = await Customer.find({ createByUser: req.params.id });
  }else{
    downLineUsers = await User.find({ createByUser: req.params.id });

  }

  if (!downLineUsers) {
    return next(new ErrorResponse("There is no user", 404));
  }

  const outcalls = await OutCall.find({ user: req.params.id });
  const calls = await Call.find({user:downLineUsers.map(usr=>usr._id)})

  console.log(downLineUsers)

  let transcation = {};

  // For In
  const inData = downLineUsers.map((usr) => {
    console.log(usr,calls);

   
    let obj;
    // const calls = await Call.find({user:usr._id});

    const totalIn = calls
      .filter((cal) => cal.user.toString() === usr._id.toString())
      .map((cal) => Number(cal.totalAmount))
      .reduce((pre, next) => pre + next, 0);
    // console.log(totalIn);
    obj = {
      username: usr.username,
      totalIn: totalIn,
    };

  //   if (usr.role === "Admin") {
  // const calls = await Call.find({user:usr._id});

  //     const totalIn = calls
  //       // .filter((cal) => cal.user.toString() === usr._id.toString())
  //       .map((cal) => Number(cal.totalAmount))
  //       .reduce((pre, next) => pre + next, 0);
  //     console.log(totalIn);
  //     obj = {
  //       username: usr.username,
  //       totalIn: totalIn,
  //     };
  //   }
  //   if (usr.role === "Master") {
  //     const totalIn = calls
  //       .filter((cal) => cal.user.toString() === usr._id.toString())
  //       .map((cal) => Number(cal.totalAmount))
  //       .reduce((pre, next) => pre + next, 0);
  //     console.log(totalIn);
  //     obj = {
  //       username: usr.username,
  //       totalIn: totalIn,
  //     };
  //   }
  //   if (usr.role === "Agent") {
  //     const totalIn = calls
  //       .filter((cal) => cal.user.toString() === usr._id.toString())
  //       .map((cal) => Number(cal.totalAmount))
  //       .reduce((pre, next) => pre + next, 0);
  //     console.log(totalIn);
  //     obj = {
  //       username: usr.username,
  //       totalIn: totalIn,
  //     };
  //   }

    return obj;
  });
  console.log(customers)

  // For Out
  const outData = customers.map((cus) => {
    // console.log(cus.customer);
    const totalOut = outcalls
      .filter((cal) =>cal.customer.toString() === cus._id.toString())
      .map((cal) => Number(cal.totalAmount))
      .reduce((pre, next) => pre + next, 0);

    return { cusotmer: cus.name, totalOut: totalOut };
  });

  console.log(bgBlue(inData));
  transcation.inData = inData;
  transcation.outData = outData;
  transcation.inTotal = inData
    .map((In) => Number(In.totalIn))
    .reduce((pre, next) => pre + next, 0);
  transcation.outTotal = outData
    .map((out) => Number(out.totalOut))
    .reduce((pre, next) => pre + next, 0);

  console.log(transcation)

  res.status(200).json({
    success: true,
    transcation: transcation,
  });
});
