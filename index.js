var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile("./index.html");
});

app.listen(3000, function() {
  console.log("Example app listening on port 8080!");
});
