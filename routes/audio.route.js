const express = require("express");

const router = express.Router();

const { uploadAudio } = require("../controllers/audio.controller");

router.post("/upload", uploadAudio);

module.exports = router;
