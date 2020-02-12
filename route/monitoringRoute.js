var express = require("express");
var db = require("../db/monitoringDB");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json()
var ensureAuth   = require("../services/ensureAuth")
var socketHandler = require("../services/socketHandler");
var MQTTService = require("../services/MQTTService")
var urlencodedParser = bodyParser.urlencoded({extended : false})
var router = express.Router();
var async = require("async");

//웹페이지 경로
router.get("/", [ensureAuth], function(req, res, next) {
	try {
		var user_id = req.session.passport.user.user_id
		var auth    = req.session.passport.user.auth
		res.render("monitoring/index.html",{"auth":auth, "user_id":user_id})
	} catch(e) {
		next(e);
	}

})

router.get("/sensor", [ensureAuth], function(req, res, next) {
	try {
		var user_id = req.session.passport.user.user_id
		var auth    = req.session.passport.user.auth
		res.render("monitoring/sensor_monitoring.html",{"auth":auth, "user_id":user_id})
	} catch(e) {
		next(e);
	}

})

router.get("/wearing_welltag_info", [ensureAuth], function(req, res, next){
	try {
		var user_id = req.session.passport.user.user_id
		var auth    = req.session.passport.user.auth
		res.render("monitoring/wearing_welltag_info.html",{"auth":auth, "user_id":user_id})
	} catch(e) {
		next(e);
	}

})

router.post("/sensor_welltag_data",[jsonParser], function(req, res, next){
	try {
		var tagId = req.body.tagId;
		var type = req.body.type;
		var value = req.body.val1;
		var value2 = req.body.val2;
		var battery = req.body.ba;
		// console.log(req.body)
		//O2
		if(type == 1){
			db.updateO2Welltag(tagId, value, battery, function(result){
				// MQTTService.sendSensor(tagId, type, value, null)
				res.end("success");
			})
		}
		//CO
		if(type == 2){
			db.updateCoWelltag(tagId, value, battery, function(result){
				// if(value > 50){
				// 	// MQTTService.sendSensor(tagId, type, value)	
				// }
				res.end("success");
			})
		}
		// 미세먼지
		if(type == 3){
			db.updateDustWelltag(tagId, value, battery, function(result){
				// if(value > 30){
				// 	MQTTService.sendSensor(tagId, type, value)	
				// }
				res.end("success");
			})
		}
		// 온 습 도
		if(type == 4){
			db.updateTempHumiWelltag(tagId, value, value2, battery, function(result){
				// MQTTService.sendSensor(tagId, type, value, value2)
				res.end("success");
			})
		}
	} catch(e) {
		next(e);
		res.end("success");
	}

})

