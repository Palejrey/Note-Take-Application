
const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path');

app.get('/', (req, res) => res.send('Static assets!'));

// Serve the home page
app.get('/home', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Serve the cat image
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () =>
  console.log(`serving all static files from public on port ${PORT}!`)
);



