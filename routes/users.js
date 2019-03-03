const express = require("express");
const router = express.Router();
const User = require("../model/users");

router.use(verifyPosition);

router.get("/", async (req, res) => {
  const { username } = req.query;
  const user = await User.find({ user: username });
  if (user.position === "manager" || user.position === "worker") {
    if (user.position === "manager") {
      const usersList = await User.find({ active: true }).sort("name");
    }
    if (user.position === "worker") {
      usersList = await User.find({ active: true })
        .sort("name")
        .map(user => {
          user.password = "*********";
          return user;
        });
    }
    res.render("../public/partials/users", {
      users: usersList,
      position: user.position
    });
  }
});

router.post("/", async (req, res) => {
  const { name, password, position, numberBranch } = req.body;
  const { username } = req.query;
  let user = await User.find({ name: username });
  // if (!user.position.match(/worker|manager/i)) {
  //   res.status(501).json("You are not a worker");
  // }
  const { error } = validateUser(req.body); //TODO
  if (error) return res.status(400).json(error.details[0].message);
  if (numberBranch === undefined) {
    branch = null;
  } else branch = numberBranch;
  const isUser = await User.find({ name: name });
  if (isUser) {
    return res.status(500).json("The username is already taken");
  }
  user = new User({
    name: name,
    password: password,
    position: position,
    active: true,
    numberBranch: branch
  });
  user = await user.save();
  res.json(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.param.id);
  if (!user)
    return res.status(404).json("The user with the given ID does not exist");
  res.json(user);
});

router.put("/:id", async (req, res) => {
  const { name, password, position, active, numberBranch } = req.body;
  const manage = await User.find({
    name: req.query.username,
    position: manager
  });
  if (!manage) {
    return res.status(501).json("Not authorized");
  }
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  const user = await User.findByIdAndUpdate(
    req.param.id,
    {
      name: name,
      password: password,
      position: position,
      active: active,
      numberBranch: numberBranch
    },
    { new: true }
  );
  if (!user)
    return res.status(404).json("The user with the given ID does not exist");
  res.json(user);
});

router.delete("/:id", async (req, res) => {
  const manage = await User.find({
    name: req.query.username,
    position: manager
  });
  if (!manage) {
    return res.status(501).json("Not authorized");
  }
  const user = await User.findByIdAndUpdate(
    req.param.id,
    {
      $set: { active: false }
    },
    { new: true }
  );
  if (!user)
    return res.status(404).json("The user with the given ID does not exist");
  res.json(user);
});

router.get("/add", (req, res) => {
  res.render("../public/partials/addUser");
});

router.get("/update", async (req, res) => {
  const { username, userToUpdate } = req.query;
  const user = await User.find({ name: username });
  if (user.position == "manager") {
    res.render("../public/partials/managerUpdateForm", {
      user: User.find({ name: userToUpdate })
    });
  }
});

router.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(err.message);
});
