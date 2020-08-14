const googleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require ('mongoose')
const User = require ('../models/User')

module.exports = function (passport){
  passport.use(new googleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : '/auth/google/callback'
  },
  async (accessToken, RefreshToken, Profile, Done) => {
    console.log(Profile)
  }
  
  ))

  passport.serializeUser((user, done) => {done(null, user.id)})
  
  passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
  });
}