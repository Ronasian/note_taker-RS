const express = require('express');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
const PORT = 3001;

const notesData = require('./db/notes.json');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/api/notes', (req,res) => {
  // res.json(notesData)
  fs.readFile("./db/notes.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let dataObj = JSON.parse(data);
      res.json(dataObj);
    }
  })
});

app.post('/api/notes', (req, res) => {
// Log that a POST request was received
  console.info(`${req.method} request received to add a note`);
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid.v1(),
    };

    // Convert the data to a string so we can save it
    fs.readFile("./db/notes.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json('Error in posting note');
      } else {
        let notes = JSON.parse(data);
        notes.push(newNote);
        // Write the data to file
        fs.writeFile("./db/notes.json", JSON.stringify(notes, null, '\t'), (err) =>
      err
        ? console.error(err)
        : console.log(
            "Note has been written to notes.json file"
          )
        );
      }
    });
    
    const response = {
      status: 'success',
      body: newNote,
    };
    
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`);
  const id = req.params.id;
  console.info(id);
  fs.readFile("./db/notes.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json('Error in deleting note');
    } else {
      let notes = JSON.parse(data);
      for (let i = 0; i < notes.length; i++) {
        if (id === notes[i].id) {
          notes.splice(i, 1);
          fs.writeFile("./db/notes.json", JSON.stringify(notes, null, '\t'), (err) =>
          err
            ? console.error(err)
            : console.log(
                "Note has been removed from notes.json file"
              )
          )
        }
      }
      res.redirect("/notes");
    }
  })
});

app.listen(PORT, () =>
  console.log(`Note Taker App listening at http://localhost:${PORT}`)
);