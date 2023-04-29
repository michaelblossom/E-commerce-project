// const AppError = require("./../utils/appError");

// error during development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// error during production

const sendErrorProd = (err, res) => {
  // operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // programming or other unknown error:we dont want to leak the error to the client
  } else {
    // 1) Log the error so that we the developer can see it during hosting and even in the console
    console.error("ERROR:", err);

    // send generic message to the client
    res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    // calling sendErrorDev function
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};

// const handleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path}:${err.value}`;
//   return new AppError(message, 400);
// };

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
//   console.log(value); // this will show us the value that matched the regular expression and we will then add the index of the required value to our regular expression
//   const errMessage = `Duplicate field value:${value}.please use another value!`;
//   return new AppError(errMessage, 400);
// };

// const handleValidationErrorDB = (err) => {
//   // the meaning of code below
//   // 1)we are looping through an object to extract all the validation errors from different fields in the schema(name,difficulty,price,e.t.c)
//   // 2)since all the errors are inside one object called errors? we now use Object.value() to loop through because it is an object
//   // 3)the err.errors assigned to Object.values(err.errors)(err is the parameter in our function) while (errors) is the object holding all the errors in the post
//   // 4)el.message is pointing to the error messages from the various validators in the postman
//   const errors = Object.values(err.errors).map((el) => el.message);
//   const message = `Invalid input data.${errors.join(". ")}`; //errors.join is from the variable above which contains all the errors from our validators field(name,difficulty,price,e.t.c)
//   return new AppError(message, 400);
// };

// const handleJWTError = () =>
//   new AppError("Invalid token please login again", 401);

// const handleJWTExpiredError = () =>
//   new AppError("your token has expired please login again", 401);

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack,
//   });
// };

// const sendErrorProd = (err, res) => {
//   // operational error, trusted error:send message to client
//   // other errors that should marked as operational errors are
//   // 1)pass strings instead of normal id(castError)
//   // 2)duplication of name (code:11000)
//   // 3)passing invalid number(below or above the required number)
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });

//     // programming or other unknown error:we dont want to leak the error to the client
//   } else {
//     // 1) Log the error so that we the developer can see it during hosting and even in the console
//     // console.error("ERROR:", err);

//     // send generic message to the client
//     res.status(500).json({
//       status: "error",
//       message: "something went wrong!",
//     });
//   }
// };
// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";
//   if (process.env.NODE_ENV === "development") {
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === "production") {
//     let error = { ...err };

//     if (error.name === "castError") error = handleCastErrorDB(error);
//     if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//     if (error.name === "validationError")
//       error = handleValidationErrorDB(error);
//     if (error.name === "JsonWebTokenError") error = handleJWTError();
//     if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
//     sendErrorProd(error, res);
//   }
// };
