const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports  = {
    connection
}