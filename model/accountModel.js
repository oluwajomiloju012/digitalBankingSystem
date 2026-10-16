const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
            unique: true // enforces one account per customer
        },
        accountNumber: {
            type: String,
            required: true,
            unique: true
        },
        accountName: {
            type: String,
            required: true
        },
        bankCode: {
            type: String,
            required: true
        },
        balance: {
            type: Number,
            required: true,
            default: 0
        },
        nibssAccountId: {
            type: String // Nibss's internal _id for this account
        },
        fintechId: {
            type: String
        },
        kycType: {
            type: String
        },
        kycID: {
            type: String
        }
    },
    { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;