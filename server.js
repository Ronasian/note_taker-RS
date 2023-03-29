const express = require('express');

const app = express();
const PORT = 3001;
const path = require('path');
const notesData = require('./db/notes.json');

app.use(express.static('public'));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => res.json(notesData));

app.listen(PORT, () =>
  console.log(`Note Taker App listening at http://localhost:${PORT}`)
);