const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  try {
    const { apod_date } = req.query;
    
    let query = 'SELECT * FROM notes WHERE user_id = ?';
    let params = [req.userId];
    
    if (apod_date) {
      query += ' AND apod_date = ?';
      params.push(apod_date);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const notes = db.prepare(query).all(...params);

    const formattedNotes = notes.map(note => ({
      id: note.id.toString(),
      apodDate: note.apod_date,
      content: note.content,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    }));

    res.json(formattedNotes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.post('/', (req, res) => {
  try {
    const { apodDate, content } = req.body;

    if (!apodDate || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = db.prepare(
      'INSERT INTO notes (user_id, apod_date, content) VALUES (?, ?, ?)'
    ).run(req.userId, apodDate, content);

    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      id: note.id.toString(),
      apodDate: note.apod_date,
      content: note.content,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const existing = db.prepare(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?'
    ).get(id, req.userId);

    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    db.prepare(
      'UPDATE notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(content, id);

    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);

    res.json({
      id: note.id.toString(),
      apodDate: note.apod_date,
      content: note.content,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const result = db.prepare(
      'DELETE FROM notes WHERE id = ? AND user_id = ?'
    ).run(id, req.userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
