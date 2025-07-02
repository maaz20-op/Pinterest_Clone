const mongoose = require("mongoose");

  const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  username: {
    type: String,
  },
  profileImage:{
    type:String,
    default: "https://iili.io/FnrRren.png"
  },
  email: String,
  password: String,
  bio:{
    type:String,
    default:"Nothing to see the details...",
  },
  accountVisibility:{
    type:String,
    default:"Public",
  },
  blockedUserId:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  post:[
    { 
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
  }
  ],
  blockedBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }],
  pins:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Pin",
    }
    
    ],
    following: [{
   type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    }],
    followers:[{
   type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    }],
    userCommented:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Comment',
    }],
});



module.exports = mongoose.model("User",userSchema);
