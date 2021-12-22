const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  labels: {
    type: Array,
    required: true,
  },
});

module.exports.Status = mongoose.model('Status', statusSchema);