router.post("/welltag_data", [jsonParser], function(req, res, next) {
	try {
		// console.log(req.body)
		var tagId = req.body.tagId;
		var x     = req.body.x;
		var y     = req.body.y;
		var layer = req.body.layer;
		var battery = req.body.battery;
		var fail_down = req.body.fail_down;
		var move = req.body.move;
		var from_layer = req.body.from_layer;
		var bid = req.body.bid;
		var escape = req.body.escape;
		// console.log("escape : "+req.body.escape);
		// console.log(tagId)
		// console.log(x)
		// console.log(y)
		// console.log(layer)
		// console.log(battery)
		// console.log(fail_down)
		// console.log(move)
		// console.log(from_layer)
		// console.log(bid)
		// console.log(escape)
		db.userNameCheck(tagId, function(result){
			// console.log(result[0]["name"]);
			var name = result[0]["name"];

			if(name == null){
				// console.log("good")
			}else{
				// console.log("good")
				db.insertWelltagLog(tagId, x, y, layer, fail_down, battery, escape, name, function(result){
					// console.log(result);
				});	
			}
		})
		if(escape == 1){
			// console.log(escape);
			db.userEscapeState(tagId, function(result){				
				var escape_state = result[0]["isFalling"]
				var name = result[0]["name"]
				if(escape_state == "6"){
					
				} else {
					if(name == null){

					}else{
						db.saveEscapeLog(tagId, function(result){
							// res.send(result);
						})

						MQTTService.escape(tagId, x, y, layer)	
					}
				}
			})
		}
		if(fail_down == 0 || fail_down == 2 || fail_down == 4 ) {
			db.userState(tagId, function(result) {
				if(escape == 1){
					fail_down = 6;
				}

				var state = -1;

				try {
					if(result["isFalling"] !== undefined)
						state = result["isFalling"];
				} catch(e) {
					console.error(e.stack);
					// console.error("result:" + result);
					res.end("success");
					return;
				}

				if(state == -1) {
					res.end("success");
					return;
				}

				if(state == 1) {
					async.waterfall([
						function(callback) {
							// db.fallingUpdateWelltagInfo(tagId, x, y, layer, battery, move, function(result){
								if(escape == 1){
									db.updateWelltagInfo2(tagId, x, y, layer, fail_down, battery, function(result){
										callback(null, result);
									});		
								}else{
									db.fallingUpdateWelltagInfo(tagId, x, y, layer, battery, function(result){
										callback(null, result);
									});		
								}
						}, function(result, callback) {
							try {
								if(result) {
									result["escape"] = escape
									result["from_layer"] = from_layer;
									socketHandler.socketWelltagInfo(result);
								}
							} catch(e) {
								console.error(e.stack);
							}
						}
					], function (err, result){
					});
				} else {
					async.waterfall([
						function(callback) {
							// db.updateWelltagInfo2(tagId, x, y, layer, 0, battery, move, function(result){
							if(escape == 1){
								db.updateWelltagInfo2(tagId, x, y, layer, fail_down, battery, function(result){
									callback(null, result);
								});		
							}else{
								db.updateWelltagInfo2(tagId, x, y, layer, 0, battery, function(result){
									callback(null, result);
								});
							}

						}, function(result, callback) {
							try {
								if(result) {
									result["escape"] = escape
									result["from_layer"] = from_layer;
									socketHandler.socketWelltagInfo(result);
								}
							} catch(e) {
								console.error(e.stack);
							}
						}
					], function (err, result){
					});
				}
			})
		}
		//액션status가 1(낙상)이라면
		if(fail_down == 1){
			//tagId를 이용하여 현재 상태 값 확인
			db.typeState(tagId, function(result){
				//state 초기 값 -1 
				var state = -1

				try {
					// result["type"]의 값을 state에 저장
					if (result["type"] !== undefined)
						state = result["type"]
				} catch(e) {
					console.error(e.stack);
					// console.error("result:" + result);
					res.end("success");
					return;
				}

				//state가 -1이라면
				if(state == -1){
					res.end("success");
					return;
				}
				//state가 의료기구라면
				if(state == "의료기구"){			
					async.waterfall([
						function(callback) {
							// db.fallingUpdateWelltagInfo(tagId, x, y, layer, battery, move, function(result){
							db.fallingUpdateWelltagInfo(tagId, x, y, layer, battery, function(result){
								callback(null, result);
							});
						}, function(result, callback) {
							try {
								if(result) {
									result["from_layer"] = from_layer;
									socketHandler.socketWelltagInfo(result);
								}
							} catch(e) {
								console.error(e.stack);
							}
						}
					], function (err, result){
					});
				}else{
					if(escape == 0){
						MQTTService.sendFalling(tagId, x, y, layer)
						fail_down = 1;
					}else if(escape == 1){
						// MQTTService.sendFalling(tagId, x, y, layer)
						fail_down = 6;
					}
					

					async.waterfall([
						function(callback) {
							// db.updateWelltagInfo2(tagId, x, y, layer, fail_down, battery, move, function(result){
							db.updateWelltagInfo2(tagId, x, y, layer, fail_down, battery, function(result){
								callback(null, result);
							});
						}, function(result1, callback) {
							if(fail_down == 6){
								callback(null, result1)
							}else{
								db.insertFallingLog(tagId, function(result) {
									callback(null, result1);
								});	
							}
							
						},function(result, callback) {
							try {
								if(result) {
									result["escape"] = escape;
									result["from_layer"] = from_layer;
									socketHandler.socketWelltagInfo(result);
								}
							} catch(e) {
								console.error(e.stack);
							}

						}
					], function (err, result){
					});
				}
			})
		}
		if(fail_down == 3){
			db.typeState(tagId, function(result){
				var state = -1

				try {
					if(result["type"] !== undefined)
						state = result["type"]
				} catch(e) {
					console.error(e.stack);
					// console.error("result:" + result);
					res.end("success");
					return
				}

				if(state == -1){
					res.end("success");
					return;
				}

				if(state == "의료기구"){
					async.waterfall([
						function(callback) {
							// db.fallingUpdateWelltagInfo(tagId, x, y, layer, battery, move, function(result){
							db.fallingUpdateWelltagInfo(tagId, x, y, layer, battery, function(result){
								callback(null, result);

							});
						}, function(result, callback) {
							try {
								if(result) {
									result["from_layer"] = from_layer;
									socketHandler.socketWelltagInfo(result);
								}
							} catch(e) {
								console.error(e.stack);
							}
						}
					], function (err, result){
					});
				}else{
					if(escape == 0){
						MQTTService.sendDecubitus(tagId, x, y, layer)	
						fail_down = 3;
					}else if(escape == 1){
						// MQTTService.sendDecubitus(tagId, x, y, layer)	
						fail_down = 6;
					}
					

					async.waterfall([
						function(callback) {
							// db.updateWelltagInfo2(tagId, x, y, layer, fail_down, battery, move, function(result){
							db.updateWelltagInfo2(tagId, x, y, layer, fail_down, battery, function(result){
								callback(null, result);
							});
						}, function(result1, callback) {
							if(fail_down == 6){
								callback(null, result1)
							}else{
								db.insertFallingLog(tagId, function(result) {
									callback(null, result1);
								});	
							}
						},function(result, callback) {
							try {
								if(result) {
									result["escape"] = escape;
									result["from_layer"] = from_layer;
									socketHandler.socketWelltagInfo(result);
								}
							} catch(e) {
								console.error(e.stack);
							}

						}
					], function (err, result){

					});
				}
			})
		}
		res.end("success");
	} catch(e) {
		next(e);
	}
})

