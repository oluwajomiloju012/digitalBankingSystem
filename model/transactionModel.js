const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        reference: {
            type: String,
            required: true,
            unique: true
        },
        senderAccount: {
            type: String,
            required: true
        },
        receiverAccount: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ['intra', 'inter'],
            required: true
        },
        status: {
            type: String,
            default: 'SUCCESS'
        },
        senderCustomerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        receiverCustomerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
            
        }
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;