const express = require("express");
const morgan = require("morgan");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
const userRouter = require("./routes/userRoute");

const app = express();
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));

app.use(express.static(`${__dirname}/public`));
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/user", userRouter);

// handling undefined route
app.all("*", (req, res, next) => {
  next(new AppError(`cant't find ${req.originalUrl} on this saver!`, 404));
});
module.exports = app;
