const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, city, experienceLevel, availability } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (city !== undefined) user.city = city;
    if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
    if (availability !== undefined) user.availability = availability;

    await user.save();
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile avatar
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete old avatar if exists
    if (user.avatar) {
      const oldPath = path.join(__dirname, '../', user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.avatar = `uploads/${req.file.filename}`;
    await user.save();

    res.json({ user, avatarUrl: user.avatar });
  } catch (error) {
    next(error);
  }
};

// @desc    Search and browse users (by skill, category, name)
// @route   GET /api/users
// @access  Public
const searchUsers = async (req, res, next) => {
  try {
    const { skill, category, name, page = 1, limit = 12 } = req.query;

    let query = { role: 'user' };

    if (skill) {
      query.$or = [
        { 'skillsTeach.name': { $regex: skill, $options: 'i' } },
        { 'skillsLearn.name': { $regex: skill, $options: 'i' } },
      ];
    }

    if (category) {
      query.$or = [
        { 'skillsTeach.category': category },
        { 'skillsLearn.category': category },
      ];
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    // Exclude current user if logged in
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ averageRating: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users/all
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments();
    const users = await User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadAvatar, searchUsers, getAllUsers };
