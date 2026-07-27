const express = require('express');
const router = express.Router();
const { sendRequest, acceptRequest, rejectRequest, getRequests } = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRequests);
router.post('/', protect, sendRequest);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);

module.exports = router;
