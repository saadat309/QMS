require('dotenv').config();
const app = require('./app');
const pool = require('./db');


const PORT = process.env.PORT || 5000;


// ✅ Server listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});