const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  orderPrice: { type: Number, default: 1 }
});
module.exports = mongoose.model("Orders", orderSchema);
