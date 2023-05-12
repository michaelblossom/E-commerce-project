const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// functions that will filter out fields tha we  want to update
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// USER HANDLLERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  // sending response
  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id; //so that the id of the current user will replace the id coming from the URL(i will attach getOne user middleware function to this middleware in the user route)
  next();
};
// updating current user data
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  // 1) create error if user tries post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "this route is not for password update please use  updateMyPassword route",
        400
      )
    );
  }

  // 2)filtering out the field names that are  allowed to be updated by calling the filterObj function and storing it in filteredBody
  const filteredBody = filterObj(req.body, "name", "email");
  // 3)update the user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// disable  a user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      User: user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with this ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
