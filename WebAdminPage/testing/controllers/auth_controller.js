

var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../config')

function tokenForUser(user){
	return jwt.encode({
		sub:user._id
	}, config.secret);
}


exports.signup=function(req,res, next){
	var email = req.body.email;
	var password = req.body.password;
	
	if(!email || !password) {
		return res.status(422).send({error: "You must provide email and password."});
	}

	User.findOne({email:email}, function (err, existingUser){
		if(err) {return next(err)}
		if(existingUser){ return res.status(422).send({error:"Email is in use."})}

			var user = new User ({
				email:email,
				password : password
			});
	user.save(function(err) {
		if(err) {
			if(err.errors && err.errors.email) 
		{ return res.status(422).send({error:err.errors.email.message});
}
		return next(err);
		}
		res.json({token: tokenForUser(user), userId: user._id});
	
	});
})
}

exports.signin = function(req, res , next) {
	res.json({token: tokenForUser(req.user), userId: req.user._id});
}