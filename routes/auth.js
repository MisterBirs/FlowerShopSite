const express = require("express");
const router = express.Router();
const User = require("../model/users");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ name: username, password: password });
  if (user) {
    res.send();
  } else {
    res.status(500).send("Authentication Error");
  }
});

router.post("/:username", async (req, res) => {
  const { username } = req.params;
  console.log("POST", username);
  const user = await User.findOne({ name: username });
  if (user) {
    user.password = "*******";
    res.json(user);
  }
});

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  console.log("GET", username);
  const user = await User.findOne({ name: username });
  if (user) {
    user.password = "*******";
    // console.log("GET:username", user);
    res.json(user);
  }
});

module.exports = router;
