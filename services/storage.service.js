const path = require('path');
const moment = require('moment');

const firebase = require("../config/firebase.admin");
// import { streamToBuffer } from '../utils';

async function upload(files, url) {
    if (files.length === 0) {
      throw new Error('File not found');
    }

    const file = files.file;
    return new Promise((resolve, reject) => {
      const storage = firebase.storage();
      const bucket = storage.bucket(process.env.GOOGLE_FIREBASE_BUCKET);

      const fileInfo = path.parse(file.name.replace(' ', '-'));
      const filename = `${fileInfo.name}_${moment().unix()}${fileInfo.ext}`;
      const fileUpload = bucket.file(filename);

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', () => {
        reject(new Error('Something is wrong! Unable to upload at the moment.'));
      });

      blobStream.on('finish', () => {
        resolve(url || `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
      });

      blobStream.end(file.buffer);
    });
  }

  // uploadStream(stream: any): Promise<string> {
  //   if (!stream) {
  //     throw new Error('Stream not found');
  //   }

  //   return new Promise((resolve, reject) => {
  //     const storage = firebase.storage();
  //     const bucket = storage.bucket(process.env.GOOGLE_FIREBASE_BUCKET);

  //     const fileInfo = path.parse('screenshot.png');

  //     const filename = `${fileInfo.name}_${moment().unix()}${fileInfo.ext}`;

  //     const fileUpload = bucket.file(filename);
  //     const blobStream = fileUpload.createWriteStream({
  //       metadata: {
  //         contentType: 'image/png',
  //       },
  //     });

  //     const streamBuffer = streamToBuffer(stream);
  //     return streamBuffer.then(buffer => {
  //       blobStream.on('error', () => {
  //         reject(new Error('Something is wrong! Unable to upload at the moment.'));
  //       });

  //       blobStream.on('finish', () => {
  //         resolve(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
  //       });

  //       blobStream.end(buffer);
  //     });
  //   });
  // }

  // uploadBuffer(buffer: any): Promise<string> {
  //   if (!buffer) {
  //     throw new Error('Buffer not found');
  //   }

  //   return new Promise((resolve, reject) => {
  //     const storage = firebase.storage();
  //     const bucket = storage.bucket(process.env.GOOGLE_FIREBASE_BUCKET);

  //     const fileInfo = path.parse('screenshot.png');

  //     const filename = `${fileInfo.name}_${moment().unix()}${fileInfo.ext}`;

  //     const fileUpload = bucket.file(filename);
  //     const blobStream = fileUpload.createWriteStream({
  //       metadata: {
  //         contentType: 'image/png',
  //       },
  //     });

  //     blobStream.on('error', () => {
  //       reject(new Error('Something is wrong! Unable to upload at the moment.'));
  //     });

  //     blobStream.on('finish', () => {
  //       resolve(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
  //     });

  //     blobStream.end(buffer);
  //   });
  // }


  module.exports = {
    upload,
  };
