var express = require("express");
var db = require("../db/re_systemDB");
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
		res.render("re_system/index.html")
		// ,{"auth":auth, "user_id":user_id}
	} catch(e) {
		next(e);
	}
})
router.get("/layer", function(req, res, next) {
	try {
		db.layerinfo(function(result){
			res.send(result);
		})
	} catch(e) {
		next(e);
	}
})
router.get("/req_map", function(req, res, next) {
	try {
		var layer = req.query.layer
		db.getMap(layer, function(result){
			res.send(result);
		})
	} catch(e) {
		next(e);
	}
})
router.get("/welltaginfo", function(req, res, next) {
	try {
		var layer = req.query.layer;

		db.welltaginfo(layer, function(result){
			res.send(result);
		})
	} catch(e) {
		next(e);
	}
})
router.get("/gatewayinfo", function(req, res, next) {
	try {
		
		db.gatewayinfo(function(result){
			res.send(result);
		})
	} catch(e) {
		next(e);
	}
})
router.get("/beaconInfo", function(req, res, next) {
	try {
		var layer = req.query.layer;

		db.beaconInfo(layer, function(result){
			res.send(result);
		})
	} catch(e) {
		next(e);
	}
})
router.get("/membershipInfo", function(req, res, next) {
	try {
		var layer = req.query.layer
		db.membershipInfo(layer, function(result){
			console.log(result)
			res.send(result);
		})
	} catch(e) {
		next(e);
	}
})
router.get("/permissionInfo", function(req, res, next) {
	try {
		var layer = req.query.layer
		db.permissionInfo(layer, function(result){
			console.log(result)
			res.send(result);
		})
	} catch(e) {
		next(e);
	}
})
router.get("/location_beacon_info", function(req, res, next){
	try{
		var layer = req.query.layer;
		db.getLocationBeaconInfo(layer, function(result){
			// console.log(result)
			res.send(result);
		})
	}catch(e){
		next(e)
	}
})
router.get("/indi_beacon_info", function(req, res, next){
	try{
		var beacon_seq = req.query.beacon_seq;
		db.getIndiBeaconInfo(beacon_seq, function(result){
			// console.log(result)
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})
router.post("/save_information", function(req, res, next){
	try{
		var select_choice = req.body.select_choice;
		var id = req.body.id;
		var name = req.body.name;
		var layer = req.body.layer;
		console.log(select_choice)
		db.save_information(select_choice, id, name, layer, function(result){
			// console.log(result)
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})
router.delete("/delete_information", function(req, res, next){
	try{
		var select_choice = req.body.select_choice
		var id = req.body.id;
		db.delete_information(select_choice, id, function(result){
			// console.log(result)
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})
router.put("/update_beacon", [jsonParser], function(req, res, next){
	try{
		var type = 1
		var beacon_seq = req.body.beacon_seq;
		var beacon_id = req.body.beacon_id;
		var layer = req.body.layer;
		var loc_x = req.body.loc_x;
		var loc_y = req.body.loc_y;
		// console.log(req.body)
		db.updateBeacon(beacon_seq, layer, loc_x, loc_y, function(result){
			// console.log(result)
			if(result){
				res.send(result);
				// rabbitmqClient.send_beaconInfo(type, beacon_id, loc_x, loc_y, layer)	
			}else{
				res.send(result);
			}
		})
	} catch(e){
		next(e)
	}
})
module.exports = router;
