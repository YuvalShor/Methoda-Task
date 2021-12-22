const mongoose = require('mongoose');

const transitionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
});

module.exports.Transition = mongoose.model('Transition', transitionSchema);
