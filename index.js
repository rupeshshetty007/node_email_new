const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));

const convertions = require('./routes/convertion');

app.use('/send_data', convertions);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
