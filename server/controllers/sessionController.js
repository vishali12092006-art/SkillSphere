const Session = require('../models/Session');

// @desc    Get sessions for current user
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res, next) => {
  try {
    const { status } = req.query;
    let filter = {
      $or: [{ requester: req.user._id }, { receiver: req.user._id }],
    };
    if (status) filter.status = status;

    const sessions = await Session.find(filter)
      .populate('requester', 'name avatar city averageRating')
      .populate('receiver', 'name avatar city averageRating')
      .populate('matchRequest')
      .sort({ date: 1, createdAt: -1 });

    res.json({ sessions });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session (date, meetingLink)
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = async (req, res, next) => {
  try {
    const { date, meetingLink } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isParticipant =
      session.requester.toString() === req.user._id.toString() ||
      session.receiver.toString() === req.user._id.toString();

    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    if (date !== undefined) session.date = date;
    if (meetingLink !== undefined) session.meetingLink = meetingLink;

    await session.save();
    await session.populate('requester', 'name avatar');
    await session.populate('receiver', 'name avatar');
    res.json({ session });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark session as completed
// @route   PUT /api/sessions/:id/complete
// @access  Private
const completeSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isParticipant =
      session.requester.toString() === req.user._id.toString() ||
      session.receiver.toString() === req.user._id.toString();

    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    session.status = 'completed';
    await session.save();
    res.json({ session });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a session
// @route   PUT /api/sessions/:id/cancel
// @access  Private
const cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isParticipant =
      session.requester.toString() === req.user._id.toString() ||
      session.receiver.toString() === req.user._id.toString();

    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    session.status = 'cancelled';
    await session.save();
    res.json({ session });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSessions, updateSession, completeSession, cancelSession };
