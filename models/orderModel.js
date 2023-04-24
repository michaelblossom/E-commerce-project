const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a User"],
    },

    products: [
      {
        productId: { type: mongoose.Schema.ObjectId, ref: "Product" },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    orderStatus: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "Cash on Delivery",
        "Dispached",
        "Cancelled",
        "Delivered",
      ],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);
