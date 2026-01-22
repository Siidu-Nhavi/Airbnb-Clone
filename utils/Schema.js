const Joi = require("joi");
const review = require("../models/review");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),

    category: Joi.alternatives().try(
      Joi.array().items(
        Joi.string().valid(
          "trending",
          "rooms",
          "mountain",
          "castles",
          "arctic",
          "camping",
          "farm",
          "beach",
          "luxury",
          "budget",
          "top-rated"
        )
      ),
      Joi.string().valid(
        "trending",
        "rooms",
        "mountain",
        "castles",
        "arctic",
        "camping",
        "farm",
        "beach",
        "luxury",
        "budget",
        "top-rated"
      )
    ).required(),

    image: Joi.any()
  }).required()
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});

