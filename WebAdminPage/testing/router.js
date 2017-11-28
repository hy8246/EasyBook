var express =require('express');
var passport =require('passport');

var AuthController = require('./controllers/auth_controller');
var passportService = require('./services/passport');

var requireSignin = passport.authenticate('local',{session:false});


var router = express.Router();

router.route('/signup')
.post(AuthController.signup);

/*
router.route('/signin')
.post([requireSignin, AuthController.signin]);
*/

module.exports=router;