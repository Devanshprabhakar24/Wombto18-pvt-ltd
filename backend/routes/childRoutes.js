const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getChildren,
    getChild,
    addChild,
    updateChild,
    deleteChild,
} = require('../controllers/childController');

router.get('/', protect, getChildren);
router.get('/:id', protect, getChild);
router.post('/', protect, addChild);
router.put('/:id', protect, updateChild);
router.delete('/:id', protect, deleteChild);

module.exports = router;
