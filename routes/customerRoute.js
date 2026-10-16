const {loginCustomer, registerCustomer, verifyCustomer,getMe } = require('../controllers/customerController.js');
const { protect } = require('../middleware/authMiddleware.js');
const express = require('express');
const customerRouter = express.Router();

customerRouter.post('/register',registerCustomer);
customerRouter.post('/login',loginCustomer);
customerRouter.post('/verify', protect, verifyCustomer);
customerRouter.get('/me', protect, getMe);

module.exports = customerRouter;

