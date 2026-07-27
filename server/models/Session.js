const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    matchRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'MatchRequest', required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: String, required: true, trim: true },
    meetingLink: { type: String, default: '' },
    date: { type: Date },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    reviewByRequester: { type: Boolean, default: false },
    reviewByReceiver: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
