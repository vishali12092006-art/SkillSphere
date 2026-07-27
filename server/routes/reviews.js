const express = require('express');
const router = express.Router();
const { addReview, getReviews, getMyReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addReview);
router.get('/my', protect, getMyReviews);
router.get('/:userId', getReviews);

module.exports = router;
