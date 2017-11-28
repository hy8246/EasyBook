var mongoose = require('mongoose');

var recordSchema = new mongoose.Schema({
	bookname: {type: String},
	serial: {type: String},
	email: {type: String},
	date: {type: Date}
});

var Record = mongoose.model('rentrecords', recordSchema);

module.exports = Record;