const express = require("express");
const router = express.Router();
const User = require("../model/users");
const verifyPosition = require("./verifyPosition");

router.use(verifyPosition);

router.get("/", async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ name: username });
  let usersList = [];
  if (user.position === "manager" || user.position === "worker") {
    if (user.position === "manager") {
      usersList = await User.find({ active: true }).sort("name");
    }
    if (user.position === "worker") {
      usersList = await User.find({ active: true }).sort("name");
      usersList.map(user => {
        user.password = "********";
        return user;
      });
    }
    res.render("../views/users", {
      users: usersList,
      position: user.position
    });
  }
});

router.post("/", async (req, res) => {
  const { name, password, position, numberBranch } = req.query;
  const { username } = req.query;
  let user = await User.find({ name: username });
  // if (!user.position.match(/worker|manager/i)) {
  //   res.status(501).json("You are not a worker");
  // }
  // const { error } = validateUser(req.query); //TODO
  // if (error) return res.status(400).json(error.details[0].message);
  // if (numberBranch === undefined) {
  //   branch = null;
  // } else branch = numberBranch;
  const isUser = await User.find({ name: name });
  if (isUser.length > 0) {
    return res.status(500).json("The username is already taken");
  }
  user = new User({
    name: name,
    password: password,
    position: position,
    active: true,
    numberBranch: numberBranch
  });

  try {
    user = await user.save();
  } catch (err) {
    console.log(err);
    return res.status(505).json(err.message);
  }
  res.json(user);
});

router.get("/add", (req, res) => {
  res.render("../views/addUser");
});

router.get("/update", async (req, res) => {
  const { username, _id } = req.query;
  console.log("UPDATE", username, _id);
  const user = await User.findOne({ name: username });
  if (user.position == "manager") {
    const data = await User.findById(_id);
    res.render("../views/managerUpdateForm", {
      user: data
    });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json("The user with the given ID does not exist");
  res.json(user);
});

router.put("/:id", async (req, res) => {
  const { name, password, position, numberBranch } = req.query;
  const manage = await User.findOne({
    name: req.query.username,
    position: "manager"
  });
  if (!manage) {
    return res.status(501).json("Not authorized");
  }
  // const { error } = validateUser(req.query);
  // if (error) return res.status(400).json(error.details[0].message);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: name,
      password: password,
      position: position,
      active: true,
      numberBranch: numberBranch
    },
    { new: true }
  );
  if (!user)
    return res.status(404).json("The user with the given ID does not exist");
  console.log(user);
  res.json(user);
});

router.delete("/:id", async (req, res) => {
  const manage = await User.findOne({
    name: req.query.username,
    position: "manager"
  });
  if (!manage) {
    return res.status(501).json("Not authorized");
  }
  // console.log("delete", manage);
  // console.log("delete", await User.findById(req.params.id), req.params.id);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: { active: false }
    },
    { new: true }
  );
  if (!user)
    return res.status(404).json("The user with the given ID does not exist");
  console.log("delete", user);
  res.json(user);
});

router.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = router;
