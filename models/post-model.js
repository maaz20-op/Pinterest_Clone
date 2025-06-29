const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postdata: {
    type: String,
  },
  mediaUrl:String,
  mediaType:String,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  likes: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
    }
  ],
  comments:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:"Comment",
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);