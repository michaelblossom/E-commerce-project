const mongoose = require("mongoose");
const slugify = require("slugify");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "product have belong to a title"],
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
      required: [true, "product must belong to a description"],
    },

    image: {
      type: String,
      // required: [true, "A product must have an image"],
    },
    otherImages: [String],
    categories: {
      type: String,
      enum: ["t-shirt", "trouser", "polo", "medium"],
      default: "medium",
    },
    quantity: {
      type: Number,
      required: [true, "product must a specific quantity"],
    },
    averageRating: {
      type: Number,
      default: 5,
      set: (val) => Math.round(val * 10) / 10, //4.6666,4.666,47,4.7
    },
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
      required: [true, "A product must have a price"],
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

productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true }); //slug is a fuield in the schema, name is equally na field in the schema we want to create slug from while {lower:true means that the value of the slug will be in lower case also the value of the slug should be from the name}
  next();
});
module.exports = mongoose.model("Product", productSchema);
