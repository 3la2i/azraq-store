const mongoose = require("mongoose");
const { Schema } = mongoose;

const restaurantSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  address: {
    street: String,
    neiborhood: String,
    state: String,
    zipCode: String,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
  cuisine: [String],
  rating: { type: Number, default: 0 },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
