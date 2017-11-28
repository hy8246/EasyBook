var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
	serial:{type:String, unique:true},
	bookname: {type: String},
	isbn: {type: String},
	author: {type: String},
	publishdate: {type: String},
	status:{type:Boolean}
});

var Bookinfo = mongoose.model('bookinfos', bookSchema);

module.exports = Bookinfo; 