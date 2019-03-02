const express = require("express");
const router = express.Router();
const User = require("../model/users");

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
  const { name, password, position, active, numberBranch } = req.body;
  const { error } = validateUser(req.body); //TODO
  if (error) return res.status(400).send(error.details[0].message);
  if (numberBranch === undefined) {
    branch = null;
  } else branch = numberBranch;
  const isUser = await User.find({ name: name });
  if (isUser) {
    return res.status(500).send("The username is already taken");
  }
  let user = new User({
    name: name,
    password: password,
    position: position,
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

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
