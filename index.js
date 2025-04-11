const express = require('express');
const cors = require('cors');
const connectDB = require('./Controller/db');
const router = require('./Controller/router');
require('dotenv').config();

const app = express();

connectDB();
app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${process.env.PORT}`);
});
