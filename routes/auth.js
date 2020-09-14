const express = require("express")
const passport = require("passport")
const router = express.Router()
const {
  ensureAuth,
} = require('../middleware/auth')
const querystring = require('querystring');    



//@desc google Auth
//@route GET /auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

//@desc google Auth Callback
//@route GET /auth/google/callback
router.get("/auth/google/callback", passport.authenticate('google', {
  failureRedirect: '/AuthFail',
  successRedirect: '/AuthSucceed'
}));


//@desc google is Auth
router.get("/AuthSucceed", (req, res) => {
  req.session.status = 'AuthSucceed'
  res.redirect('/frontEnd')
});

//@desc google Auth Callback
router.get("/AuthFail", (req, res) => {
  req.session.status = 'AuthFailed'
  res.redirect('/frontEnd')
});


//@desc google logout
router.get('/logout', (req, res) => {
  req.logOut()
  req.session.status = 'logged out'
  res.redirect('/frontEnd')
})


//@desc check if user is logged in
router.get('/isAuthUsers', ensureAuth, (req, res) => {
  req.session.status = "logged In"
  res.redirect('/frontEnd')
})

//@desc google logout
router.get('/frontEnd', (req, res) => {
  // try {
  //   console.log(req.user)
  // } catch (error) {
    
  // }
  res.send(req.session.status || "didnt tried to logged in yet")
})

// app.get('/category', function(req, res) {
//       const query = querystring.stringify({
//           "a": 1,
//           "b": 2,
//           "valid":"your string here"
//       });
//       res.redirect('/?' + query);
//  });



/*router.get('/frontEnd' , (req, res) =>{
  console.log("--------------------------------------------------------------------")
  console.log(req.headers)
  console.log("--------------------------------------------------------------------")
  console.log(res.header()._headers)
  console.log("--------------------------------------------------------------------")
  console.log(res.getHeaders("status"))
  console.log("--------------------------------------------------------------------")
  console.log("hallow")
  res.send()*/

module.exports = router