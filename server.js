require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Cloudinary Configuration (from your Cloudinary account)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔥 Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "badminton-videos",
    resource_type: "video",
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    // Get Cloudinary URL
    const videoUrl = req.file.path;

    // Send video URL to Flask backend
    const response = await axios.post(
      "https://ai-back-6.onrender.com/process",
      { videoUrl }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing video" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
