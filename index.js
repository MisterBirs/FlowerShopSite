var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var ejs = require("ejs");
var app = express();
let users = require("./public/users.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("../public/index.ejs");
});

app.post("/users", (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  if (username in users && users[username].password === password) {
    res.send().status(200);
  } else {
    res.status(500).send("Authentication Error");
  }
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
