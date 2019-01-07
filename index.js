var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var ejs = require("ejs");
var app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("../public/index.ejs");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
