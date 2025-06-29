const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: "maazpins",
      resource_type: isVideo ? "video" : "image",
      format: isVideo ? "mp4" : undefined,
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;