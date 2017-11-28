var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var validateEmail = email => (/\S+@\S+.\S+/).test(email);

var UserSchema = new Schema({
	email:{
		type:String,
		unique:true,
		lowercase:true,
		required:'Email address is required',
		validate:[validateEmail, "Please enter a valid email"]
	},
	password:{type:String}
});

var ModelClass = mongoose.model('User',userSchema);

module.exports = ModelClass;