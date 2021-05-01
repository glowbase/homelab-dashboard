const express = require('express');
const db = require('node-localdb');

const applications = db('/db/applications.json');
const bookmarks = db('/db/bookmarks.json');

const app = express();
const port = 8000;
const path = __dirname + '/public';

app.use('/', express.static(path));

app.get('/', (req, res) => {
    res.status(200).sendFile(path + '/views/dashboard.html');
});

app.get('/add', (req, res) => {
    res.status(200).sendFile(path + '/views/dashboard.html');
});

app.get('/api/applications', (req, res) => {
    

    console.log();
    res.status(200);
});

app.get('/**', (req, res) => {
    res.status(200).sendFile(path + '/views/404.html');
});

app.listen(port, () => {
    console.clear();
    console.info(`Listening on port ${port}`);
});