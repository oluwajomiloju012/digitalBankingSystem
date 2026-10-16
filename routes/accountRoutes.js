const express = require('express');
const { createAccount,getBalance,getAccountName } = require('../controllers/accountController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { transfer,getTransactionStatus,getMyTransactions } = require('../controllers/transferController.js');

const accountRouter = express.Router();

accountRouter.post('/create', protect, createAccount);
accountRouter.get('/balance', protect, getBalance);
accountRouter.get('/name-enquiry/:accountNumber', protect, getAccountName);
accountRouter.post('/transfer', protect, transfer);
accountRouter.get('/transaction/:ref', protect, getTransactionStatus);
accountRouter.get('/transactions', protect, getMyTransactions);

module.exports = accountRouter;