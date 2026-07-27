const MatchRequest = require('../models/MatchRequest');
const Session = require('../models/Session');

// @desc    Send a match request
// @route   POST /api/requests
// @access  Private
const sendRequest = async (req, res, next) => {
  try {
    const { receiverId, skillRequested, message } = req.body;

    if (!receiverId || !skillRequested) {
      return res.status(400).json({ message: 'Receiver and skill are required' });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    // Check for existing pending request
    const existing = await MatchRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      skillRequested,
      status: 'pending',
    });

    if (existing) {
      return res.status(400).json({ message: 'A pending request already exists for this skill' });
    }

    const request = await MatchRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      skillRequested,
      message: message || '',
    });

    await request.populate(['sender', 'receiver']);
    res.status(201).json({ request });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a match request
// @route   PUT /api/requests/:id/accept
// @access  Private
const acceptRequest = async (req, res, next) => {
  try {
    const request = await MatchRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }

    request.status = 'accepted';
    await request.save();

    // Auto-create a session
    const session = await Session.create({
      matchRequest: request._id,
      requester: request.sender,
      receiver: request.receiver,
      skill: request.skillRequested,
      status: 'upcoming',
    });

    await request.populate(['sender', 'receiver']);
    res.json({ request, session });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a match request
// @route   PUT /api/requests/:id/reject
// @access  Private
const rejectRequest = async (req, res, next) => {
  try {
    const request = await MatchRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }

    request.status = 'rejected';
    await request.save();
    await request.populate(['sender', 'receiver']);
    res.json({ request });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests for current user (sent + received)
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res, next) => {
  try {
    const { status, type } = req.query;

    let filter = {};
    if (type === 'sent') filter.sender = req.user._id;
    else if (type === 'received') filter.receiver = req.user._id;
    else filter.$or = [{ sender: req.user._id }, { receiver: req.user._id }];

    if (status) filter.status = status;

    const requests = await MatchRequest.find(filter)
      .populate('sender', 'name avatar averageRating city')
      .populate('receiver', 'name avatar averageRating city')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendRequest, acceptRequest, rejectRequest, getRequests };
