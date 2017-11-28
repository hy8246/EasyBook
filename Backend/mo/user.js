var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	email:{type:String, unique:true},
	password: {type: String},
	firstname: {type: String},
	lastname: {type: String},
	iid: {type: String},
	gender: {type: String},
	phone: {type: String}
});

var User = mongoose.model('userinfos', userSchema);

module.exports = User;