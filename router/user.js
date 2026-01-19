const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isAlreadyLoggedIn } = require("../middleware.js");
const {saveRedirectUrl} = require("../middleware.js");


// SIGNUP ROUTES

router.get("/signup", isAlreadyLoggedIn, (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  isAlreadyLoggedIn,
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body.user;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      // Auto-login after signup
      req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);


//LOGIN ROUTES

router.get("/login", isAlreadyLoggedIn, (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  isAlreadyLoggedIn,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password"
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
  }
);

//LOGOUT ROUTE

router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
