const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        bvnOrNin: {
            type: String
        },
        dob: {
            type: String, // or Date, if you want proper date handling
            required: true
        },
        verificationType: {
            type: String,
            enum: ['bvn', 'nin']
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;