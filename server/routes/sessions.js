const express = require('express');
const router = express.Router();
const { getSessions, updateSession, completeSession, cancelSession } = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getSessions);
router.put('/:id', protect, updateSession);
router.put('/:id/complete', protect, completeSession);
router.put('/:id/cancel', protect, cancelSession);

module.exports = router;
