// mongodb+srv://<db_username>:<db_password>@cluster0.a5zel.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// saravana
// xZe95u186hnMeseW;
const mongoose = require("mongoose");

const connectDB = (uri) => {
  console.log("Connect DB");

  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
