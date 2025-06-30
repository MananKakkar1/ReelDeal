const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Proxy endpoint for TMDB API
app.get('/api/tmdb/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const params = req.query;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/${endpoint}`, {
      params: { ...params, api_key: TMDB_API_KEY },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Custom recommendation endpoint (simple random from popular movies)
app.post('/api/recommend', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY },
    });
    const movies = response.data.results;
    const movie = movies[Math.floor(Math.random() * movies.length)];
    res.json({ movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 