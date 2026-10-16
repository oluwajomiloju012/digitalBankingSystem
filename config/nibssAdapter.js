const axios = require('axios');

const baseURL = process.env.NIBSS_BASE_URL;

const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

let cachedToken = null;
let tokenExpiry = null;

// get a fresh token from Nibss, or reuse cached one if still valid
const getToken = async () => {
    const now = Date.now();

    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        return cachedToken;
    }

    const response = await apiClient.post('/api/auth/token', {
        apiKey: process.env.NIBSS_API_KEY,
        apiSecret: process.env.NIBSS_API_SECRET
    });

    cachedToken = response.data.token;
    tokenExpiry = now + (55 * 60 * 1000); // refresh 5 min early

    return cachedToken;
};

// insert a BVN record
const insertBvn = async ({ bvn, firstName, lastName, dob, phone }) => {
    const response = await apiClient.post('/api/insertBvn', {
        bvn, firstName, lastName, dob, phone
    });
    return response.data;
};

// validate a BVN
const validateBvn = async (bvn) => {
    const response = await apiClient.post('/api/validateBvn', { bvn });
    return response.data;
};

// insert a NIN record
const insertNin = async ({ nin, firstName, lastName, dob }) => {
    const response = await apiClient.post('/api/insertNin', {
        nin, firstName, lastName, dob
    });
    return response.data;
};

// validate a NIN
const validateNin = async (nin) => {
    const response = await apiClient.post('/api/validateNin', { nin });
    return response.data;
};

// create account using KYC 
const createAccountWithKyc = async ({ kycType, kycID, dob }) => {
    const token = await getToken();

    const response = await apiClient.post(
        '/api/account/create',
        { kycType, kycID, dob },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

const nameEnquiry = async (accountNumber) => {
    const token = await getToken();

    const response = await apiClient.get(
        `/api/account/name-enquiry/${accountNumber}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

const transferFunds = async ({ from, to, amount }) => {
    const token = await getToken();

    const response = await apiClient.post(
        '/api/transfer',
        { from, to, amount },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

const getTransactionByReference = async (ref) => {
    const token = await getToken();

    const response = await apiClient.get(
        `/api/transaction/${ref}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

module.exports = {
    getToken,
    insertBvn,
    validateBvn,
    insertNin,
    validateNin,
    createAccountWithKyc,
    nameEnquiry,
    transferFunds,
    getTransactionByReference
};