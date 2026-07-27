const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', searchUsers);
router.get('/:id', getProfile);

// Private
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
