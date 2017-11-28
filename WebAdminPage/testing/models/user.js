var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');

var validateEmail = email => (/\S+@\S+.\S+/).test(email);

var userSchema = new Schema({
	email:{
		type:String,
		unique:true,
		lowercase:true,
		required:'Email address is required',
		validate:[validateEmail, "Please enter a valid email"]
	},
	password:{type:String}
});

userSchema.pre('save', function(next){
	var user = this;
	bcrypt.genSalt(10, function(err,salt){
		if(err) {return next(err)}
			bcrypt.hash(user.password, salt, null, function(err, hash){
				if(err){return next(err)}
				user.password = hash;
				next();
			});
	});
});


userSchema.methods.comparePassword = function(candidatePassword, callback){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
	callback(null, isMatch);
	});
}








var ModelClass = mongoose.model('user',userSchema);

module.exports = ModelClass;