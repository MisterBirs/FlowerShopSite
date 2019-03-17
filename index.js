var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var ejs = require("ejs");
var app = express();
const api = require("./routes/api");
const ejsLint = require("ejs-lint");
const mongoose = require("mongoose");
const User = require("./model/users");
const auth = require("./routes/auth");
mongoose
  .connect("mongodb://localhost/flower_shop")
  .then(() => console.log("connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB...", err));

// function filterData(jsonList) {
//   return jsonList.filter(element => {
//     return element.active == "true";
//   });
// }

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use("/api", api);
app.use("/auth", auth);

// app.get("/use", async (req, res) => {
//   let abc = await User.find({ name: "matanya" });
//   res.json(abc);
// });

app.get("/", (req, res) => {
  res.render("../public/index.ejs");
});

app.get("/contactUs", (req, res) => {
  res.render("../views/contactUs");
});

app.post("/contactUs", (req, res) => {
  const { email, name, text } = req.body;
  console.log(email + " " + name + " " + text);
  res.send();
});

app.get("/logout", (req, res) => {
  res.send();
});

app.get("/about", (req, res) => {
  res.render(`../views/about`);
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
