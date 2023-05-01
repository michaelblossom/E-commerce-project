const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    //   parent referencing
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "averageRating numberOfRatings",
  }).populate({
    path: "user",
    select: "name  ",
  });
  next();
});

// static function (because we want to calculate the value a field in our schema) and this function is available in the model
// we want to calculate the average rating of a particular tour
reviewSchema.statics.calcAverageRatings = async function (productId) {
  // console.log(tourId);
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        aveRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  // persisting the results (nRatings and AveRatings) to the required field in the productmodel
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      numberOfRatings: stats[0].nRating,
      averageRating: stats[0].aveRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingQauntity: 0,
      ratingAverage: 4.5,
    });
  }
};

// calling the calcAverageRatins static function
// we want this function to be called whenever a document is saved therefore we will use a middleware
reviewSchema.post("save", function () {
  // this points to the current review
  this.constructor.calcAverageRatings(this.product); // remeber that tour stores the  id of the current tour we are writing review for (the id comes from the URL)
});

// for deleting and updating review
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
