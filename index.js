// dependencies

const _ = require('underscore');
const csv = require('fast-csv');
const fs = require('fs');

const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.load({ path: '.env' });

const _TOKEN = process.env.TOKEN;

// disk operations

var cache = {};

function writeCacheToFile() {

  _.keys(cache).forEach(function (folder) {
    console.log(`Cache ${folder} w/ ${cache[folder].data.length} entries`);

    if (cache[folder].data.length > 0) {

      var filename = `${folder}${cache[folder].opts.prefix}_${(new Date()).getTime()}.csv`;
      if (!fs.existsSync(folder)) fs.mkdirSync(folder);

      var csvStream = csv.format(cache[folder].opts);
      var writableStream = fs.createWriteStream(filename);

      writableStream.on('finish', function () {
        delete cache[folder];
      });

      csvStream.pipe(writableStream);
      cache[folder].data.forEach(c => csvStream.write(c));
      csvStream.end();

    }

  });

  setTimeout(writeCacheToFile, 1000); // recursion

}

writeCacheToFile();

// web server to receive webhooks

var app = express();
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/ping', (req, res) => res.status(200).send('pong'));

app.post('/webhook', function (req, res) {

  if (req.query.token !== _TOKEN) return res.status(401).send('no');

  var folder = req.query.id ? req.query.id : 'default';
  if (!/^\//.test(folder)) folder = '/' + folder;
  if (!/\/$/.test(folder)) folder = folder + '/';
  folder = '.' + folder;

  var headers = req.query.headers && req.query.headers === 'true';
  var delimiter = req.query.delimiter || ';';
  var prefix = req.query.prefix || 'hook';
  var quote = req.query.quote || '"';

  var payload = req.body;

  if (_.has(cache, folder)) cache[folder].data.push(payload);
  else cache[folder] = { opts: { folder, headers, delimiter, prefix, quote }, data: [payload] };

  res.status(202).send('ack');

});

app.listen(process.env.HTTPPORT);