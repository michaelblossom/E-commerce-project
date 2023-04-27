const Cart = require("./../models/cartModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// get allCart
exports.getAllCarts = catchAsync(async (req, res, next) => {
  const allCarts = await Cart.find();
  res.status(200).json({
    status: "success",
    data: {
      carts: allCarts,
    },
  });
});
// get cart
exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id).popolate(products.productId);
  res.status(200).json({
    status: "success",
    data: {
      carts: cart,
    },
  });
});
// creating cart
exports.createCart = catchAsync(async (req, res, next) => {
  const newCart = await Cart.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      cart: newCart,
    },
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!cart) {
    return next(new AppError("No cart found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);
  if (!cart) {
    return next(new AppError("No cart found with this ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
