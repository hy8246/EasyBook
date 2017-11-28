var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
  Bookname: {type: String, required: true},
  ISBN: String,
  author: String,
  version:Number,
  PublishYear:Number
}, {collection: 'book'});

var UserData = mongoose.model('UserData', userDataSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  UserData.find()
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.post('/insert', function(req, res, next) {
  var item = {
    Bookname: req.body.Bookname,
    ISBN: req.body.ISBN,
    author: req.body.author,
    version: req.body.version,
    PublishYear: req.body.PublishYear
  };

  var data = new UserData(item);
  data.save();

  res.redirect('/');
});

router.post('/update', function(req, res, next) {
  var id = req.body.id;

  UserData.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.Bookname = req.body.Bookname;
    doc.ISBN = req.body.ISBN;
    doc.author = req.body.author;
    doc.version = req.body.version;
    doc.PublishYear = req.body.PublishYear;
    doc.save();
  })
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

module.exports = router;
