var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var ejs = require("ejs");
const router = express.Router();
const users = require("./routes/users");
const branches = require("./routes/branches");
const flowers = require("./routes/flowers");
const restrictMiddleware = require("./restrict");
const ejsLint = require("ejs-lint");
const mongoose = require("mongoose");

router.use(restrictMiddleware);
router.use("/users", users);
router.use("/flowers", flowers);
router.use("/branches", branches);
