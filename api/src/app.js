const express = require('express');
const cors = require('cors');

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

app.get('/files/data', (request, response) => {
    response.status(200).json([])
});

app.use((request, response) => {
    response.status(404).json({
        error: 'Not found'
    });
});


module.exports = app;
