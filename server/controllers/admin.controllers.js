const pool = require('../db');

// 1. SQL query stored in a named constant
const FIND_ADMIN_BY_EMAIL = 'SELECT * FROM admins WHERE email = $1';

const loginAdmin = async (req, res) => {
    const {email, password} = req.body;

    try {
        const queryParams = [email];
        const result = await pool.query(FIND_ADMIN_BY_EMAIL, queryParams);
        const adminFound = result.rows.length > 0;
        if (!adminFound) {
            return res.status(401).json({error: "Invalid credentials"})
        }

        const admin = result.rows[0];

        const passwordMatches = password === admin.password;

        if (!passwordMatches) {
            return res.status(401).json({error: "Invalid Credentials"})
        }

        const responseData = {
            id: admin.id,
            email: admin.email
        }

        return res.json({message: "login Successful", admin: responseData})

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    loginAdmin
};