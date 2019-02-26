const express = require("express");
const router = express.Router();
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

router.get("/", async (req, res) => {
  const users = await User.find({ active: true }).sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { name, password, position, id, active, numberBranch } = req.body;
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (numberBranch === undefined) {
    branch = null;
  } else branch = numberBranch;
  let user = new User({
    name: name,
    password: password,
    position: position,
    id: id,
    active: active,
    numberBranch: branch
  });
  user = await user.save();
  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.param.id);
  if (!user)
    return res.status(404).send("The user with the given ID does not exist");
  res.send(user);
});

router.put("/:id", async (req, res) => {
  const { name, password, position, id, active, numberBranch } = req.body;
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findByIdAndUpdate(
    req.param.id,
    {
      name: name,
      password: password,
      position: position,
      id: id,
      active: active,
      numberBranch: branch
    },
    { new: true }
  );
  if (!user)
    return res.status(404).send("The user with the given ID does not exist");
  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.param.id,
    {
      $set: { active: false }
    },
    { new: true }
  );
  if (!user)
    return res.status(404).send("The user with the given ID does not exist");
  res.send(user);
});
