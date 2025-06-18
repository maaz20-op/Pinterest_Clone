const mongoose = require("mongoose");

  const userSchema = new mongoose.Schema({
  username: String,
  fullname:String,
  profileImage:{
    type:String,
    default: "https://iili.io/FnrRren.png"
  },
  email: String,
  password: String,
  post:[
    { 
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
  }
  ],
  pins:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Pin",
    }
    
    ],
});



module.exports = mongoose.model("User",userSchema);
