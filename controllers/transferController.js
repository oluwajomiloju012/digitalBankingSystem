const Transaction = require('../model/transactionModel.js');
const { transferFunds,getTransactionByReference } = require('../config/nibssAdapter.js');
const Account = require('../model/accountModel.js');

const transfer = async (req, res) => {
    try {
        const { toAccountNumber, amount } = req.body;

        if (!toAccountNumber || !amount || amount <= 0) {
            return res.status(400).json({ message: "valid account number and a valid amount are required" });
        }

        const senderAccount = await Account.findOne({ customerId: req.customer._id });
        if (!senderAccount) {
            return res.status(404).json({ message: "Sender account not found" });
        }

        if (senderAccount.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const receiverLocalAccount = await Account.findOne({ accountNumber: toAccountNumber });
        const transferType = receiverLocalAccount ? 'intra' : 'inter';

        const nibssResult = await transferFunds({
            from: senderAccount.accountNumber,
            to: toAccountNumber,
            amount
        });

        if (nibssResult.status !== 'SUCCESS') {
            return res.status(400).json({ message: "Transfer failed", nibssResult });
        }

        senderAccount.balance -= amount;
        await senderAccount.save();

        if (receiverLocalAccount) {
            receiverLocalAccount.balance += amount;
            await receiverLocalAccount.save();
        }

        const transaction = await Transaction.create({
            reference: nibssResult.reference,
            senderAccount: senderAccount.accountNumber,
            receiverAccount: toAccountNumber,
            amount,
            type: transferType,
            status: nibssResult.status,
            senderCustomerId: req.customer._id,
            receiverCustomerId: receiverLocalAccount ? receiverLocalAccount.customerId : undefined
        });

        res.status(200).json({
            message: "Transfer successful",
            transaction
        });

    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        res.status(status).json({ message: "Transfer failed", error: message });
    }
};

const getTransactionStatus = async (req, res) => {
    try {
        const { ref } = req.params;

        // ensure this transaction belongs to the logged-in customer — data isolation
        const localTransaction = await Transaction.findOne({
            reference: ref,
            $or: [
                { senderCustomerId: req.customer._id },
                { receiverCustomerId: req.customer._id }
            ]
        });

        if (!localTransaction) {
            return res.status(404).json({ message: "Transaction not found or access denied" });
        }

        const nibssResult = await getTransactionByReference(ref);

        res.status(200).json(nibssResult);
    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        res.status(status).json({ message: "Failed to fetch transaction status", error: message });
    }
};

const getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [
                { senderCustomerId: req.customer._id },
                { receiverCustomerId: req.customer._id }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: transactions.length,
            transactions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    transfer,
    getTransactionStatus,
    getMyTransactions
};