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
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  // 🔍 Convert location → coordinates (Nominatim)
  const query = encodeURIComponent(
    `${listing.location}, ${listing.country}`
  );

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.length) {
    req.flash("error", "Location not found");
    return res.redirect("/listings/new");
  }

  //  Save GeoJSON coordinates
  listing.geometry = {
    type: "Point",
    coordinates: [
      parseFloat(data[0].lon),
      parseFloat(data[0].lat),
    ],
  };

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

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
  if(!listing){
    req.flash("error", "Listing you requested for does not exist");
  }
 let originalImageUrl = listing.image.url;
 originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit", { listing, originalImageUrl });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  let listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing);

  if ( typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${req.params.id}`);
};

// DELETE
module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
