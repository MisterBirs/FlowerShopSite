const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
  },
  position: {
    type: String,
    required: true,
    enum: ["manager", "worker", "supplier", "customer"],
    lowercase: true
  },
  numberBranch: {
    type: Number,
    min: 1,
    required: function() {
      return this.position === "worker";
    }
  },
  active: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
