require('dotenv').config();
require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http')
const dns = require('dns');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
const { url } = require('inspector');
//const bodyParser = require('body-parser');

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

app.use(express.urlencoded({extended: false}));

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  original: {type: String, required: true},
  short: Number
});

let Url = mongoose.model('Url', urlSchema)
let responseObject = {};
app.post('/api/shorturl', express.urlencoded({extended: false}) , (request, response) => {
  let inputUrl = request.body['url'];

  let urlRegex = new RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i)

  if(!inputUrl.match(urlRegex)){
    response.json({error: 'Invalid URL'})
    return
  }

  responseObject['original_url'] = inputUrl;

  let inputShort = 1;

  Url.findOne({})
    .sort({short: 'desc'})
    .exec((error, result) => {
      if(!error && result != undefined){
        inputShort = result.short + 1
      }
      if(!error){
        Url.findOneAndUpdate(
          {original: inputUrl},
          {original: inputUrl, short: inputShort},
          {new: true, upsert: true },
          (error, savedUrl) => {
            if(!error){
              responseObject['short_url'] = savedUrl.short
              response.json(responseObject)
            }
          }
        )
      }
    })
})

app.get('/api/shorturl/:input', (request, response) => {
  let input = request.params.input;
  Url.findOne({short: input}, (error, result) => {
    if(!error && result != undefined) {
      response.redirect(result.original)
    }else {
      response.json('URL not found')
    }
  })
})