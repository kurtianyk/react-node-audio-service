const express = require('express');

const voucherManagementRoutes = require('./voucher-management.route.js');
const voucherRoutes = require('./voucher.route');
const authRoutes = require('./auth.route');
const audioRoutes = require('./audio.route');

const userAuthMiddleware = require('../middlewares/userAuth');

const router = express.Router();

router.use('/voucher-management', voucherManagementRoutes);

router.use('/voucher', userAuthMiddleware, voucherRoutes);

router.use('/audio', audioRoutes);

router.use('/auth', authRoutes);

module.exports = router;
