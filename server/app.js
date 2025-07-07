const express = require('express');
const app = express();

// Middleware

app.use(express.json());

//routes

app.get('/', (req, res)=>{
    res.send('QMS backend is running!')
});

module.exports = app;