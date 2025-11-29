const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://unsplash.com/photos/brown-wooden-fence-on-brown-sand-near-body-of-water-during-sunset-GaDccucZhvE",
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (Listing) =>{
  if (Listing) {
    await Review.deleteMany({
      _id: {
        $in: Listing.reviews,
      },
    });
  }   
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
