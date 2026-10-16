const Customer = require('../model/customerModel.js');
const { insertBvn, validateBvn, insertNin, validateNin } = require('../config/nibssAdapter.js');

const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerCustomer = async (req,res) => {
    try {
        const {firstName, lastName, email, password, phone, dob} = req.body;

        if (!firstName || !lastName || !email || !password || !phone || !dob){
            return res.status(400).json({message:"required fields missing"});
        };

        // validate dob is in YYYY-MM-DD format
        const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dobRegex.test(dob)) {
            return res.status(400).json({ message: "dob must be in YYYY-MM-DD format" });
    }  

        const existingCustomer = await Customer.findOne({email});
        if (existingCustomer){
            res.status(400).json({message: "Customer with email already exist"});
        };

        const passwordHash = await bycrpt.hash(password, 10);

        const customer = await Customer.create({
            firstName,
            lastName,
            email,
            password: passwordHash,
            phone,
            dob
        });

        res.status(201).json({message:"Customer registered successfully",
            customer: {
                id: customer._id,
                name: customer.lastName,
                email: customer.email,
                isVerified: customer.isVerified
            }
        });


    } catch (error) {
        res.status(500).json({message:"registration failed", error: error.message});
    }
};


const loginCustomer = async (req, res) => {
    try {
        const {email, password} =req.body;

        const customer = await Customer.findOne({email});
        if (!customer){
            return res.status(400).json({message: "invalid credentials"});
        }

        const isMatch = await bycrpt.compare(password, customer.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"});
        }

        const token = jwt.sign(
            {id: customer._id},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        res.status(200).json({
            message:"Login successful",
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                isVerified: customer.isVerified
            }
        });

    } catch (error) {
        res.status(500).json({message: "error login in customer", error: error.message});
    }
};

const verifyCustomer = async (req, res) => {
    try {
        const { type, idNumber } = req.body;
        const { firstName, lastName, dob, phone } = req.customer;

        if (!type || !idNumber) {
            return res.status(400).json({ message: "required fields missing" });
        }

        let result;

        if (type === "bvn") {
            if (!phone) {
                return res.status(400).json({ message: "No phone number on file for this customer" });
            }
            await insertBvn({ bvn: idNumber, firstName, lastName, dob, phone });
            result = await validateBvn(idNumber);
        } else if (type === "nin") {
            await insertNin({ nin: idNumber, firstName, lastName, dob });
            result = await validateNin(idNumber);
        } else {
            return res.status(400).json({ message: "type must be 'bvn' or 'nin'" });
        }

        const customer = await Customer.findByIdAndUpdate(
            req.customer._id,
            { isVerified: true, bvnOrNin: idNumber, verificationType: type },
            { new: true }
        );

        res.status(200).json({
            message: "Customer verified successfully",
            nibssResponse: result,
            customer: {
                id: customer._id,
                isVerified: customer.isVerified
            }
        });

    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        res.status(status).json({ message: "Verification failed", error: message });
    }
};

const getMe = async (req, res) => {
  const c = req.customer;
  res.json({ customer: {
    firstName: c.firstName, lastName: c.lastName, email: c.email,
    phone: c.phone, dob: c.dob, isVerified: c.isVerified,
    verificationType: c.verificationType
  }});
};

module.exports = {
    loginCustomer,
    registerCustomer,
    verifyCustomer,
    getMe
};