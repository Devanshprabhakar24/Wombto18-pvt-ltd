const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'WombTo18 API is healthy' });
});

module.exports = router;
