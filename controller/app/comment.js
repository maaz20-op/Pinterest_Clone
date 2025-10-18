const userModel = require('../../models/user-model');
const postModel = require('../../models/post-model');
const commentModel = require('../../models/comment-model');


module.exports.createComment = async function(req){
  let input = req.body.inputText;
  let id = req.body.postId;
  console.log(input, id)
  if(!input || !id) throw new Error('Invalid data Cant perform operation');
  try {
let post = await postModel.findById(id);
if(!post) throw new Error("not valid post");
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



 return [comment, loggedInUser]


    
  } catch(err) {
    throw err;
  }
};

module.exports.showAllComments = async function(req){
  let id = req.query.postId;
  console.log('show all cooments id post',id)
  
try {
if(!id) throw new Error('No ID Received!');
let post = await postModel.findById(id)
.populate({
  path:'comments',
  populate:{
    path:"userId",
    model:"User"
    
  },
});


console.log(post)
return [post];
} catch (err) {
  throw err;
}

};