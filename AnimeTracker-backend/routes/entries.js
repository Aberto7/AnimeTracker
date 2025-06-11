const Entry = require('../models/Entry'); // ✅ Don't forget this import
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');


const {
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry
} = require('../controllers/entriesController');

// ✅ Bookmark a Jikan manga
router.post('/bookmark', authenticateToken, async (req, res) => {
  const { mal_id, title, image_url, synopsis, total_chapters } = req.body;
  const userId = req.user.id;

  if (!mal_id || !title) {
    return res.status(400).json({ message: 'Missing required manga info' });
  }

  try {
    const existing = await Entry.findOne({ user: userId, mal_id });
    if (existing) {
      return res.status(409).json({ message: 'Already bookmarked' });
    }

    const newEntry = new Entry({
      user: userId,
      mal_id,
      title,
      image_url,
      description: synopsis,
      total_chapters,
      chapters_read: 0
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to bookmark manga' });
  }
});

// ✅ Protect all other /entries routes
router.use(authenticateToken);

// Main CRUD
router.get('/', getEntries);
router.post('/', addEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;
