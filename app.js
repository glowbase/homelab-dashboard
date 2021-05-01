const express = require('express');

const app = express();
const port = 8000;
const path = __dirname + '/public';

app.use('/', express.static(path));

app.get('/', (req, res) => {
    res.status(200).sendFile(path + '/views/dashboard.html');
});

app.get('/**', (req, res) => {
    res.status(200).sendFile(path + '/views/404.html');
});

app.listen(port, () => {
    console.clear();
    console.info(`Listening on port ${port}`);
});