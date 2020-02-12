var express = require("express");
var db = require("../db/loginDB");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json()
var passport   = require("../services/passport")
var signAuth   = require("../services/signAuth")
var ensureAuth   = require("../services/ensureAuth")
var urlencodedParser = bodyParser.urlencoded({extended : false})
var router = express.Router();

//페이지 경로
router.get("/", [signAuth], function(req, res){
	res.render("login/login.html")
})

router.get("/membership",[signAuth], function(req, res){
	res.render("login/termsofuse.html")
})
router.get("/signup", [signAuth],function(req, res){
	res.render("login/signup.html")
})
router.get("/success", [signAuth], function(req,res){
	res.render("login/success.html")
})


//데이터 요청
router.get("/req_layer",function(req, res){
	db.getAllLayer(function(result){
		res.send(result)
	})
})
router.get("/user_Info", function(req,res){
	db.alrequestapprovalInfo(function(result){
		res.send(result)
	})
})

router.post("/double_check",function(req, res){
	var user_id = req.body.user_id;
	db.doubleCheck(user_id, function(result){
		res.send(result)
	})
})
router.post("/signup", function(req, res){
	var user_id = req.body.user_id;
	var user_password = req.body.password;
	var user_password_check = req.body.password_check;
	var user_name = req.body.user_name;
	var user_sex = req.body.user_sex;
	var user_phone = req.body.user_phone;
	var user_position = req.body.user_position;
	var layer = req.body.layer;

	if(user_password == user_password_check){
		db.InsertUserInfo(user_id, user_password, user_name, user_sex, user_phone, user_position, layer, function(result){
			res.send(result);
		})	
	}else{
		res.send(false);
	}
	
})

router.post("/signin", [urlencodedParser,passport.authenticate('local', {failureRedirect: '/login'})], function(req, res){
	res.redirect('/monitoring');
})
router.post("/logout",[urlencodedParser], function(req, res){
	req.session.destroy(function(err){
		res.redirect("/login/")
	});
})

// 병진 작업
router.get("/init_approve",function(req,res){
	var user_id = req.query.user_id
	// console.log(user_id)
	db.initApproveInfo(user_id,function(result){
		// console.log(result)
		res.send(result)
	})
})
router.put("/updata_approve", [jsonParser], function(req,res){
	var user_id = req.body.user_id
	// console.log("user_id :" + user_id)
	db.updataApproveInfo(user_id,function(result){
		// console.log(result)
		res.send(result)
	})
	
})
router.delete("/delete_approve",function(req,res){
	var user_id = req.query.user_id
	// console.log(user_id)
	db.deleteApproveInfo(user_id,function(result){
		// console.log(result)
		res.send(result)
	})
})

module.exports = router;

