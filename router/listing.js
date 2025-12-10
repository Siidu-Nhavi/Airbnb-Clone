const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../utils/Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

// Index route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// New Route
router.get("/new", (req, res) => {
  res.render("listings/new");
});

// Create Route
router.post(
  "/",
  wrapAsync(async (req, res) => {
    const { error } = listingSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.details[0].message);

    const listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success", "New Listing Created!");  // FIXED
    res.redirect("/listings");
  })
);

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); // FIXED
  }

  res.render("listings/show", { listing });
}));

// Edit form
router.get("/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exit");
    res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
});

// Update
router.put("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  res.redirect(`/listings/${id}`);
}));

// Delete
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

module.exports = router;
