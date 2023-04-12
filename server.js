
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uid.js');
const notes = require('./db/db.json');

const PORT = 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => 
res.sendFile(path.join(__dirname, '/public/index.html')));

// Serve the home page
app.get('/home', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>{
res.status(200).json(notes); }
);

// POST request to add a review
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} to add a note.`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNotes = {
      title,
      text,
      id: uuid()
    };

    // Obtain existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new review
        parsedNotes.push(newNotes);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated reviews!')
        );
      }
    });

    const note = {
      status: 'success',
      body: newNotes,
    };

    console.log(note);
    res.status(201).json(note);
  } else {
    res.status(500).json('Error in creating note');
  }
});

app.listen(PORT, () =>
  console.log(`serving all static files from public on port ${PORT}!`)
);



