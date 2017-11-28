
var User = require('../mo/user');
var jwt = require('jwt-simple');
var config = require('../config')
var Userinfo =require('../mo/user')
var express =require('express');
var router = express.Router();
/*
function tokenForUser(userinfo){
	return jwt.encode({
		sub:userinfo._id
	}, config.secret);
}
*/


var signups = function()
{
	router.get('./signup',function(req,res)
	{
		var email = req.query.email;
		var password = req.query.password;
		var FName = req.query.FirstName;
		var LName = req.query.LastName;
		var Gender = req.query.Gender;
		var IID = req.query.IID;
		var Phone = req.query.Phone;
		console.log(""+email+""+phone+"");
		
		Userinfo.findOne({email:email}, function (err, existingUser){
			if(err) {return next(err)}
			if(existingUser)
			{ 
				res.json('1')
			}
			if(!existingUser)
			{
				/*
				var userinfo = new Userinfo
				 ({
					email:email,
					password : password,
					firstname : FName,
					lastname : LName,
					gender : Gender,
					iid :IID,
					phone :Phone
				});
				*/
					//Userinfo.insert({email:email},{password:password},{firstname:FName},{lastname:LName},{gender:Gender},{iid:IID},{phone:Phone},function(err,records){
					//});
					res.json('0')
				}
					
				});
	
	});
}
module.exports=signups;
