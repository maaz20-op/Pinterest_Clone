const { HfInference } = require("@huggingface/inference")
const cloudinary = require("../../config/cloudinary");
const {deleteimgFromCloudinary}  = require("../../utils/deleteImageFromCloudinary.js");


module.exports.generateAiImage = async function (req){
 try { 
   let { prompt } = req.body;
  if(!prompt) throw new Error("please give a Prompt for a Image!")
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

 let imgResult = await hf.textToImage({
    model: "stabilityai/stable-diffusion-2",
    inputs: prompt,
    parameters: {
    width: 1024,
    height: 1024,
  }
 })
  
const arrayBuffer = await imgResult.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const base64Image = `data:image/png;base64,${base64}`;
    const uploadRes = await cloudinary.uploader.upload(base64Image, {
       folder:'reelnest_ai_Gen_media/images',
       resource_type: "image",
       allowed_formats:['mp3', 'mp4', 'png', 'jpg','jpeg'],
    })
       
    let optimizedUrl = uploadRes.secure_url?.replace("/upload/", "/upload/q_auto,f_auto/");


    
    
   const url = optimizedUrl;
   if(!url) throw new Error("failed To generate Img!");
   
 return [url];
 } catch(err) {
 throw err;
 }
};

module.exports.deleteAiImgFromCloudinary = async function(req) {
  try {
 let { generatedImage } = req.body;
 if(!generatedImage) throw new Error("Cant Delete Image from cloudinary");
 let res = await deleteimgFromCloudinary(generatedImage, 'image');
 console.log("ai image deleted  $$$$", res)
 return ['successfully deleled image'];
  } catch(err) {
 throw err;
  }
}