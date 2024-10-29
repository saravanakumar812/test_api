const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const signupSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  password: { type: String, required: true },
  userId: { type: Number }
});

signupSchema.plugin(AutoIncrement, { inc_field: "userId" });
module.exports = mongoose.model("Signup", signupSchema);
