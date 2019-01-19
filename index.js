var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var ejs = require("ejs");
var app = express();
let users = require("./public/users.json");
let manage = require("./public/partials/manage");
let catalogData = require("./public/flower.json");

function filterData(jsonList) {
  return jsonList.filter(element => {
    return element.active == "true";
  });
}

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("../public/index.ejs");
});

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    res.send();
  } else {
    res.status(500).send("Authentication Error");
  }
});

app.post("/auth/:username", (req, res) => {
  const { username } = req.params;
  console.log(username);
  if (username in users) {
    res.json(["matanya", "glik", 123, 5678]);
    // res.send(users[username]);
  }
});

app.get("/manage/:username", (req, res) => {
  const { username } = req.params;
  if (users[username] && users[username].position === "manager") {
    res.render("../public/partials/manage");
  }
});

app.get("/auth/:username", (req, res) => {
  const { username } = req.params;
  //console.log(username);
  res.json(users[username]);
});

app.get("/logout/", (req, res) => {
  res.send();
});

app.get("/catalog", (req, res) => {
  const { username } = req.query;
  console.log(username);
  if (users[username]) {
    res.render("../public/partials/catalog", {
      flowers: filterData(catalogData.flowers)
    });
  }
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
