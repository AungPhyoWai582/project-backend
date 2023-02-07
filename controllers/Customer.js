const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middlewares/async");
const Customer = require("../models/Customer");

exports.getCustomers = asyncHandler(async (req, res, next) => {
  // const {id} = req.user;

  // const customers = await Customer.find({createByUser:id}).populate({
  //   path: "createByUser",
  //   select: "username name role",
  // });
  // if (!customers) {
  //   return next(new ErrorResponse("There is no customers", 404));
  // }
  // console.log(customers);
  // res.status(200).json(customers);
   // pagination
   let query;
    // Copy req.query
  const reqQuery = { ...query };

  // Fields to execute
  const removeFields = ["select", "sort", "page", "limit","rowperpage"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  console.log(JSON.parse(queryStr));
  
   const pagination = {};

   const total = await Customer.countDocuments({ createByUser: req.user._id });
   const page = parseInt(req.query.page, 10) || 1;
   const limit = parseInt(req.query.limit, 10) || total;
   const startIndex = (page - 1) * limit;
   const endIndex = page * limit;
 
   if (endIndex < total) {
     pagination.next = {
       page: page + 1,
       limit,
     };
   }
 
   if (startIndex > 0) {
     pagination.prev = {
       page: page - 1,
       limit,
     };
   }
 
   // query = query.skip(startIndex).limit(limit);
 
   // pagination result
   if (req.user._id) {
     query = await Customer.find({ createByUser: req.user._id })
       .limit(limit)
       .skip(startIndex)
       .populate({
         path: "createByUser",
         select: "name role",
       });
   } else {
     query = await Customer.find(JSON.parse(queryStr))
       .limit(limit)
       .skip(startIndex)
       .populate({
         path: "createByUser",
         select: "name role",
       });
   }
 
   const customers = query;
 
   let counts;
   if (total % limit === 0) {
     counts = parseInt(total/limit);
    //  console.log(colors.bgBlue(parseInt(total/limit)))
   } else {
     counts =parseInt(total/limit) +1;
     // console.log(parseInt(total/req.query.rowperpage)+1)
    //  console.log(colors.bgBlue(parseInt(total/limit)+Number(1)))
   }
   // console.log(counts,req.query.rowperpage);
   res.status(200).json({
     success: true,
     counts: counts,
     pagination,
     data: customers,
     selfUrl: req.originalUrl,
   });
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
  console.log(req.originalUrl);
  req.body.createByUser = req.user._id;
  const customer = await Customer.create(req.body);

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
