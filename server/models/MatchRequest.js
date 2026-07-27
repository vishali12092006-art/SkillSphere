const mongoose = require('mongoose');

const matchRequestSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillRequested: { type: String, required: true, trim: true },
    message: { type: String, default: '', maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Prevent duplicate pending requests between same pair for same skill
matchRequestSchema.index({ sender: 1, receiver: 1, skillRequested: 1 }, { unique: false });

module.exports = mongoose.model('MatchRequest', matchRequestSchema);
