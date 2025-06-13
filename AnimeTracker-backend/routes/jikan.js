const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search', async (req, res) => {
  const { query, genres, status } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Missing search query' });
  }

  try {
    const response = await axios.get('https://api.jikan.moe/v4/manga', {
      params: {
        q: query,
        limit: 10,
        genres,   // Optional genre filters
        status    // Optional status filter (e.g., publishing, completed)
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch from Jikan API' });
  }
});

module.exports = router;
