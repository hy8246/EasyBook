var express =require('express');
var http = require('http');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var router = require('./router');
var morgan = require('morgan');

mongoose.connect('mongodb://localhost:27017/easybook')

var app= express();

app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function (req, res) {
  res.send('Server is up')
});

app.use('/andriod', router);
var serve = http.createServer(app);

app.get('/andriod', function (req, res) {
 	res.send('Andriod server is up')
});

app.use('/xcode', router);
var serve = http.createServer(app);

app.get('/xcode', function (req, res) {
 	res.send('IOS is up')
});

app.use('/nfc', router);
var serve = http.createServer(app);

app.get('/nfc', function (req, res) {
 	res.send('NFC is up')
});

app.use('/web', router);
var serve = http.createServer(app);

app.get('/web', function (req, res) {
 	res.send('Web is up')
});


app.set('port', process.env.PORT || 5001);

var server = app.listen(app.get('port'), function() {
       console.log('Our backend local Server ' + app.get('port')+' is up');
});
