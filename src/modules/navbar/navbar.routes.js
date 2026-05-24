const express = require('express');
const router = express.Router();
const authMiddleware = require('../../shared/middlewares/auth.middleware');
const {statusController, desbloquearController} = require('./navbar.controller');

/**
 * GET /api/navbar/status
 */
router.get('/status', authMiddleware, statusController);

/**
 * POST /api/navbar/desbloquear
 */
router.post('/desbloquear', authMiddleware, desbloquearController);

module.exports = router;