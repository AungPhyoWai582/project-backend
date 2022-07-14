const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Customer = require("../models/Customer");

exports.getCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.find({
    createByUser: req.user._id,
  }).populate({
    path: "createByUser",
    select: "username name role",
  });
  if (!customers) {
    return next(new ErrorResponse("There is no customers", 404));
  }
  res.status(200).json({ success: true, count: customers.length, customers });
});

exports.getCustomer = asyncHandler(async (req, res, next) => {
  const { customerId } = req.params;

  if (!customerId) {
    return next(new ErrorResponse(`Customer id is required`, 404));
  }

  const customer = await Customer.findById(customerId).populate({
    path: "createByUser",
    select: "username name role",
  });

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${customerId}`, 404)
    );
  }

  res.status(200).json({ success: true, customer });
});

exports.createCustomer = asyncHandler(async (req, res, next) => {
  req.body.createByUser = req.user._id;
  const customer = await Customer.create(req.body).populate({
    path: "createByUser",
    select: "username name role",
  });

  res.status(201).json({ success: true, customer });
});

exports.updateCustomer = asyncHandler(async (req, res, next) => {
  const { customerId } = req.params;
  const customer = await Customer.findByIdAndUpdate(customerId, req.body, {
    new: true,
    runValidators: true,
  }).populate({
    path: "createByUser",
    select: "username name role",
  });

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${customerId}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    customer,
  });
});

exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  const { customerId } = req.params;
  const customer = await Customer.findByIdAndDelete(customerId);
  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${customerId}`, 404)
    );
  }
  res.status(200).json({ success: true, customer: {} });
});
