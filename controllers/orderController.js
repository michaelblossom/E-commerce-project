const Order = require("./../models/orderModel");
const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// creating order
exports.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = await Order.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      order: newOrder,
    },
  });
});
// get allOrder
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const allOrders = await Order.find();
  res.status(200).json({
    status: "success",
    result: allOrders.length,
    data: {
      products: allOrders,
    },
  });
});
// get ORDER
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: "user",
      select: "name ",
    })
  // const order = await Order.findById(req.params.id);
  if (!order) {
    const error = new AppError("No order found with this ID", 404);

    // console.log(error.)
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: {
      orders: order,
    },
  });
});

// update order
exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    return next(new AppError("No order found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new AppError("No order found with this ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// get my order
exports.getMyOrder = catchAsync(async (req, res, next) => {
  // 1) Find all orders
  const orders = await Order.find({ user: req.user.id });

  // 2) Find product with the returned IDs
  const productIDs = orders.map((el) => el.products.productId);
  console.log(productIDs);

  const product = await Product.find({ id: { $in: productIDs } });

  res.status(204).json({
    status: "success",
    data: {
      products: product,
    },
  });
});

// get orders per month

exports.getOrdersPerMonth = catchAsync(async (req, res, next) => {
  const users = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        number_of_orders: { $sum: 1 },
        products: { $push: "$products" },
      },
    },
    {
      $addFields: { month_of_order: "$_id" },
    },
    { $sort: { number_of_orders: -1 } },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      User: users,
    },
  });
});

// user that made the heighest order
exports.userWithHeighestOrder = catchAsync(async (req, res, next) => {
  const users = await Order.aggregate([
    {
      $group: {
        _id: "$user",
        number_of_orders: { $sum: 1 },
        products: { $push: "$products" },
      },
    },

    { $sort: { number_of_orders: -1 } },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      User: users,
    },
  });
});
