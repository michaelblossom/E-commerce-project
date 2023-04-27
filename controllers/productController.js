const Product = require("./../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// get allProduct
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const allproducts = await Product.find();
  res.status(200).json({
    status: "success",
    result: allproducts.length,
    data: {
      products: allproducts,
    },
  });
});
// get product
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("No product found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      products: product,
    },
  });
});
// creating product
exports.createProduct = async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  if (!newProduct) {
    return next(new AppError("No product found with this ID", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
};

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new AppError("No product found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError("No product found with this ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
