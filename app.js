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
const localStrategy = require("passport-local");
const User = require("./models/user.js");

// Import router
const listingRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const userRouter = require("./router/user.js");

const sessionOptions = {
  secret: "myknowledgeincse",
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Use maxAge (milliseconds). If you want an expires Date, set expires: new Date(...)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // mitigate XSS
    // secure: true // enable in production when using HTTPS
  },
};

// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  // Start server after DB connection
  app.listen(8080, () => {
    console.log("Server running on port 8080");
  });
}

main().catch((err) => {
  console.error("DB connection error:", err);
});

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use((req,res,next) => {
  res.locals.success = req.flash("Success");
  res.locals.error = req.flash("error");
  next();
});

app.use((req, res, next) => {
  if (!req.isAuthenticated() && req.method === "GET") {
    req.session.returnTo = req.originalUrl;
  }
  next();
});




// Mount routers (after session & flash middleware)
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);

// 404 Handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});
