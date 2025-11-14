const userModel = require("../../models/user-model");
const postModel = require("../../models/post-model");
const pinModel = require("../../models/pin-model");
const cloudinary = require("../../config/cloudinary.js");
const upload = require("../../config/multerConfig");
const mongoose = require("mongoose");
const {deleteimgFromCloudinary} = require("../../utils/deleteImageFromCloudinary.js");

module.exports.uploadPost = async function(req){
  try {
   let {AIimg} = req.body
   console.log("base ai img",AIimg)
    let user = await userModel.findOne({
      email:req.user.email,
    });
  
  if(!user) throw new Error("Failed to Upload Post!");

let file;
let type;
let folderName;
 if(req.file && !AIimg) {
 file = req.file;
 type =  file.mimetype.startsWith("video/")?"video":"image";
 folderName =  file.mimetype.startsWith("video/")?"video":"image";
  console.log("this is our file of storage local", file)
} else if (AIimg && !req.file){
  // send image from frontend!
  folderName = "image";
 file = AIimg;
 type = 'image';
  console.log("this is our file of Ai", file)
}

let optimizeUrl = file.path?.replace("/upload/", "/upload/q_auto,f_auto/") || file;



  let post = await postModel.create({
    mediaUrl:optimizeUrl,
    mediaType:type,
    user:user._id,
    postdata:req.body.postdata,
  });
  
user.post.push(post._id);
await user.save();

return [post, user];
} catch(err) {
  throw err
}
}

module.exports.deletePost = async function(req) {
  const id = req.params.id;
  console.log(id)
  if (!id) {
     throw new Error("something went Wrong!");
  }

  try {
    const post = await postModel.findById(id);
    if (!post) {
      throw new Error("Please Give a Valid Post!");
    }
    const user = await userModel.findById(req.user.id);
    if (!user) {
       throw new Error("something went Wrong!");
    }

const url = post.mediaUrl
const mediaType = post.mediaType;
 let result = await deleteimgFromCloudinary(url, mediaType);
 console.log(result)
    await post.deleteOne();
    
    user.post = user.post.filter(
      (eachId) => eachId.toString() !== post._id.toString()
    );
    await user.save();
 console.log("deleted post")
  return ["success"];
  } catch (err) {
    throw err
  }
};

module.exports.likePost = async function(req){
try {
  let post = await postModel.findById(req.body.id);
  let loggedInUser = await userModel.findById(req.user.id);
  
  if(!post || !loggedInUser) {
    throw new Error("Something went Wrong!");
  };
  
  if(!post.likes.includes(loggedInUser._id.toString())) {
  post.likes.push(loggedInUser._id);
  await post.save();
}

return [post, loggedInUser]
  
} catch (err) {
  throw err
}
 
}

module.exports.searchPosts = async  function(req){
  try {
    let input = req.query.text;
    console.log(input)
if (!input) {
  throw new Error("something went Wrong!")
}


let posts = await postModel.find(
 { postdata: { $regex: input, $options: 'i' }}
)
.populate({
  path: "user",
  model: "User",
  match: {
    accountVisibility: "Public"
  },
  select: "-post -bio"
})



posts = posts.filter((post)=>{
  return post.user !== null;
  
})


return [posts]
  } catch (err) {
    throw err;
  }
}

module.exports.imagesFetchingFeedPage = async function(req, res){
 try {
const page = Number(req.query.page) || 1;
const limit = 4

const skip = (page - 1) * limit;
//console.log(`in image skip = ${skip} and page = ${page}`)
let loggedInUser  = await userModel.findById(req.user._id);
const posts = await postModel.aggregate([
  {
    $match: {
      mediaType:'image',
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'userData'
    }
  },
  {
    $unwind: "$userData"
  },
  { $match: {
    'userData.accountVisibility': 'Public'
  }
  },
  { $skip: skip },
  { $limit: limit },
  
  ])



console.log("images length",posts)
return [posts,loggedInUser]

  } catch (err) {
throw err
  }
}

module.exports.videosFetchingFeedPage = async function(req, res){
  try {
const page = Number(req.query.page) || 1;
const limit = 4
const skip = (page - 1) * limit;
//console.log(`in video skip = ${skip} and page = ${page}`)
let loggedInUser  = await userModel.findById(req.user._id);

const posts = await postModel.aggregate([
  {
    $match: {
      mediaType:'video',
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'userData'
    }
  },
  {
    $unwind: "$userData"
  },
  {
    $match: {
      'userData.accountVisibility': 'Public'
  }
  },
  { $skip: skip  },
  { $limit: limit }
  
  
  ])



console.log("video length",posts)
console.log(posts)
return [posts,loggedInUser]
  } catch (err) {
  throw err;
  }
}