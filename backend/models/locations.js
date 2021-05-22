const mongoose = require("mongoose");

const LocationsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  location: {
    type: [Number],
    required: true,
  },
  comments: {
    type: [],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
  },
  images: {
    type: [String],
  },
  comments: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        text: String,
      },
    ],
  },
  address: {
    type: String,
  },
  description: {
    type: String,
  },
  city: {
    type: String,
    enum: ["esfahan", "tehran"],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const LocationsModel = mongoose.model("locations", LocationsSchema);

module.exports.LocationsSchema = LocationsSchema;
module.exports.LocationsModel = LocationsModel;
