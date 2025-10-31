const mongoose = require("mongoose");

const mobileSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mobilePrice: {
    type: Number,
    required: true,
    min: 1000,
    max: 1000000,
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  userId: {
    type: mongoose.Schema.Types.Mixed, // <-- changed from ObjectId to Mixed
    required: true,
  },
});

const Mobile = mongoose.model("Mobile", mobileSchema);
module.exports = Mobile;
