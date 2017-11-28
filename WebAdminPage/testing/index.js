var express =require('express');
var http = require('http');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var router = require('./router');
var morgan = require('morgan');

mongoose.connect('mongodb://localhost:27017/testing')

var app= express();

app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use('/v1', router);
var server= http.createServer(app);

app.get('/', function (req, res) {
  res.send('Server is up')
})

app.set('port', process.env.PORT || 5001);
var server = app.listen(app.get('port'), function() {
       console.log('Server up: http://localhost:' + app.get('port'));
});