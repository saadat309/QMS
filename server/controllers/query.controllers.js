const pool = require("../db");

const GET_ALL_QUERIES = `
  SELECT q.*, a.name AS agent_name
  FROM queries q
  LEFT JOIN agents a ON q.agent_id = a.id
`;

const getQueries = async function(req, res){
    try {
    const result = await pool.query(GET_ALL_QUERIES);
    
     if (result.rows.length === 0) {
      return res.status(401).json({ error: "data is not present" });
    }

    return res.status(200).json({ queries: result.rows });

  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports={
    getQueries
}