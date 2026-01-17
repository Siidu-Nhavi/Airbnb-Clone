const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Routers
const listingRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const userRouter = require("./router/user.js");

/* ======================
   SESSION CONFIG
====================== */

const sessionOptions = {
  secret: "myknowledgeincse",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
  },
};

/* ======================
   DATABASE
====================== */

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  app.listen(8080, () => {
    console.log("Server running on port 8080");
  });
}

main().catch(err => console.error(err));

/* ======================
   VIEW ENGINE
====================== */

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ======================
   MIDDLEWARE
====================== */

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());

/* ======================
   PASSPORT CONFIG
====================== */

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ======================
   FLASH & USER LOCALS
====================== */

app.use((req, res, next) => {
  res.locals.success = req.flash("success"); 
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


/* ======================
   ROUTES
====================== */

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

/* ======================
   ERROR HANDLING
====================== */

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});
