const express = require ("express")
const passport = require("passport")
const router = express.Router()
const {
  ensureAuth,
} = require('../middleware/auth')


//@desc google Auth
//@route GET /auth/google
router.get('/google', passport.authenticate('google', {scope : ['profile' , 'email']}))

//@desc google Auth Callback
//@route GET /auth/google/callback
router.get("/auth/google/callback", passport.authenticate('google', {
  failureRedirect: '/AuthFail',
  successRedirect: '/AuthSucceed'
}));


//@desc google is Auth
router.get("/AuthSucceed" , (req, res) => {  
  response.setHeader('status', 'AuthSucceed')
  res.redirect('/frontEnd')
});

//@desc google Auth Callback
router.get("/AuthFail" , (req, res) => {  
  response.setHeader('status', 'AuthFailed')
  res.redirect('/frontEnd')
});


//@desc google logout
router.get('/logout' , (req, res) =>{
  req.logOut()
  response.setHeader('status', 'logged')
  res.redirect('/frontEnd')
})


//@desc check if user is logged in
router.get('/isAuthUsers', ensureAuth, (req, res) => {
  res.json({Auth : true})
})

//@desc google logout
router.get('/frontEnd' , (req, res) =>{
  res.send(req.headers.status)
})





module.exports = router
