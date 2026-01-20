const express = require("express");
const router = express.Router();
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync");
const { isAlreadyLoggedIn, saveRedirectUrl } = require("../middleware");
const usersController = require("../controllers/users");

// SIGNUP
router.route("/signup")
  .get(isAlreadyLoggedIn, usersController.renderSignupForm)
  .post(isAlreadyLoggedIn, wrapAsync(usersController.signup));

// LOGIN
router.route("/login")
  .get(isAlreadyLoggedIn, usersController.renderLoginForm)
  .post(
    saveRedirectUrl,
    isAlreadyLoggedIn,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: "Invalid username or password",
    }),
    usersController.login
  );

// LOGOUT
router.get("/logout", usersController.logout);

module.exports = router;