//데이터 요청
//1. 전체 layer 요청(layer)
router.get("/req_layer", function(req,res, next){
	try {
		db.getAllLayer(function(result){
			res.send(result)
		})
	} catch(e) {
		next(e)
	}

})

// //2. layer별 맵 경로 요청(layer_map)
router.get("/req_map", function(req,res, next){
	try {
		//layer
		var layer = req.query.layer
		db.getMap(layer, function(result){
			res.send(result)
		})
	} catch(e) {
		next(e)
	}

})

//3. 웰태그 위치 정보 요청(welltag_id, loc_x, loc_y, isFalling)
router.get("/layer_location_welltag_info", function(req, res, next){
	try {
		//layer
		var layer = req.query.layer
		db.getLocationWelltag(layer, function(result){
			res.send(result)
		})
	} catch(e) {
		next(e)
	}

})

//4. 전체 착용 대상 웰태그 및 대상자 정보 요청
router.get("/all_welltag_info", function(req, res, next){
	try{
		var layer = req.query.layer
		db.allWelltagInfo(layer, function(result){
			res.send(result)
		})
	}catch(e){
		next(e)
	}

})
router.get("/sortingName", function(req, res, next){
	try{
		var layer = req.query.layer;
		var selet_type = req.query.type;
		
		if(selet_type == "all"){
			db.allSortingName(layer, function(result){
				res.send(result)
			})
		}
		if(selet_type == "patient"){
	        type = "환자"
	    	db.sortingName(layer, type, function(result){
				res.send(result)
			})
	    }
	    if(selet_type == "medical_person"){
	        type = "의료인"
	    	db.sortingName(layer, type, function(result){
				res.send(result)
			})
	    }
	    if(selet_type == "medical_equiment"){
	        type = "의료기구"
	        db.sortingName(layer, type, function(result){
				res.send(result)
			})
	    }

	}catch(e){
		next(e)
	}
})
router.get("/sortingFalling", function(req, res, next){
	try{
		var layer = req.query.layer
		var selet_type = req.query.type;
		if(selet_type == "all"){
			db.allSortingFalling(layer, function(result){
				res.send(result)
			})
		}
		if(selet_type == "patient"){
	        type = "환자"
	    	db.sortingFalling(layer, type, function(result){
				res.send(result)
			})
	    }
	    if(selet_type == "medical_person"){
	        type = "의료인"
	    	db.sortingFalling(layer, type, function(result){
				res.send(result)
			})
	    }
	    if(selet_type == "medical_equiment"){
	        type = "의료기구"
	        db.sortingFalling(layer, type, function(result){
				res.send(result)
			})
	    }


	}catch(e){
		next(e)
	}

})
router.get("/sortingSignal", function(req, res, next){
	try{
		var layer = req.query.layer
		var selet_type = req.query.type;
		if(selet_type == "all"){
			db.allSortingSignal(layer, function(result){
				res.send(result)
			})
		}
		if(selet_type == "patient"){
	        type = "환자"
	        db.sortingSignal(layer, type, function(result){
				res.send(result)
			})
	    }
	    if(selet_type == "medical_person"){
	        type = "의료인"
	    	db.sortingSignal(layer, type, function(result){
				res.send(result)
			})
	    }
	    if(selet_type == "medical_equiment"){
	        type = "의료기구"
	    	db.sortingSignal(layer, type, function(result){
				res.send(result)
			})
	    }


	} catch (e){
		next(e)
	}

})
router.get("/sortingBattery", function(req, res, next){
	try{
		var layer = req.query.layer
		var selet_type = req.query.type;
		if(selet_type == "all"){
			db.allSortingBattery(layer, function(result){
				res.send(result)
			})
		}
		if(selet_type == "patient"){
	        type = "환자"
	        db.sortingBattery(layer, type, function(result){
				res.send(result)
			})
	    }
	    if(selet_type == "medical_person"){
	        type = "의료인"
	    	db.sortingBattery(layer, type, function(result){
				res.send(result)
			})
	    }
	    if(selet_type == "medical_equiment"){
	        type = "의료기구"
	    	db.sortingBattery(layer, type, function(result){
				res.send(result)
			})
	    }


	} catch (e){
		next(e)
	}

})
router.get("/sortingType", function(req, res, next){
	try{
		var layer = req.query.layer
		var selet_type = req.query.type;
		if(selet_type == "all"){
			db.allSortingType(layer, function(result){
				res.send(result)
			})
		}
		if(selet_type == "patient"){
	        type = "환자"
	        db.sortingType(layer, type, function(result){
				res.send(result)
			})
	    }
	    if(selet_type == "medical_person"){
	        type = "의료인"
	    	db.sortingType(layer, type, function(result){
				res.send(result)
			})
	    }
	    if(selet_type == "medical_equiment"){
	        type = "의료기구"
	    	db.sortingType(layer, type, function(result){
				res.send(result)
			})
	    }


	} catch (e){
		next(e)
	}

})
//5. 의료인 착용 웰태그 및 의료인 정보 요청
router.get("/medical_person_welltag_info", function(req,res, next){
	try{
		var layer = req.query.layer
		db.medicalPersonWelltagInfo(layer, function(result){
			res.send(result)
		})
	} catch(e) {
		next(e)
	}
})

