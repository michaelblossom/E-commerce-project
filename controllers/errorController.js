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
