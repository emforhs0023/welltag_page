var express = require("express");
var db = require("../db/systemDB");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json()
var ensureAuth   = require("../services/ensureAuth")
var rabbitmqClient = require("../services/rabbitmqClient")
var urlencodedParser = bodyParser.urlencoded({extended : false})
var router = express.Router();


//페이지 경로
router.get("/", [ensureAuth], function(req, res){
	var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("system/welltag_setting.html",{"auth":auth})
})

router.get("/welltag_setting", [ensureAuth], function(req, res){
	var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("system/welltag_setting.html",{"auth":auth})
})

router.get("/sensortag_setting", [ensureAuth], function(req, res){
	var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("system/sensortag_setting.html",{"auth":auth})
})

router.get("/gateway_setting", [ensureAuth], function(req, res){
	var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("system/gateway_setting.html",{"auth":auth})
})

router.get("/beacon_setting", [ensureAuth], function(req, res){
	var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("system/beacon_setting.html",{"auth":auth})
})
router.get("/requestapproval", [ensureAuth], function(req, res){
	var user_id = req.session.passport.user.user_id
	var auth    = req.session.passport.user.auth
	res.render("system/requestapproval.html",{"auth":auth})
})

//데이터 요청
//1. 웰태그 정보 요청(welltag_seq, welltag_id, Mac_address)
router.get("/all_welltag_info", function(req, res, next){
	try{
		db.getAllWelltagInfo(function(result){
			// console.log(result)
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})
//2. 개별 웰태그 정보 요청
router.get("/indi_welltag_info", function(req, res, next){
	try{
		var welltag_seq = req.query.welltag_seq
		db.getIndiWelltagInfo(welltag_seq, function(result){
			// console.log(result)
			res.send(result);
		})
	} catch (e){
		next(e)
	}
})
//3. 웰태그 추가 요청
router.post("/add_welltag", [jsonParser], function(req, res, next){
	try{
		var welltag_id = req.body.id;
		var welltag_mac = req.body.mac;
		db.addWelltag(welltag_id, welltag_mac, function(result){
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})
//4. 웰태그 업데이트 요청
router.put("/update_welltag", [jsonParser], function(req, res, next){
	try {

		var seq = req.body.seq;
		var id = req.body.id;
		var mac = req.body.mac;
		
		db.updateWelltag(seq, id, mac, function(result){
			res.send(result);
		})
	} catch(e) {
		next(e);
	}
	
})
//5. 웰태그 삭제 요청
router.delete("/del_welltag", function(req, res, next){
	try{
		var welltag_seq = req.query.welltag_seq;
		db.deleteWelltag(welltag_seq, function(result){
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})
//6-1 전체 layer 요청
router.get("/req_layer", function(req,res, next){
	try{
		db.getAllLayer(function(result){
			// console.log(result)
			res.send(result)
		})
	}catch(e){
		next(e)
	}
	
})

//6-2 map 요청
router.get("/req_map", function(req,res, next){
	//layer	
	try{
		var layer = req.query.layer
		db.getMap(layer, function(result){
			// console.log(result)
			res.send(result)
		})
	}catch(e){
		next(e)
	}
})

//6. 비콘 위치 요청(beacon_id, loc_x, loc_y)
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
//7. 개별 비콘 정보 요청
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
//8. 비콘 추가 요청
router.post("/add_beacon", [jsonParser], function(req, res, next){
	try{
		var type = 0;
		var beacon_id = req.body.beacon_id;
		var beacon_mac = req.body.beacon_mac;
		var loc_x = req.body.loc_x;
		var loc_y = req.body.loc_y;
		var layer = req.body.layer;
		db.addBeacon(beacon_id, beacon_mac, loc_x, loc_y, layer, function(result){
			// console.log(result)	
			if(result){
				res.send(result);
				rabbitmqClient.send_beaconInfo(type, beacon_id, loc_x, loc_y, layer)
			}else{
				res.send(result);
			}
		})	
	}catch(e){
		next(e)
	}	 
})
//9. 비콘 업데이트 요청
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
				rabbitmqClient.send_beaconInfo(type, beacon_id, loc_x, loc_y, layer)	
			}else{
				res.send(result);
			}
		})
	} catch(e){
		next(e)
	}
})
router.get("/relocationBeaconInfo", function(req, res, next){
	try{
		var layer = req.query.layer;
		db.relocationBeaconInfo(layer, function(result){
			// console.log(result)
			res.send(result)
		})
	}catch(e){
		next(e)
	}
})
router.post("/updateBeforeDataBeacon", [jsonParser], function(req, res, next){
	try{
		var data = req.body.data;
		type = 1;
		for(var i = 0; i<data.length; i++){
		// for(var i = 0; i<1; i++){
			// console.log(data[1];
			seq = data[i].seq;
			beacon_id = data[i].beacon_id;
			layer = data[i].layer;
			loc_x = data[i].loc_x;
			loc_y = data[i].loc_y;

			db.updateBeacon(seq, layer, loc_x, loc_y, function(result){
				rabbitmqClient.send_beaconInfo(type, beacon_id, loc_x, loc_y, layer)	
			})
		}
		res.send(true)
	}catch(e){
		next(e)
	}
})
// router.put("/relocation_beacon", [jsonParser], function(req, res, next){
// 	try{
// 		var type = 1;
// 		var beacon_seq = req.body.beacon_id;
// 		var beacon_id = req.body.beacon_id;
// 		var layer = req.body.layer;
// 		var loc_x = req.body.loc_x;
// 		var loc_y = req.body.loc_y;

// 		db.relocationBeacon(beacon_seq, beacon_id, layer, loc_x, loc_y, function(result){

// 		})
// 	}
// })
//10. 비콘 삭제 요청
router.delete("/delete_beacon", function(req, res, next){
	try{
		var type = 2
		var beacon_id = req.query.beacon_id;
		db.deleteBeacon(beacon_id, function(result){
			// console.log(result)
			if(result){
				res.send(result);
				rabbitmqClient.send_beaconInfo(type, beacon_id, 0, 0, 0)
			}else{
				res.send(result);	
			}
		})
	} catch(e){
		next(e)
	}
})

router.post("/saveBeaconLocation", function(req, res, next){
	try{
		layer = req.query.layer;
		db.saveBeaconLocation(layer, function(result){
			res.send(result);
		})
		
	} catch(e){
		next(e)
	}
})

router.delete("/deleteBeaconLocation", function(req, res, next){
	try{
		layer = req.query.layer;
		db.deleteBeaconLocation(layer, function(result){
			res.send(result)
		})
	} catch(e){
		next(e)
	}
})
//유저정보 
router.get("/user_Info", function(req,res, next){
	try{
		db.alrequestapprovalInfo(function(result){
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})

router.get("/sensortagInfo", function(req, res, next){
	try{
		db.sensortagInfo(function(result){
			res.send(result)
			// console.log(result)
		})
	} catch(e){
		next(e)
	}
})
router.post("/addSensorTagInfo", function(req, res, next){
	try{
		var tag_id = req.body.tag_id;
		var tag_group = req.body.tag_group;
		var location = req.body.location;
		var layer = req.body.layer;

		db.addSensorTagInfo(tag_id, tag_group, location, layer, function(result){
			res.send(result)
		})
	} catch(e){
		next(e)
	}
})
router.put("/modiSensorTagInfo", function(req, res, next){
	try{
		var tag_id = req.body.tag_id;
		var tag_group = req.body.tag_group;
		var location = req.body.location;
		var layer = req.body.layer;

		db.modiSensorTagInfo(tag_id, tag_group, location, layer, function(result){
			res.send(result)
		})	
	} catch(e){
		next(e)
	}
		
})
router.delete("/delSensorTagInfo", function(req, res, next){
	try{
		var tag_id = req.query.tag_id;

		db.delSensorTagInfo(tag_id, function(result){
			res.send(result)
		})	
	} catch(e){
		next(e)
	}
	
})

//gateway

router.get("/gatewayInfo", function(req, res, next){
	try{
		db.gatewayInfo(function(result){
			res.send(result)
			// console.log(result)
		})
	} catch(e){
		next(e)
	}
})

module.exports = router;