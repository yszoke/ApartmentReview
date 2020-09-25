const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
const uuidv4 = require('uuid').v4

module.exports = function (passport) {

  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@*@post.bgu.ac.il$/;
    return re.test(String(email).toLowerCase());
  }

  const strategyDetails = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
  }

  const createUserObject = (profile) => {
    return {
      googleId: profile.id,
      User_Id : uuidv4(),
      displayName: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      image: profile.photos[0].value,
      email: profile._json.email,
    }
  }

  passport.use(
    new GoogleStrategy(
      strategyDetails,
      async (accessToken, refreshToken, profile, done) => {

        console.log(profile._json.email)
        const newUser = createUserObject(profile)
        try {
          if (validateEmail(profile._json.email)) {
            let user = await User.findOne({
              googleId: profile.id
            })
            if (user) {
              done(null, user)
            } else {
              user = await User.create(newUser)
              done(null, user, {A_status : "new User"})
            }
          }else{
            done("none bgu")
          }
        } catch (err) {
          done("connectin error")
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    if (user == null) {
      done("", null)
    }
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
