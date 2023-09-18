const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = 'postgres://username:password@localhost:5432/database_name'; // Replace with your actual database URL

const pool = new Pool({
  connectionString: databaseUrl,
});

// Fetch data from the API and store it in the database
const fetchDataAndStore = async () => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = Object.values(response.data);

    // Store the top 10 tickers in the database
    const top10Tickers = tickers.slice(0, 10);

    await pool.query('CREATE TABLE IF NOT EXISTS tickers (name TEXT, last NUMERIC, buy NUMERIC, sell NUMERIC, volume NUMERIC, base_unit TEXT)');

    for (const ticker of top10Tickers) {
      const { symbol, last, buy, sell, volume, baseAsset } = ticker;
      await pool.query('INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)', [symbol, last, buy, sell, volume, baseAsset]);
    }

    console.log('Data fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching and storing data:', error);
  }
};

fetchDataAndStore();

// Create a route to get the stored data from the database
app.get('/api/tickers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickers');
    const tickers = result.rows;
    res.json(tickers);
  } catch (error) {
    console.error('Error getting data from the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
