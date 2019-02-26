const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  id: String,
  password: String,
  position: String,
  numberBranch: Number,
  active: Boolean
});

const User = mongoose.model("User", userSchema);

exports.User = User;
