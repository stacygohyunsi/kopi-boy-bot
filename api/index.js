const express = require('express');

const router = express.Router();

router.use('/order', require('./order'));

module.exports = router;