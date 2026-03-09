const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { activityLogger } = require('../middleware/activityLogger');
const {
    getChildren,
    getChild,
    addChild,
    updateChild,
    deleteChild,
} = require('../controllers/childController');

router.get('/', protect, getChildren);
router.get('/:id', protect, getChild);
router.post('/', protect, activityLogger('add_child', 'child'), addChild);
router.put('/:id', protect, activityLogger('update_child', 'child'), updateChild);
router.delete('/:id', protect, activityLogger('delete_child', 'child'), deleteChild);

module.exports = router;
