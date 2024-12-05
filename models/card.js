const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Card', cardSchema);
