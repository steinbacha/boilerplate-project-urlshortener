require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http')
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.urlencoded());

app.post('/api/shorturl', (req, res, next) => {
  if (dns.lookup(req.query.url, err)) {
    res.json({ original_url: req.body.url, short_url: 'test'});
  } else {
    res.json({ error: 'invalid url' })
  };
  next();
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
