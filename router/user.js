const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body.user;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);

        req.flash("Success", "Welcome to Wanderlust");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});
router.post(
  "/login",
  (req, res, next) => {
    console.log("Login body:", req.body);
    next();
  },
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    console.log("Authenticated:", req.user.username);
    res.redirect("/listings");
  }
);

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  console.log("FOUND USER:", user?.username);

  User.authenticate()(username, password, (err, user, options) => {
    console.log("ERR:", err);
    console.log("USER:", user);
    console.log("OPTIONS:", options);

    if (!user) {
      return res.send("Authentication failed");
    }

    req.logIn(user, (err) => {
      if (err) return res.send("Login error");
      res.send("LOGIN SUCCESS");
    });
  });
});







module.exports = router;
