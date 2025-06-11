const pool = require('../config/db');

exports.getEntries = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM manga_entries WHERE user_id = $1 ORDER BY bookmarked_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entries' });
  }
};

exports.addEntry = async (req, res) => {
  const { title, description, chapters, status, last_read_chapter } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO manga_entries 
       (user_id, title, description, chapters, status, last_read_chapter) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [req.user.userId, title, description, chapters, status, last_read_chapter]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add entry' });
  }
};

exports.updateEntry = async (req, res) => {
  const { title, description, chapters, status, last_read_chapter } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE manga_entries 
       SET title=$1, description=$2, chapters=$3, status=$4, last_read_chapter=$5 
       WHERE id=$6 AND user_id=$7 
       RETURNING *`,
      [title, description, chapters, status, last_read_chapter, id, req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update entry' });
  }
};

exports.deleteEntry = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM manga_entries WHERE id=$1 AND user_id=$2', [id, req.user.userId]);
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete entry' });
  }
};
