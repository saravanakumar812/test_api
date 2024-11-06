const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const restaurantsListSchema = new mongoose.Schema({
  restaurantsListId: { type: Number },
  restaurantName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  cousin: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

restaurantsListSchema.plugin(AutoIncrement, { inc_field: "restaurantsListId" });

module.exports = mongoose.model("RestaurantsList", restaurantsListSchema);
