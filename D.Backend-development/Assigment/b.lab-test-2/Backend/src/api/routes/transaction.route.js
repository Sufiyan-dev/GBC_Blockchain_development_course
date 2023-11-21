const express = require('express');
const { getTransactionHistory, sendTransaction } = require('../controllers/transaction.controller');

const router = express.Router();

router.get('/transaction/history',getTransactionHistory);
router.post('/transaction/send',sendTransaction)

module.exports = router;