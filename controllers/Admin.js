const asyncHandler = require("../middlewares/async");
const User = require("../models/User");

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