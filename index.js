// dependencies

const _ = require('underscore');
const csv = require('fast-csv');
const fs = require('fs');

const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.load({ path: '.env' });
const path = process.env.CSVPATH + (/\/$/.test(process.env.CSVPATH) ? '' : '/');

// disk operations

var cache = [];

function writeCacheToFile() {
  var filename = `${path}${process.env.FILEPREFIX}_${(new Date()).toJSON()}.csv`;
  console.log('Writing to ' + `${process.env.FILEPREFIX}_${(new Date()).toJSON()}.csv`);

  var csvStream = csv.format({ headers: true, delimiter: ';' })
  var writableStream = fs.createWriteStream(filename);

  writableStream.on('finish', function () {
    cache = []; // reset
    setTimeout(writeCacheToFile, 30000); // recursion
    console.log('All written to ' + filename);
  });

  csvStream.pipe(writableStream);
  cache.forEach(c => csvStream.write(c));
  csvStream.end();

}

writeCacheToFile();

// web server to receive webhooks

var app = express();
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/ping', (req, res) => res.status(200).send('pong'));

app.post('/webhook', function (req, res) {
  
  var payload = req.body;
  console.log('Received: ' + JSON.stringify(payload));
  cache.push(payload);

  res.status(202).send('ack');

});

app.listen(process.env.HTTPPORT);