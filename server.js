const express = require('express');

const PORT = 3001;
const notesData = require('./db/notes.json');

const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')))

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req,res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request recieved to add a note`);
  
  let response;

  if (req.body && req.body.title && req.body.text) {
    response = {
      status: 'success',
      data: req.body
    };
    res.json(`Note has been added!`);
  } else {
    res.json('Note must contain title and text');
  }
  console.log(req.body);
});

app.listen(PORT, () =>
  console.log(`Note Taker App listening at http://localhost:${PORT}`)
);