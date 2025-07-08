const express = require('express');
const app = express();
const path = require('path');
const adminRoutes = require('./routes/admins')
// Middleware

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use('/admins',adminRoutes)

//routes

app.get('/', (req, res)=>{
    res.send('QMS backend is running!')
});



module.exports = app;