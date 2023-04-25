const Cart = require("./../models/cartModel");
// get allCart
exports.getAllCarts = async (req, res) => {
  try {
    const allCarts = await Cart.find();
    res.status(200).json({
      status: "success",
      data: {
        carts: allCarts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
// get cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).popolate(
      products.productId
    );
    res.status(200).json({
      status: "success",
      data: {
        carts: cart,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
// creating cart
exports.createCart = async (req, res) => {
  try {
    const newCart = await Cart.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        cart: newCart,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
