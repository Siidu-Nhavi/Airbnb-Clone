const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing, validateUpdateListing } = require("../middleware");
const listingController = require("../controllers/listing");

const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

// INDEX + CREATE
router.
  route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,

    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW + UPDATE + DELETE
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateUpdateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );

// EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
