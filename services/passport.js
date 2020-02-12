var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy;
var db = require("../db/loginDB")

passport.use(new LocalStrategy({
	usernameField : "userId",
	paswordField : "password",
	passReqToCallback: true
	}
	, function(req, userId, password, done){
		if(userId == undefined || userId == "" || password == undefined || password == ""){
			return done(null, false, {message : '아이디 혹은 비밀번호를 입렵하지 않았습니다.'});
		}
	
		db.signinAdmin(userId, password, function(result, auth, approve_state){
			if(result){
				if(approve_state){
					user = {"user_id": userId, "auth": auth}
					return done(null, user);
				}else{
					return done(null, false, {message:"승인 대기 중입니다."})
				}	
			}else{
				return done(null, false, {message:"잘못된 아이디 또는 패스워드 입니다."})
			}
		})
	}
))
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user_id, done) {
	done(null, user);
})

module.exports = passport