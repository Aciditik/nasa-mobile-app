require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');
const notesRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'NASA Explorer API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      favorites: '/api/favorites',
      notes: '/api/notes'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/notes', notesRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 NASA Explorer API running on http://localhost:${PORT}`);
  console.log(`📚 Endpoints available:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/logout`);
  console.log(`   - GET  /api/favorites`);
  console.log(`   - POST /api/favorites`);
  console.log(`   - DELETE /api/favorites/:date`);
  console.log(`   - GET  /api/notes`);
  console.log(`   - POST /api/notes`);
  console.log(`   - PUT  /api/notes/:id`);
  console.log(`   - DELETE /api/notes/:id`);
});
