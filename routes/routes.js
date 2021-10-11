const express = require('express');

const authRoutes = require('./auth.route');
const audioRoutes = require('./audio.route');

const userAuthMiddleware = require('../middlewares/userAuth');

const router = express.Router();

router.use('/audio', audioRoutes);

router.use('/auth', authRoutes);

module.exports = router;
