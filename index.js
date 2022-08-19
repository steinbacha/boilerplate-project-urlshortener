require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http')
const dns = require('dns');
const mongoose = require('mongodb');
const bodyParser = require('body-parser');

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

/*
app.post('/api/shorturl', (req, res, next) => {
  const URL = require("url").URL;
  const stringIsAValidUrl = (s) => {
    try {
      new URL(s);
      res.json({ original_url: req.body.url, short_url: 'test'}); 
    } catch (err) {
      res.json({ error: 'invalid url' })
    }
  };
  stringIsAValidUrl(req.body.url);
  next();
});
*/

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

let uri = 'mongodb+srv://asteinbach:' + process.env.PW + '@cluster0.wehkf.mongodb.net/fcc_projects?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let urlSchema = new mongoose.Schema({
  original_url : {type: String, required: true},
  short_url: Number
});

let Url = mongoose.model('Url', urlSchema);
let responseObject = {};
app.post('api/shorturl/new', bodyParser.urlencoded({ extended: false }) , (req, res) => {
  res.json(responseObject)
});