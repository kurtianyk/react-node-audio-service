const moment = require("moment");

const admin = require("../config/firebase.admin.js");

const db = admin.firestore();

const storageService = require("../services/storage.service");

async function uploadAudio(req, res) {
  try {
    // const {
    // } = req.body;

    const audioSrc = await storageService.upload(req.files);
    console.log(audioSrc, 'audioSrc')

    // const newAudio = {
    //   updatedAt: moment().toDate(),
    //   createdAt: moment().toDate(),
    // };

    // const savedNewAudio = await db.collection("audio_files").add(newAudio);
    // const audioData = await db
    //   .collection("audio_files")
    //   .doc(savedNewAudio.id)
    //   .get();

    res.status(200).json({ audioSrc: audioSrc });
  } catch (err) {
    return res.status(500).send(err);
  }
}

module.exports = {
  uploadAudio,
};