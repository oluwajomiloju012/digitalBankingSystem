const cors = require('cors');
require('dotenv').config();
const express = require('express');
const { connection} = require('./config/database.js');
const app = express();

app.use(cors());
//middleware
app.use(express.json());
app.use(express.static('public'));

const accountRouter = require('./routes/accountRoutes.js');
const customerRouter = require('./routes/customerRoute.js');

app.use('/api/accounts', accountRouter);
app.use('/api/customers',customerRouter);


connection();

// app.get('/', (req,res) => {
//     res.send("Welcome to Digital Banking System");
// });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


