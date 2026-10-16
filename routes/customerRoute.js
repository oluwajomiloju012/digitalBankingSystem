const {loginCustomer, registerCustomer, verifyCustomer } = require('../controllers/customerController.js');
const { protect } = require('../middleware/authMiddleware.js');
const express = require('express');
const customerRouter = express.Router();

customerRouter.post('/register',registerCustomer);
customerRouter.post('/login',loginCustomer);
customerRouter.post('/verify', protect, verifyCustomer);

module.exports = customerRouter;

