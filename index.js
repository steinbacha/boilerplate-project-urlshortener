require('dotenv').config();
require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http')
const dns = require('dns');
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl/new', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.urlencoded());

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
