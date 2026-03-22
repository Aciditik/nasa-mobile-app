const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  try {
    const favorites = db.prepare(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.userId);

    const formattedFavorites = favorites.map(fav => ({
      id: fav.id.toString(),
      date: fav.apod_date,
      title: fav.title,
      explanation: fav.explanation,
      url: fav.url,
      media_type: fav.media_type,
      hdurl: fav.hdurl,
      copyright: fav.copyright,
      isFavorite: true
    }));

    res.json(formattedFavorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.post('/', (req, res) => {
  try {
    const { date, title, explanation, url, media_type, hdurl, copyright } = req.body;

    if (!date || !title || !url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = db.prepare(
      'SELECT id FROM favorites WHERE user_id = ? AND apod_date = ?'
    ).get(req.userId, date);

    if (existing) {
      return res.status(400).json({ error: 'Already in favorites' });
    }

    const result = db.prepare(
      `INSERT INTO favorites (user_id, apod_date, title, explanation, url, media_type, hdurl, copyright)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(req.userId, date, title, explanation, url, media_type, hdurl, copyright);

    res.status(201).json({
      id: result.lastInsertRowid.toString(),
      date,
      title,
      explanation,
      url,
      media_type,
      hdurl,
      copyright,
      isFavorite: true
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

router.delete('/:date', (req, res) => {
  try {
    const { date } = req.params;

    const result = db.prepare(
      'DELETE FROM favorites WHERE user_id = ? AND apod_date = ?'
    ).run(req.userId, date);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
});

router.get('/check/:date', (req, res) => {
  try {
    const { date } = req.params;
    
    const favorite = db.prepare(
      'SELECT id FROM favorites WHERE user_id = ? AND apod_date = ?'
    ).get(req.userId, date);

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ error: 'Failed to check favorite' });
  }
});

module.exports = router;
