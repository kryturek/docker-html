// server.js
const express = require('express');
const app = express();

const { Client } = require('pg');
require('dotenv').config();

let client;

async function connectToPostgres(retries = 5) {
  for (let i = 0; i < retries; i++) {
    const newClient = new Client();
    try {
      await newClient.connect();
      console.log("✅ Connected to PostgreSQL");

      client = newClient;

      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL
        )
      `);

      const result = await client.query(`SELECT COUNT(*) FROM messages`);
			if (parseInt(result.rows[0].count) === 0) {
				await client.query(`INSERT INTO messages (content) VALUES ($1)`, ['Hello from the database 🐘']);
			}
      return;
    } catch (err) {
      console.log(`❌ PostgreSQL connection error: ${err.message}`);
      console.log(`🔁 Retrying in 2s... (${i + 1}/${retries})`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }

  console.error("💥 Failed to connect to PostgreSQL after retries.");
  process.exit(1);
}

connectToPostgres();

app.get('/api', async (req, res) => {
  try {
		const result = await client.query(`SELECT * FROM messages`);
		res.json({message: result.rows[0].content});
	} catch (err) {
		console.error('API Error: ', err.message);
		res.status(500).json({error: 'Failed to fetch from DB'});
	}
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
