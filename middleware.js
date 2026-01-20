const { listingSchema } = require("./utils/Schema");
const {reviewSchema} = require("./utils/Schema");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};


// only valid user can delete review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};

module.exports.isAlreadyLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("success", "You are already logged in");
    return res.redirect("/listings");
  }
  next();
};
module.exports.saveRedirectUrl = (req,res,next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission");
    return res.redirect(`/listings/${id}`);
  }

  next();
};



//Note: Cannot set headers after they are sent 
// here i initially make mistake after flashing succes or failure message i directly redirected to listings that is not right way to do that cause it leads our server crash . it is important to avoid. and return it.