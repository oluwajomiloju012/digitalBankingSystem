const axios = require('axios');


const PHOENIX_BASE_URL = 'https://nibssbyphoenix.onrender.com';

const getPhoenixToken = async () => {
    try {
        const response = await axios.post(
            `${PHOENIX_BASE_URL}/api/auth/token`,
            {
                apiKey: process.env.PHOENIX_API_KEY,
                apiSecret: process.env.PHOENIX_API_SECRET
            }
        );

        console.log('Phoenix token response:', response.data);

        return response.data;

    } catch (error) {
        console.error(
            'Phoenix authentication failed:',
            error.response?.data || error.message
        );

        throw error;
    }
};

const createAccount = async (kycType, kycID, dob) => {
    try {
       
        const tokenResponse = await getPhoenixToken();


         console.log('Token received:', tokenResponse.token ? 'YES' : 'NO');
        const response = await axios.post(
            `${PHOENIX_BASE_URL}/api/account/create`,
            {
                kycType,
                kycID,
                dob
            },
            {
                headers: {
                    Authorization: `Bearer ${tokenResponse.token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            'Phoenix account creation failed:',
            error.response?.data || error.message
        );

        throw error;
    }
};

const validateBvn = async (bvn) => {
    try {
        const tokenResponse = await getPhoenixToken();

        const response = await axios.post(
            `${PHOENIX_BASE_URL}/api/validateBvn`,
            {
                bvn
            },
            {
                headers: {
                    Authorization: `Bearer ${tokenResponse.token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            'Phoenix BVN validation failed:',
            error.response?.data || error.message
        );

        throw error;
    }
};

module.exports = {
    getPhoenixToken,
    createAccount,
    validateBvn
};