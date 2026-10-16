const Account = require('../model/accountModel.js');
const Customer = require('../model/customerModel.js');
const { createAccountWithKyc, nameEnquiry } = require('../config/nibssAdapter.js');
const { Transfer } = require('../model/transactionModel.js');

const createAccount = async (req, res) => {
    try {
        const customer = req.customer;

        // must be verified before creating an account
        if (!customer.isVerified) {
            return res.status(400).json({ message: "Customer must be verified before creating an account" });
        }

        // enforce one account per customer
        const existingAccount = await Account.findOne({ customerId: customer._id });
        if (existingAccount) {
            return res.status(400).json({ message: "Customer already has an account" });
        }

        // Nibss expects lowercase kycType — customer.bvnOrNin holds whichever they verified with
        const kycType = customer.verificationType; 
        const kycID = customer.bvnOrNin;
        const dob = customer.dob;

        const nibssResponse = await createAccountWithKyc({ kycType, kycID, dob });
        const nibssAccount = nibssResponse.account;

        const account = await Account.create({
            customerId: customer._id,
            accountNumber: nibssAccount.accountNumber,
            accountName: nibssAccount.accountName,
            bankCode: nibssAccount.bankCode,
            balance: nibssAccount.balance,
            nibssAccountId: nibssAccount._id,
            fintechId: nibssAccount.fintechId,
            kycType: nibssAccount.kycType,
            kycID: nibssAccount.kycID
        });

        res.status(201).json({
            message: "Account created successfully",
            account
        });

    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        res.status(status).json({ message: "Account creation failed", error: message });
    }
};

const getBalance = async (req, res) => {
    try {
        const account = await Account.findOne({ customerId: req.customer._id });

        if (!account) {
            return res.status(404).json({ message: "No account found for this customer" });
        }

        res.status(200).json({
            accountNumber: account.accountNumber,
            accountName: account.accountName,
            balance: account.balance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAccountName = async (req, res) => {
    try {
        const { accountNumber } = req.params;

        if (!accountNumber) {
            return res.status(400).json({ message: "accountNumber is required" });
        }

        const result = await nameEnquiry(accountNumber);

        res.status(200).json(result);
    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        res.status(status).json({ message: "Name enquiry failed", error: message });
    }
};

module.exports = {
    createAccount,
    getBalance,
    getAccountName
};