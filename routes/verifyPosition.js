const users = require("../model/users");

module.exports = function(req, res, next) {
  users.findOne({ name: req.query.username }).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      if (!user) {
        var err = new Error("Not authorized! Go back!");
        err.status = 400;
        return next(err);
      } else if (!user.position.match(/worker|manager/i)) {
        var err = new Error("Not authorized! Go back!");
        err.status = 501;
        return next(err);
      } else {
        return next();
      }
    }
  });
};
