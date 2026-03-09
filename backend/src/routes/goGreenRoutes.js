const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const { activityLogger } = require('../middleware/activityLogger');
const goGreenController = require('../controllers/goGreenController');

router.post('/enroll', protect, activityLogger('go_green_enroll', 'tree'), goGreenController.enroll);
router.post('/plant', protect, activityLogger('go_green_plant', 'tree'), goGreenController.recordPlantation);
router.get('/status', protect, goGreenController.getStatus);
router.get('/all', protect, roleCheck('admin'), goGreenController.listAll);

module.exports = router;