//6. 의료기구 착용 웰태그 및 의료기구 정보 요청
router.get("/medical_equiment_welltag_info", function(req, res, next){
	try{
		var layer = req.query.layer
		db.medicalEquimentWelltagInfo(layer, function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}
})

//7. 환자 착용 웰태그 요 및 환자 정보 요청
router.get("/patient_welltag_info", function(req, res, next){
	//환자 테이블 출력
	try{
		var layer = req.query.layer
		db.patientWelltagInfo(layer, function(result){
			res.send(result)
		})
	} catch (e) {
		next(e)
	}

})

// //8. 작동상태 ON 웰태그 정보 요청
// router.get("/active_on", function(req,res){
// 	var layer = req.query.layer
// 	db.activeOn(layer, function(result){
// 		res.send(result)
// 	})
// })

//9. 작동상태 OFF 웰태그 정보 요청
router.get("/active_off", function(req, res, next){
	//isActive	= 0
	try{
		var layer = req.query.layer
		db.getActiveOffList(layer, function(result) {
			res.send(result);
		})
	} catch (e){
		next(e)
	}

})

// 12 초기화
router.put("/reset_falling",[jsonParser], function(req, res, next){
	try {
		var welltag_id = req.body.welltag_id
		db.resetFalling(welltag_id,function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}

})

// 13. 착용대상 정보 수정 요청
router.post("/modi_welltag_info", [jsonParser],function(req, res, next){
	try{
		var welltag_seq = req.body.welltag_seq;
		var type = req.body.type;
		var name = req.body.name;
		var ward = req.body.ward;
		var modi_age = req.body.modi_age;
		var modi_gender = req.body.modi_gender;
		
		db.addWearingWelltagInfo(welltag_seq, type, name, ward, modi_age, modi_gender, function(result) {
			res.send(result);
		})
	} catch(e){
		next(e)
	}
})

router.post("/new_welltag_info", [jsonParser],function(req, res, next){
	try{
		var id = req.body.id;
		var welltag_seq = req.body.welltag_seq;
		var new_id = req.body.new_id;		
		var modi_age = req.body.modi_age;
		var modi_gender = req.body.modi_gender;
		var type = req.body.type;
		var name = req.body.name;
		var ward = req.body.ward;
		var layer = req.body.layer;
		db.new_welltag_info(id, welltag_seq, new_id, modi_age, modi_gender, type, name, ward, layer, function(result) {
			res.send(result);
			// console.log(result)
		})
	} catch(e){
		next(e)
	}
})
//14. 착용대상 수정 폼 초기 값 요청
router.get("/init_wearing_welltag_info",function(req,res, next){
	try{
		var welltag_id = req.query.welltag_id
		db.initWearingWelltagInfo(welltag_id,function(result){
			res.send(result)
		})
	} catch(e){
		next(e)
	}

})

//14-1 가지고 있던 정보 삭제
router.get("/delete_wearing_welltag_info",function(req, res, next){
	// var type = req.query.type;
	// console.log(req.query)
	try{
		var welltag_id = req.query.welltag_id;
		db.updateWelltagUseStateReset(welltag_id, function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}

})

// //15. 착용대상 정보 삭제 요청
// router.get("",function(req,res){
// 	//welltag_seq
// })
//16.착용 웰태그 정보 관리

router.post("/all_wearing_welltag_Info", [urlencodedParser], function(req, res, next){
	try{
		var layerSelect = req.body.layerSelect;
		// console.log(layerSelect)
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;

		var a = new Array();
		var a = setup_limit(start)


		db.allWearingWelltagInfo(layerSelect, a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered": result[1]}
			res.json(data)
		})
	} catch (e){
		next(e)
	}
})

//17.사용하지 않는 웰태그 조회
router.get("/not_use_welltag_info",function(req, res, next){
	try{
		db.notUseWelltagInfo(function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}
})
//18. 착용 대상 웰태그 추가 요청
router.post("/add_wearing_welltag_info",[jsonParser], function(req,res, next){
	// console.log(req.body);
	try{
		var welltag_seq = req.body.welltag_seq
		var type = req.body.type
		var name = req.body.name
		var ward = req.body.ward
		var age = req.body.age
		var gender = req.body.gender
		var etc = req.body.etc
		var patient_number = req.body.patient_number
		var layer = req.body.layer;
		// console.log()
		db.updateWelltagUseState(type, name, ward, age, gender, etc, patient_number, welltag_seq, layer, function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}
})
// 19. 낙상 count
// router.get("/count", function(req, res){
// 	var layer = req.query.layer;
// 	db.getMonitoringCount(layer, function(result){
// 		res.send(result)
// 	})
// })

router.get("/init_welltag_info", function(req, res, next){
	try{

		db.init_welltag_info(function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}

});
router.get("/moveInfo", function(req, res, next){
	try{
		var tagId = req.query.tagId;

		db.moveInfo(tagId, function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}

});
router.get("/accumMoveInfo", function(req, res, next){
	try{
		var name = req.query.name;

		db.accumMoveInfo(name, function(result){
			res.send(result)
		})
	} catch(e){
		next(e)
	}
})



router.post("/selectLayer", [jsonParser], function(req, res, next){
	try{
		var user_id = req.body.user_id;
		db.selectLayer(user_id, function(result){
			res.send(result)
		})
	} catch(e){
		next(e)
	}

})




// 신호 낙상
router.get("/searchName", function(req, res, next){
	try{
		var select_type = req.query.select_type

		if(select_type == "all"){

			db.allSearchName(function(result){
				res.send(result)
			})
		}
		if(select_type == "patient"){
			type = "환자"
			db.searchName(type, function(result){
				res.send(result)
			})
		}
		if(select_type == "medical_person"){
			type = "의료인"
			db.searchName(type, function(result){
				res.send(result)
			})
		}
		if(select_type == "medical_equiment"){
			type = "의료기구"
			db.searchName(type, function(result){
				res.send(result)
			})
		}


	} catch (e){
		next(e)
	}

})

router.get("/searchFalling", function(req, res, next){
	try{
		var select_type = req.query.select_type

		if(select_type == "all"){

			db.SearchFalling(function(result){
				res.send(result)
			})
		}
		if(select_type == "patient"){
			type = "환자"
			db.searchFalling(type, function(result){
				res.send(result)
			})
		}
		if(select_type == "medical_person"){
			type = "의료인"
			db.searchFalling(type, function(result){
				res.send(result)
			})
		}
		if(select_type == "medical_equiment"){
			type = "의료기구"
			db.searchFalling(type, function(result){
				res.send(result)
			})
		}


	} catch (e){
		next(e)
	}

})

router.get("/searchSignal", function(req, res, next){
	try{

		var select_type = req.query.select_type

		if(select_type == "all"){

			db.SearchActive(function(result){
				res.send(result)
			})
		}
		if(select_type == "patient"){
			type = "환자"
			db.searchSignal(type, function(result){
				res.send(result)
			})
		}
		if(select_type == "medical_person"){
			type = "의료인"
			db.searchSignal(type, function(result){
				res.send(result)
			})
		}
		if(select_type == "medical_equiment"){
			type = "의료기구"
			db.searchSignal(type, function(result){
				res.send(result)
			})
		}


	} catch (e){
		next(e)
	}

})
router.get("/searchBattery", function(req, res, next){
	try{

		var select_type = req.query.select_type

		if(select_type == "all"){

			db.allSearchBattery(function(result){
				res.send(result)
			})
		}
		if(select_type == "patient"){
			type = "환자"
			db.searchBattery(type, function(result){
				res.send(result)
			})
		}
		if(select_type == "medical_person"){
			type = "의료인"
			db.searchBattery(type, function(result){
				res.send(result)
			})
		}
		if(select_type == "medical_equiment"){
			type = "의료기구"
			db.searchBattery(type, function(result){
				res.send(result)
			})
		}


	} catch (e){
		next(e)
	}

})
router.get("/searchType", function(req, res, next){
	try{

		var select_type = req.query.select_type

		if(select_type == "all"){

			db.allSearchType(function(result){
				res.send(result)
			})
		}
		if(select_type == "patient"){
			type = "환자"
			db.searchType(type, function(result){
				res.send(result)
			})
		}
		if(select_type == "medical_person"){
			type = "의료인"
			db.searchType(type, function(result){
				res.send(result)
			})
		}
		if(select_type == "medical_equiment"){
			type = "의료기구"
			db.searchType(type, function(result){
				res.send(result)
			})
		}


	} catch (e){
		next(e)
	}

})


//
router.get("/all_welltag_Wearing", function(req, res, next){
	try{
		var layer = req.query.layer

		db.all_welltag_Wearing(layer, function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}

})

router.get("/medical_person_welltag_Wearing", function(req, res, next){
	try{
		db.medical_person_welltag_Wearing(function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}

})

router.get("/medical_equiment_welltag_Wearing", function(req, res, next){
	try{
		db.medical_equiment_welltag_Wearing(function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}

})


router.get("/patient_welltag_Wearing", function(req, res, next){
	try{
		db.patient_welltag_Wearing(function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}

})
router.get("/getSensorLocation", function(req, res, next){
	try{
		layer = req.query.layer;
		db.sensorTagLocation(layer, function(result){
			res.send(result)
		})
	}catch(e){
		next(e)
	}
})

router.get("/getSensorData", function(req, res, next){
	try{
		layer = req.query.layer;
		db.sensorTagTable(layer, function(result){
			res.send(result)
		})
	}catch(e){
		next(e)
	}
})

function setup_limit(limit, count){ // 두개의 인자값을 사용한다 
	count = 16;

	min_limit = parseInt(limit)
    max_limit = parseInt(limit) + count	

    return [min_limit, max_limit]// 인자 값은 배열로 받을 것이다
}

router.post("/searchFallingLogByName", [urlencodedParser], function(req, res, next){
	try{
		var keyword = req.body.keyword;
		var type = req.body.type;
		var layer = req.body.layer;
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;

		// console.log(keyword)
		// console.log(type)

		var a = new Array();
		var a = setup_limit(start);

		db.searchFallingLogByName(keyword, type, layer, a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
			res.json(data)
			// console.log(data)
		})		
	}	catch (e){

	}

})
router.post("/fallingLogInfo", [urlencodedParser], function(req, res, next){
	try{
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;

		var a = new Array();
		var a = setup_limit(start)


		db.fallingLogInfo(a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered": result[1]}
			res.json(data)
		})
	} catch (e){
		next(e)
	}
})

router.post("/changeLayer", [urlencodedParser], function(req, res, next){
	try{
		
		var changeLayer = req.body.changeLayer;
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;

		var a = new Array();
		var a = setup_limit(start)


		db.changeLayer(changeLayer, a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered": result[1]}
			res.json(data)
		})
	} catch (e){
		next(e)
	}
})
router.get("/escape_count", function(req,res, next){
   try {
      db.escape_count(function(result){
         res.send(result)
      })
   } catch(e) {
      next(e)
   }

})

router.post("/escape", [urlencodedParser], function(req, res, next){
   try{

         var draw = req.body.draw;
      var start = req.body.start;
      var length = req.body.length;

      var a = new Array();
      var a = setup_limit(start)

      db.escape(a[0], a[1], function(result){
         data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered": result[1]}
         res.json(data)
      })
      
   } catch(e){
      next(e)
   }
})

router.post("/denudation", [jsonParser],function(req, res, next){
   try{
      db.denudation(function(result) {
         res.send(result);
      })
   } catch(e){
      next(e)
   }
})




router.get("/tracking", function(req, res, next){
	try{
		var start = req.query.start;
		var end = req.query.end;
		var name = req.query.name;
		var layer = req.query.layer;


		// console.log(start);
		// console.log(end);

		db.tracking(start, end, name, layer, function(result){
			// console.log(result)
			res.send(result);
		})

	} catch(e){
		next(e)
	}
})

router.get("/selecttrackingdate", function(req, res, next){
	try{
		db.selectTrackingDate(function(result){
			console.log(result)
			res.send(result);
		})
	} catch(e){
		next(e);
	}
})
// router.get("/tracking_start", function(req, res, next){
// 	try{
// 		var name = req.query.name;
// 		var layer = req.query.layer;


// 		db.startTracking(name, layer, function(result){
// 			res.send(result);
// 		})

// 	} catch(e){
// 		next(e)
// 	}
// })
// router.get("/tracking_end", function(req, res, next){
// 	try{
// 		var name = req.query.name;
// 		var layer = req.query.layer;


// 		db.endTracking(name, layer, function(result){
// 			res.send(result);
// 		})

// 	} catch(e){
// 		next(e)
// 	}
// })
// router.get("/tracking_escape", function(req, res, next){
// 	try{
// 		var name = req.query.name;
// 		var layer = req.query.layer;


// 		db.escapeTracking(name, layer, function(result){
// 			res.send(result);
// 		})

// 	} catch(e){
// 		next(e)
// 	}
// })

router.post("/test", function(req, res, next){
	try{
		console.log(req.body)
	} catch(e){
		next(e);
	}
})

module.exports = router;