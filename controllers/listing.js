const Listing = require("../models/listing");
const { listingSchema } = require("../utils/Schema");
const ExpressError = require("../utils/ExpressError");

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// CREATE
module.exports.createListing = async (req, res) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }

  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  await listing.save();

  req.flash("success", "New listing created");
  res.redirect(`/listings/${listing._id}`);
};

// SHOW
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  let avgRating = 0;

  if (listing.reviews.length) {
    const sum = listing.reviews.reduce((acc, r) => acc + r.rating, 0);
    avgRating = (sum / listing.reviews.length).toFixed(1);
  }

  res.render("listings/show", { listing, avgRating });
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${req.params.id}`);
};

// DELETE
module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
