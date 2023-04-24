const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, "product must belong to a title"],
      trim: true,
      maxlength: [
        50,
        "A product title must have less or equal to 50 characters",
      ],
      minlength: [
        10,
        "A product title must have more or equal to 10 characters",
      ],
      unique: true,
    },
    slug: String,
    description: {
      type: String,
      // required: [true, "product must belong to a description"],
    },
    images: [String],
    categories: {
      type: String,
      enum: ["t-shirt", "trouser", "polo", "medium"],
      default: "medium",
    },
    quantity: {
      type: Number,
      // required: true,
    },
    // averageRating: {
    //   type: Number,
    //   default: 5,
    //   min: [1, "Rating must be above 1.0"],
    //   max: [10, "Rating must be below 5.0"],
    //   set: (val) => math.round(val * 10) / 10, //4.6666,4.666,47,4.7
    // },
    numberOfRatings: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      enum: ["small", "medium", "large", "xtra-large", "extra-xtra-large"],
      default: "medium",
    },
    color: { type: String },
    price: {
      type: Number,
      // required: [true, "A product must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // note this validator only work when we are creating new document , it does not work when we are updating document
          return value < this.price;
        },
        message: "Discount price ({VALUE})should be less than the actual price",
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
