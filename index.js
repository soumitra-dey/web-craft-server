const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const gpt = require('./routes/gpt');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use('/api/gpt', gpt);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.log('Not connected to database ERROR! ', err);
});

app.listen(8080, () => {
    console.log('App listening on port 8080!');
});
