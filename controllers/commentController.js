const userModel = require('../models/user-model');
const postModel = require('../models/post-model');
const commentModel = require('../models/comment-model');


module.exports.createComment = async function(req,res){
  let input = req.body.inputText;
  let id = req.body.postId
  console.log(input)
  console.log(id)
  if(!input || !id) return res.status(400).json("erorr");
  try {
let post = await postModel.findById(id);
if(!post) return res.status(500).json("not valid post");
let loggedInUser = await userModel.findById(req.user.id);

let comment = await commentModel.create({
  text:input,
  postId:post._id,
  userId:loggedInUser._id,
});


post.comments.push(comment._id);
loggedInUser.userCommented.push(comment._id);

await Promise.all([
post.save(),
loggedInUser.save()
  ])

console.log(comment)
console.log(loggedInUser)

return res.status(200).json({
  comment,
  loggedInUser,
});

    
  } catch(err) {
    console.log(err)
  
    res.status(404).json("Server error!")
  }
};


module.exports.showAllComments = async function(req,res){
  let id = req.query.postId;
  console.log(id)
  if(!id) return res.status(404).json("no id receive!")
try {

let post = await postModel.findById(id)
.populate({
  path:'comments',
  populate:{
    path:"userId",
    model:"User"
    
  },
});

console.log(post)

return res.status(200).json(post);

} catch (err) {
  res.status(500).json("Server error!")
}

};