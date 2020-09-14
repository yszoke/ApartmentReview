const querystring = require('querystring');    

module.exports = {
  
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      req.session.status = "dennied";
      res.redirect('/frontEnd')
    }
  }
}
