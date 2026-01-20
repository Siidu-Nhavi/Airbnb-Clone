const express = require("express");
const router = express.Router();
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync");
const { isAlreadyLoggedIn, saveRedirectUrl } = require("../middleware");
const usersController = require("../controllers/users");

// SIGNUP ROUTES
router.get(
  "/signup",
  isAlreadyLoggedIn,
  usersController.renderSignupForm
);

router.post(
  "/signup",
  isAlreadyLoggedIn,
  wrapAsync(usersController.signup)
);

// LOGIN ROUTES
router.get(
  "/login",
  isAlreadyLoggedIn,
  usersController.renderLoginForm
);

router.post(
  "/login",
  saveRedirectUrl,
  isAlreadyLoggedIn,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password",
  }),
  usersController.login
);

// LOGOUT ROUTE
router.get("/logout", usersController.logout);

module.exports = router;
