var express = require("express");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended : false})
var ensureAuth   = require("../services/ensureAuth")
var router = express.Router();

//페이지 경로
router.get("/mypagemenu", [ensureAuth], function(req, res){
	// var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("mypage/reconfirm.html",{"auth":auth})
})
router.get("/mypageprivacy",  [ensureAuth], function(req, res){
	// var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("mypage/mypageprivacy.html",{"auth":auth})
})
router.get("/changepassword",  [ensureAuth], function(req, res){
	// var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("mypage/changepassword.html",{"auth":auth})
})
router.get("/",  [ensureAuth], function(req, res){
	// var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("mypage/mypage_menu.html",{"auth":auth})
})
router.get("/withdrawal",  [ensureAuth], function(req, res){
	// var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("mypage/withdrawal.html",{"auth":auth})
})

//데이터 요청

module.exports = router;

