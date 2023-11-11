const express = require('express');
const { getAddresses } = require('../controllers/addresses.controller');
const router = express.Router();

router.get('/account/addresses',getAddresses);

module.exports = router;