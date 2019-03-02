const mongoose = require("mongoose");

const flowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
    unique: true
  },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, data: Buffer },
  color: {
    type: String,
    enum: [
      "Red",
      "Orange",
      "Yellow",
      "Green",
      "Cyan",
      "Blue",
      "Indigo",
      "Violet",
      "Purple",
      "Magenta",
      "Pink",
      "Brown",
      "White",
      "Gray",
      "Black"
    ]
  },
  active: {
    type: Boolean,
    required: true
  }
});

const Flower = mongoose.model("Flower", flowerSchema);

exports.Flower = Flower;
