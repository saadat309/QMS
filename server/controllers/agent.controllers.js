const pool = require("../db");

// SQL query
const FIND_AGENTS_BY_ADMIN_ID = "SELECT * FROM agents WHERE admin_id = $1";
const ADD_AGENT = "INSERT INTO agents (name, admin_id) VALUES ($1, $2) RETURNING *";

const getAgents = async function (req, res) {
  const { admin_id } = req.body;

  try {
    const result = await pool.query(FIND_AGENTS_BY_ADMIN_ID, [admin_id]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid admin ID" });
    }

    const agents = result.rows.map((agent) => ({
      id: agent.id,
      name: agent.name,
      added: agent.created_at,
    }));

    return res.status(200).json({ agents });
  } catch (error) {
    console.error("server error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const addAgent = async function (req, res) {
  const { name, admin_id } = req.body;

  if (!admin_id || !name) {
    return res.status(400).json({ error: "admin_id and name are required" });
  }

  try {
    const result = await pool.query(ADD_AGENT, [name, admin_id]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid admin ID" });
    }

    const addedAgent = result.rows[0];

    return res.status(200).json({ success: "Successfully added", agent: addedAgent });

  } catch (error) {
    console.error("server error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAgents, addAgent };
