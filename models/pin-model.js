const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  text: {
    type: String,
    maxlength: 300
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Pin", pinSchema);