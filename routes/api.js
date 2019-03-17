var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var ejs = require("ejs");
const router = express.Router();
const users = require("./users");
const branches = require("./branches");
const flowers = require("./flowers");
const restrictMiddleware = require("./restrict");
const ejsLint = require("ejs-lint");
const mongoose = require("mongoose");

router.use(restrictMiddleware);
router.use("/users", users);
router.use("/flowers", flowers);
router.use("/branches", branches);

module.exports = router;
