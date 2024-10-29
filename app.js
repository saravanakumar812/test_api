require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 8000;
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const foodRoutes = require("./api/routes/food");
const loginRoutes = require("./api/routes/login");
const signupRoutes = require("./api/routes/signup");
const connectDB = require("./db/connect");
const http = require("http");

// const port = process.env.PORT || 3001;
const server = http.createServer(app);
// mongoose.connect(
//   "mongodb+srv://jaisaravana812:7PckG06q5Qt0iX4R@cluster0.rwjxtfs.mongodb.net/"
// );

mongoose.Promise = global.Promise;
// app.use(morgan("dev"));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  req.header(
    "Access-Control-Allow-Origin",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    req.header("Access-Control-Allow-Origin", "PUT,PATCH,POST,DELETE,GET");
    return req.status(200).json({});
  }
  next();
});
app.use("/productImage", express.static("uploads"));
app.use("/image", express.static("uploads"));

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/foods", foodRoutes);
app.use("/login", loginRoutes);
app.use("/signup", signupRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    server.listen(port, () => {
      console.log(` ${port} Connected with Port `);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
module.exports = app;
