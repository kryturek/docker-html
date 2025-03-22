// server.js
const express = require('express');
const app = express();

const { Client } = require('pg');
require('dotenv').config();

async function connectToPostgres(retries = 5) {
  for (let i = 0; i < retries; i++) {
    const client = new Client();
    try {
      await client.connect();
      console.log("✅ Connected to PostgreSQL");
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

app.get('/api', (req, res) => {
  res.json({ message: "Hello from the backend ⭐️" })
});


const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
