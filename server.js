
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uid.js');
const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => 
res.sendFile(path.join(__dirname, '/public/index.html')));


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>{
res.status(200).json(notes); }
);


app.post('/api/notes', (req, res) => {
  console.info(`${req.method} to add a note.`);
  const { title, text } = req.body;
  if (title && text) {
    const newNotes = {
      title,
      text,
      id: uuid()
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNotes);
        
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
    
    notes.push(newNotes);
    res.status(201).json(notes);
    console.log(note);

   }
   else {
    res.status(500).json('Error in creating note');
  }
});

app.listen(PORT, () =>
  console.log(`serving all static files from public on port ${PORT}!`)
);



