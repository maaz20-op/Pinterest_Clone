const express = require('express');
const router = express.Router();
const isLoggedIn = require("../../../../middlewares/isLoggedIn");
const postModel = require("../../../../models/post-model");
const commentModel = require("../../../../models/comment-model");
const userModel = require("../../../../models/user-model");
const upload = require("../../../../config/multerConfig");
const { uploadPost, likePost, searchPosts, deletePost, imagesFetchingFeedPage, videosFetchingFeedPage } = require("../../../../controller/app/post");
const apiRouteResFormate = require("../../../../utils/ApiRoute");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4")
 /*const server = new ApolloServer({
 
  typeDefs: `
   type User {
    id: ID!
    fullname: String
    username: String
    profileImage: String
    userCommented: [Comment]
   }

   type Post {
       postdata: String
       mediaUrl:String
       mediaType:String
       user: User
       likes: [User]
       comments: [Comment]
   }

 type Comment {
    text: String
 postId: Post
   userId: User
}

   type Query {
     getPost: [Post]
   }
  `,
  resolvers: {
Query: {
    getPost: () => getPosts()
},
Post: {
 user: (parent) => getUser(parent.user),
},
User: {
    userCommented: (parent) =>  getComments(parent.id)
}
  }
})


server.start()
.then(() => {
    console.log("apollo connected")
    router.use("/graphql", expressMiddleware(server))
})
.catch(err => console.log(`err of apollo server ${err}`))

async function getPosts(){
let post =  await postModel.find();
return post
}

async function getUser(id){
let user = await userModel.findById(id);
return user

}

async function getComments(userId){
    let comments = await commentModel.find({userId});
    return comments
}

*/
router.get("/images", isLoggedIn, apiRouteResFormate(imagesFetchingFeedPage));

router.get("/videos", isLoggedIn, apiRouteResFormate(videosFetchingFeedPage));

router.post("/", isLoggedIn, upload.single("media"), apiRouteResFormate(uploadPost) );

router.patch("/like", isLoggedIn, apiRouteResFormate(likePost));

router.delete("/:id",isLoggedIn, apiRouteResFormate(deletePost))

router.get("/", apiRouteResFormate(searchPosts))

module.exports = router;