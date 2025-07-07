require('dotenv').config();
const app = require('./app');
const pool = require('./db');


const PORT = process.env.PORT || 5000;

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Database error');
    }
    
});


// ✅ Server listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});