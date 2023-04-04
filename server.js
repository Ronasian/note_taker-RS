const express = require('express');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
const PORT = 3001;

const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// home page get request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});
// notes page get request
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});
// notes api get request
app.get('/api/notes', (req,res) => {
  // reads file and returns data
  fs.readFile("./db/notes.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // parsed data
      let dataObj = JSON.parse(data);
      // response sends back parsed data
      res.json(dataObj);
    }
  })
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // create variable for the note object we will save
    const newNote = {
      title,
      text,
      id: uuid.v1(),
    };

    // Read file
    fs.readFile("./db/notes.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json('Error in posting note');
      } else {
        // parse all data from file and save it to a variable
        let notes = JSON.parse(data);
        // push new note data to notes data
        notes.push(newNote);
        // Write the new data to file
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
  // take id parameter from object
  const id = req.params.id;
  console.info(id);
  // read file and return data
  fs.readFile("./db/notes.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json('Error in deleting note');
    } else {
      // parse data
      let notes = JSON.parse(data);
      // loop over parsed data
      for (let i = 0; i < notes.length; i++) {
        // if the id variable matches the id at the current note
        if (id === notes[i].id) {
          // remove that note object from array
          notes.splice(i, 1);
          // write new data to file
          fs.writeFile("./db/notes.json", JSON.stringify(notes, null, '\t'), (err) =>
          err
            ? console.error(err)
            : console.log(
                "Note has been removed from notes.json file"
              )
          )
        }
      }
      // after note is deleted from database, refresh page
      res.redirect("/notes");
    }
  })
});

app.listen(PORT, () =>
  console.log(`Note Taker App listening at http://localhost:${PORT}`)
);