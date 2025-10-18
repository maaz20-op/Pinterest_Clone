const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder:isVideo?'ReelNest/videos':'ReelNest/images',
      resource_type: isVideo ? "video" : "image",
     allowed_formats:['mp3', 'mp4', 'png', 'jpg','jpeg'],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;