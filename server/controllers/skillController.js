const User = require('../models/User');

// @desc    Add a skill (teach or learn)
// @route   POST /api/skills
// @access  Private
const addSkill = async (req, res, next) => {
  try {
    const { name, category, level, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Skill name and type (teach/learn) are required' });
    }

    if (!['teach', 'learn'].includes(type)) {
      return res.status(400).json({ message: 'Type must be teach or learn' });
    }

    const user = await User.findById(req.user._id);
    const skillField = type === 'teach' ? 'skillsTeach' : 'skillsLearn';

    // Check for duplicate
    const alreadyExists = user[skillField].some(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
    if (alreadyExists) {
      return res.status(400).json({ message: 'Skill already added' });
    }

    user[skillField].push({ name, category: category || 'Other', level: level || 'Beginner' });
    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:skillId
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    const { name, category, level, type } = req.body;

    if (!['teach', 'learn'].includes(type)) {
      return res.status(400).json({ message: 'Type must be teach or learn' });
    }

    const user = await User.findById(req.user._id);
    const skillField = type === 'teach' ? 'skillsTeach' : 'skillsLearn';

    const skill = user[skillField].id(req.params.skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    if (name) skill.name = name;
    if (category) skill.category = category;
    if (level) skill.level = level;

    await user.save();
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:skillId
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const { type } = req.body;

    if (!['teach', 'learn'].includes(type)) {
      return res.status(400).json({ message: 'Type must be teach or learn' });
    }

    const user = await User.findById(req.user._id);
    const skillField = type === 'teach' ? 'skillsTeach' : 'skillsLearn';

    const skillIndex = user[skillField].findIndex(
      (s) => s._id.toString() === req.params.skillId
    );

    if (skillIndex === -1) return res.status(404).json({ message: 'Skill not found' });

    user[skillField].splice(skillIndex, 1);
    await user.save();

    res.json({ message: 'Skill removed', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique skills (for search suggestions)
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res, next) => {
  try {
    const users = await User.find().select('skillsTeach skillsLearn');
    const skillSet = new Set();

    users.forEach((user) => {
      user.skillsTeach.forEach((s) => skillSet.add(s.name));
      user.skillsLearn.forEach((s) => skillSet.add(s.name));
    });

    const skills = Array.from(skillSet).sort();
    res.json({ skills });
  } catch (error) {
    next(error);
  }
};

module.exports = { addSkill, updateSkill, deleteSkill, getSkills };
