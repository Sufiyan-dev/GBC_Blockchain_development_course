const express = require('express');
const { getAddresses, getBalance } = require('../controllers/addresses.controller');
const router = express.Router();

router.get('/account/addresses',getAddresses);
router.get('/account/balance/:address',getBalance)

module.exports = router;