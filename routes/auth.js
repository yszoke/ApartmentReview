const express = require ("express")
const passport = require("passport")
const router = express.Router()

//@desc google Auth
//@route GET /auth/google
router.get('/google', passport.authenticate('google', {scope : ['profile' , 'email']}))

//@desc google Auth Callback
//@route GET /auth/google/callback
router.get("/auth/google/callback" , passport.authenticate('google' , {failureRedirect : '/sorry'}) , (req, res) => {res.redirect('/welcome_bgus')});
// 


router.get("/welcome_bgus" , (req, res) => {  res.send('welcome_bgus!!')});
router.get("/sorry" , (req, res) => {  res.send('sorry.. not a bgu mail')});


// router.get('/dashboard', passport.authenticate('google', {failureRedirect : '/'}) , (req, res) => {  res.redirect('/dashboard')})


module.exports = router
