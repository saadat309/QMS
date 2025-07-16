const express = require('express');
const app = express();
const path = require('path');
const adminRoutes = require('./routes/admins')
const agentRoutes = require('./routes/agents')
const queryRoutes = require('./routes/queries')

// Middleware

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use('/admins', adminRoutes);
app.use('/agents', agentRoutes);
app.use('/queries', queryRoutes);

//routes

app.get('/', (req, res)=>{
    res.send('QMS backend is running!')
});



module.exports = app;