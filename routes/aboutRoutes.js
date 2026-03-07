const express = require("express");
const router = express.Router();
const About = require("../models/About");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

/* ========= GET ABOUT ========= */
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    console.error("ABOUT FETCH ERROR:", err);
    res.status(500).json({ message: "About fetch failed" });
  }
});

/* ========= UPDATE ABOUT ========= */
router.put(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        rotatingSubtitles,
        description,
        removeImage,
        removeResume,
        resumeLink,
      } = req.body;

      let about = await About.findOne();

      if (!about) {
        about = new About();
      }

      /* ========= TEXT UPDATE ========= */

      about.title = title || "";
      about.description = description || "";

      if (rotatingSubtitles) {
        try {
          about.rotatingSubtitles = JSON.parse(rotatingSubtitles);
        } catch {
          about.rotatingSubtitles = [];
        }
      }

      /* ========= IMAGE DELETE ========= */

      if (removeImage === "true" && about.imagePublicId) {
        await cloudinary.uploader.destroy(about.imagePublicId);

        about.image = "";
        about.imagePublicId = "";
      }

      /* ========= IMAGE UPLOAD ========= */

      if (req.files?.image?.length) {
        if (about.imagePublicId) {
          await cloudinary.uploader.destroy(about.imagePublicId);
        }

        const uploadedImage = req.files.image[0];

        about.image = uploadedImage.path;
        about.imagePublicId = uploadedImage.filename;
      }

      /* ========= RESUME DELETE ========= */

      if (removeResume === "true" && about.resumePublicId) {
        await cloudinary.uploader.destroy(about.resumePublicId, {
          resource_type: "raw",
        });

        about.resumeFile = "";
        about.resumePublicId = "";
      }

      /* ========= RESUME FILE UPLOAD ========= */

      if (req.files?.resumeFile?.length) {
        if (about.resumePublicId) {
          await cloudinary.uploader.destroy(about.resumePublicId, {
            resource_type: "raw",
          });
        }

        const uploadedResume = req.files.resumeFile[0];

        about.resumeFile = uploadedResume.path;
        about.resumePublicId = uploadedResume.filename;
      }

      /* ========= RESUME LINK (Google Drive) ========= */

      if (resumeLink) {
        about.resumeFile = resumeLink;
        about.resumePublicId = "";
      }

      await about.save();

      res.json(about);
    } catch (err) {
      console.error("ABOUT UPDATE ERROR:", err);
      res.status(500).json({ message: "About update failed" });
    }
  }
);

module.exports = router;