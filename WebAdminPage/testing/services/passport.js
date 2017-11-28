var passport = require('passport');

var User = require('../models/user');
var LocalStrategy = require('passport-local');

var loginOptions = {
	usernameField:'email'

}

var localLogin = new LocalStrategy(loginOptions, function(email, password, done){
	User.findOne({email:email}, function(err, user) {
		if(err){return done(err)}
			if(!user){return done(null, false)}
				user.comparePassword(password, function(err, isMatch){
					if(err){return done(err)}
					if(!isMatch){return done(null,false)}
						return done(null,user);
				});
	})
});

passport.use(localLogin);