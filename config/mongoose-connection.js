const mongoose = require('mongoose');
const config = require("config");

const mongodbURI = config.get("mongodbURI")
mongoose.connect(mongodbURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log('❌ Connection error:', err));
  
  module.exports = mongoose.connection;