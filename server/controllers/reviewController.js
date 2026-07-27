const Review = require('../models/Review');
const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Add a review after completed session
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { sessionId, rating, comment } = req.body;

    if (!sessionId || !rating) {
      return res.status(400).json({ message: 'Session and rating are required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Session must be completed before reviewing' });
    }

    const isRequester = session.requester.toString() === req.user._id.toString();
    const isReceiver = session.receiver.toString() === req.user._id.toString();

    if (!isRequester && !isReceiver) {
      return res.status(403).json({ message: 'Not a participant of this session' });
    }

    // Determine who is being reviewed
    const reviewedUserId = isRequester ? session.receiver : session.requester;

    // Check if already reviewed
    const existing = await Review.findOne({ reviewer: req.user._id, session: sessionId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this session' });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewedUser: reviewedUserId,
      session: sessionId,
      rating: parseInt(rating),
      comment: comment || '',
    });

    // Update session review flags
    if (isRequester) session.reviewByRequester = true;
    else session.reviewByReceiver = true;
    await session.save();

    // Recalculate average rating for reviewed user
    const allReviews = await Review.find({ reviewedUser: reviewedUserId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(reviewedUserId, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    await review.populate('reviewer', 'name avatar');
    res.status(201).json({ review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/:userId
// @access  Public
const getReviews = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Review.countDocuments({ reviewedUser: req.params.userId });
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ reviews, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews written by current user
// @route   GET /api/reviews/my
// @access  Private
const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id })
      .populate('reviewedUser', 'name avatar')
      .populate('session', 'skill date')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { addReview, getReviews, getMyReviews };
