const express = require('express');
const router = express.Router();
const { addSkill, updateSkill, deleteSkill, getSkills } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.get('/', getSkills);
router.post('/', protect, addSkill);
router.put('/:skillId', protect, updateSkill);
router.delete('/:skillId', protect, deleteSkill);

module.exports = router;
