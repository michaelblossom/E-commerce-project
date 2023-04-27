const Order = require("./../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
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
    data: {
      products: allOrders,
    },
  });
});
// get ORDER
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    products.productId
  );
  if (!order) {
    return next(new AppError("No order found with this ID", 404));
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
