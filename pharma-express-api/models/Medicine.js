const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  medicineId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;