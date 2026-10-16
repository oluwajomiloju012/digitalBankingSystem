const jwt = require('jsonwebtoken');
const Customer = require('../model/customerModel.js');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // fetch fresh customer data — don't trust stale JWT claims like isVerified
        const customer = await Customer.findById(decoded.id).select('-password');

        if (!customer) {
            return res.status(401).json({ message: 'Customer not found' });
        }

        req.customer = customer;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token failed' });
    }
};