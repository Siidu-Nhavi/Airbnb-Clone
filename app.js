const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema,reviewSchema } = require("./utils/Schema.js");
const Review = require("./models/review.js");


const ExpressError = require("./utils/ExpressError.js");


// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// handling the review
const validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errMsg);
   }else{
    next();
   }
};

// Index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// New listing form
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    //  Validate data using Joi
    const { error } = listingSchema.validate(req.body);

    if (error) {
      // extract readable message from Joi details
      const msg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(400, msg);
    }

    //  Create new listing if valid
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
  })
);


// Show listing details
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show", { listing });
});

// Edit form
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found!");
    }
    res.render("listings/edit", { listing });
  } catch (err) {
    console.error("Error loading edit page:", err);
    res.status(400).send("Invalid listing ID! ");
  }
});


// Update listing
app.put(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
    res.redirect(`/listings/${id}`);
  })
);


// Delete listing 
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
})

);

// Review Route
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");

    res.redirect(`/listings/${listing._id}`);
  })
);

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));




// Catch-all for undefined routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { err: { statusCode, message } });
});



// Start server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
