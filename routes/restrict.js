const express = require("express");
const User = require("../model/users");

module.exports = function(req, res, next) {
  User.find({ name: req.query.username }).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        var err = new Error("Not authorized! Go back!");
        err.status = 400;
        return next(err);
      } else {
        return next();
      }
    }
  });
};
