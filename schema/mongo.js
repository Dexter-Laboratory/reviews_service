const mongoose = require('mongoose');

mongoose.connect();

const reviews = new mongoose.Schema({
  product_id: Number,
  rating: Number,
  date: Date,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfulness: Number,
  photos: [{ url: String }],
});

const characteristics = new mongoose.Schema({
  characteristic_id: Number,
  product_id: Number,
  characteristic: String,
  value: Number,
});

const characteristics = mongoose.model('characteristics', characteristics);
const reviews = mongoose.model('reviews', reviews);