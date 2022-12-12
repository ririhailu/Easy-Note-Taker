const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

const allNotes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, './public/index.html'));
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.json(allNotes);
        console.log("GET NOTES WORKING")
    })
});

function createNewNote(body, notesArray) {
    const newNote = body;
    body.id = notesArray.length + 1;
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, 2)
    );
    return newNote;
};

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];
        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray)
            );
            break;
        }
    }
};

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`API server now on port http://localhost:${PORT}`);
});