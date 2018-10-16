const mongoose = require('mongoose');

const placesSchema = new mongoose.Schema({
  start: {
    address: String,
    lat: Number,
    lng: Number,
  },
  end: {
    address: String,
    lat: Number,
    lng: Number,
  },
  lyft: Array,
  uber: Array,
});

const Places = mongoose.model('places', placesSchema);

module.exports.Places = Places;
