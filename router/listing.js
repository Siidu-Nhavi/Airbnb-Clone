const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../utils/Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Index route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be logged in to create listing ");
    return res.redirect("/login");
  }
  res.render("listings/new");
});

// Create Route
router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { error } = listingSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.details[0].message);

    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// Show Route
router.get(
  "/:id",
  isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
  }));

// Edit form
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exit");
    res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
});

// Update
router.put("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  res.redirect(`/listings/${id}`);
}));

// Delete
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

module.exports = router;
