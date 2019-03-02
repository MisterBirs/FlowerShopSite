const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const users = require("./users");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await users.User.find({ name: username, password: password });
  if (user) {
    res.send();
  } else {
    res.status(500).send("Authentication Error");
  }
});

router.post("/:username", async (req, res) => {
  const { username } = req.params;
  //   console.log(username);
  const user = await users.User.find({ name: username });
  if (user) {
    let userToSend = { ...user };
    userToSend.password = "*******";
    res.json(userToSend);
  }
});

app.get("/auth/:username", async (req, res) => {
  const { username } = req.params;
  //console.log(username);
  const user = await users.User.find({ name: username });
  if (user) {
    let userToSend = { ...user };
    userToSend.password = "*******";
    res.json(userToSend);
  }
});
