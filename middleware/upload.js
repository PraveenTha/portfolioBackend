const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {

    let folder = "portfolio/misc";
    let resourceType = "image";

    /* ===== ABOUT IMAGE ===== */
    if (file.fieldname === "image") {
      folder = "portfolio/about";
      resourceType = "image";
    }

    /* ===== RESUME FILE ===== */
    if (file.fieldname === "resumeFile") {
      folder = "portfolio/resume";
      resourceType = "raw"; // pdf/doc etc
    }

    /* ===== PROJECT IMAGE ===== */
    if (file.fieldname === "projectImage") {
      folder = "portfolio/projects";
      resourceType = "image";
    }

    /* ===== EXPERIENCE LOGO ===== */
    if (file.fieldname === "logo") {
      folder = "portfolio/experience";
      resourceType = "image";
    }

    /* ===== BLOG IMAGE ===== */
    if (file.fieldname === "blogImage") {
      folder = "portfolio/blogs";
      resourceType = "image";
    }

    return {
      folder,
      resource_type: resourceType,
      type: "upload",
      access_mode: "public",
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

module.exports = upload;