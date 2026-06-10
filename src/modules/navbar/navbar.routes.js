const express = require('express');
const router = express.Router();
const {statusController, desbloquearController} = require('./navbar.controller');

/**
 * GET /api/navbar/status
 */
router.get('/status', statusController);

/**
 * POST /api/navbar/desbloquear
 */
router.post('/desbloquear', desbloquearController);

module.exports = router;