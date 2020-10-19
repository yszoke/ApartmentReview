const querystring = require("querystring");

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.session.status = "dennied";
      res.redirect("/frontEnd");
    }
  },

  ensureAdmin: function (req, res, next) {
    // console.log(req.body.adminPaswword);
    if (req.body.adminPaswword == process.env.adminPaswword) {
      return next();
    } else {
      req.session.status = "adminDennied";
      res.redirect("/frontEnd");
    }
  },
};
