const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  id: { type: Number, required: true, min: 1, unique: true },
  manager: { type: String, required: true, minlength: 4, maxlength: 255 },
  phone: { type: String, required: true, maxlength: 9, match: /\d.{7,10}/ },
  numberOfEmployees: { type: Number, min: 1 },
  active: {
    type: Boolean,
    required: true
  }
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
