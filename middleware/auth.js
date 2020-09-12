module.exports = {
  
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.setHeader('status', 'dennied')
      res.redirect('/frontEnd')
    }
  }
  
}
