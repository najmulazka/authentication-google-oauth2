require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const { PORT = 3000 } = process.env;
const router = require('./routes/index.routes');
const path = require('path');

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api/v1', router);

app.listen(PORT, () => console.log('Listening on port', PORT));
