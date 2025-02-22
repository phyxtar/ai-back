const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const FLASK_BACKEND = process.env.FLASK_BACKEND;
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const videoPath = path.join(__dirname, req.file.path);

  try {
    const response = await axios.post(`${FLASK_BACKEND}/process`, formData, {
      headers: { ...formData.getHeaders() },
    });
  } catch (error) {
    res.status(500).json({ error: "Error processing video" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
