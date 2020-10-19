const express = require("express");
const passport = require("passport");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const querystring = require("querystring");
const { Router } = require("express");

//@desc google Auth
//@route GET /auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// //@desc google Auth Callback
// // @route GET /auth/google/callback
router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      //error while authenticate
      req.session.status = err;
      res.redirect("/frontEnd");
    }
    req.logIn(user, function (err) {
      if (err) {
        //error wile logIn
        req.session.status = err;
        return res.redirect("/frontEnd");
      }
      return res.redirect("/AuthSucceed");
    });
  })(req, res, next);
});

//@desc google is Auth
router.get("/AuthSucceed", ensureAuth, (req, res) => {
  req.session.status = "AuthSucceed";
  res.redirect("/frontEnd");
});

//@desc google Auth Callback
router.get("/AuthFail", (req, res) => {
  req.session.status = "AuthFailed";
  res.redirect("/frontEnd");
});

//@desc google logout
router.get("/logout", ensureAuth, (req, res) => {
  req.logOut();
  req.session.status = "logged out";
  res.redirect("/frontEnd");
});

//@desc check if user is logged in
router.get("/isAuthUsers", ensureAuth, (req, res) => {
  req.session.status = "logged In";
  res.redirect("/frontEnd");
});

//@desc google logout
router.get("/frontEnd", (req, res) => {
  const result = req.session.status || "didnt tried to logged in yet";
  res.json({ status: result });
  // res.redirect("http://localhost:8080/#/menu");
});

module.exports = router;
