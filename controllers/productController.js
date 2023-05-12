// const multer = require("multer");
// const sharp = require("sharp"); // for image resizing
const Product = require("./../models/productModel");
const User = require("./../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// get allProduct
exports.getAllProducts = async (req, res, next) => {
  try {
    // BUILDING THE QUERY

    // 1a)FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1b)Advance filtering
    let queryStr = JSON.stringify(queryObj); //converting queryObj from object to string so that we can use replace method on it
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr)); // converting queryStr back to object and store it in query variable

    // 2) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // //2) FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 4) PAGINNATION(determining the document based on the page)
    const page = req.query.page * 1 || 1; //converting our page value to number and if there is no page number the default should be 1
    const limit = req.query.limit * 1 || 100; //converting our limit value to number and if there is no limit the default should be 100
    const skip = (page - 1) * limit;

    // page=2 limit=10, 1-10page1, 11-20page2, 21-30page3
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numProduct = await Product.countDocuments(); // this will count the number of documents available
      if (skip >= numProduct) throw new Error("page does not exist");
    }
    // executing the query
    const product = await query;

    // sending response
    res.status(200).json({
      status: "success",
      result: product.length,
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
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

// exports.addToWishlist = catchAsync(async (req, res, next) => {
//   const { _id } = req.user;
//   const { prodId } = req.body;
//   // // finding the currently loggedin user
//   const user = await User.findById(_id);

//   // checking if the id of the product we want to add is already in the wishlist
//   const alreadyAdded = user.wishList.find((id) => id.toString() === prodId);
//   console.log(alreadyAdded);

//   // // removing the product id from the wishList if it is already there
//   if (alreadyAdded) {
//     let user = await User.findByIdAndUpdate(
//       _id,
//       { $pull: { wishList: prodId } },
//       { new: true }
//     );
//     res.status(200).json({
//       status: "success",
//       data: {
//         user,
//       },
//     });
//     // return next("product already in wishlist", 401);
//     // res.json(user);
//   } else {
//     let user = await User.findByIdAndUpdate(
//       _id,
//       { $push: { wishList: prodId } },
//       { new: true }
//     );
//     res.status(200).json({
//       status: "success",
//       data: {
//         user,
//       },
//     });
//     // res.json(user);
//   }
// });

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  // // finding the currently loggedin user
  const user = await User.findById(_id);

  // checking if the id of the product we want to add is already in the wishlist
  const alreadyAdded = user.wishList.find((id) => id.toString() === prodId);
  console.log(alreadyAdded);

  // // removing the product id from the wishList if it is already there
  if (!alreadyAdded) {
    let user = await User.findByIdAndUpdate(
      _id,
      { $push: { wishList: prodId } },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
    // return next("product already in wishlist", 401);
    // res.json(user);
  } else {
    
    return next("product already in wishlist", 401);
  }
});
