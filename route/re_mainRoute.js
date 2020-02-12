var express = require("express");
var db = require("../db/re_mainDB");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json()
// var ensureAuth   = require("../services/ensureAuth")
// var soscketHandler = require("../services/socketHandler");
// var MQTTService = require("../services/MQTTService")
var urlencodedParser = bodyParser.urlencoded({extended : false})
var router = express.Router();
// var async = require("async");

//웹페이지 경로
// [ensureAuth], 
router.get("/", function(req, res, next) {
	try {
		// var user_id = req.session.passport.user.user_id
		// var auth    = req.session.passport.user.auth
		res.render("re_main/index.html")
		// ,{"auth":auth, "user_id":user_id}
	} catch(e) {
		next(e);
	}

})
router.get("/layer", function(req, res, next){
	try{
		db.getLayer(function(result){
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})

router.get("/map_img", function(req, res, next){
	var layer = req.query.layer;

	try{
		db.getMapImg(layer, function(result){
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})

router.get("/nowearpatientinfo", function(req, res, next){
	var layer = req.query.layer;
	try{
		db.getNoWearPatientInfo(layer, function(result){
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})


router.post("/modipatient", function(req, res, next){
	var seq = req.body.seq;
	var name = req.body.name;
	var age = req.body.age;
	var gender = req.body.gender;
	var patient_number = req.body.patient_number;
	var phone_number = req.body.phone_number;
	var ward = req.body.ward;
	var etc = req.body.etc;
	var patient_layer = req.body.patient_layer;

	try{
		db.modiPatient(seq, name, age, gender, patient_number, phone_number, ward, etc, patient_layer, function(result){
			res.send(result);
		})
	}catch(e){
		next(e)
	}
})
router.post("/regipatient", function(req, res, next){
	var name = req.body.name
	var age = req.body.age
	var gender = req.body.gender
	var patient_number = req.body.patient_number
	var phone_number = req.body.phone_number
	var ward = req.body.ward
	var etc = req.body.etc
	var patient_layer = req.body.patient_layer

	try{
		db.regiPatient(name, age, gender, patient_number, phone_number, ward, etc, patient_layer, function(result){
			res.send(result);
		})
	}catch(e){
		next(e)
	}
})
router.get("/wearpatientinfo", function(req, res, next){
	var layer = req.query.layer;
	try{
		db.getWearPatientInfo(layer, function(result){
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})
router.get("/availablewelltag", function(req, res, next){
	try{
		db.availableWelltag(function(result){
			res.send(result)
		})
	} catch(e){
		next(e)
	}
})

router.get("/welltaginfo", function(req, res, next){
	try{
		db.getWelltagInfo(function(result){
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})
// //환자 정보 수정
// router.get("/welltag")

router.post("/regiwearinfo", function(req, res, next){
// data = {"no":no, "select_welltag_seq" : select_welltag_seq};
	var no = req.body.no;
	var seq = req.body.select_welltag_seq

	try{
		db.regiWearInfo(no, seq, function(result){
			res.send(result);			
		})
	} catch(e){
		next(e)
	}

})

router.post("/modiwearinfo", function(req, res, next){
	var no = req.body.no;
	var use_welltag = req.body.use_welltag;
	var seq = req.body.select_welltag_seq;

	try{
		db.modiWearInfo(no, use_welltag, seq, function(result){
			res.send(result);			
		})
	} catch(e){
		next(e)
	}

})

router.post("/delwearinfo", function(req, res, next){
	var no = req.body.no;
	var use_welltag = req.body.use_welltag;

	try{
		db.delWearInfo(no, use_welltag, function(result){
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})

router.get("/delpatient", function(req, res, next){
	var seq = req.query.seq;
	console.log(seq)
	try{
		db.delPatient(seq, function(result){
			res.send(result);
		})
	} catch (e){
		next(e)
	}
})
module.exports = router;
