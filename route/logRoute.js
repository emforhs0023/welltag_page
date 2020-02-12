var express = require("express");
var db = require("../db/logDB");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json()
var passport   = require("../services/passport")
var ensureAuth   = require("../services/ensureAuth")
var urlencodedParser = bodyParser.urlencoded({extended : false})// form 통신 할때 쓰는 것 
var router = express.Router();

router.get("/", [ensureAuth], function(req, res){
	var auth    = req.session.passport.user.auth
	res.render("log/falling_log.html",{"auth":auth})
})
router.get("/escape", [ensureAuth], function(req, res){
	var auth    = req.session.passport.user.auth
	res.render("log/escape.html",{"auth":auth})
})

router.get("/fallingLogInfo", [urlencodedParser], function(req, res, next){
	try{
		db.fallingLogInfo(function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}
})

router.get("/fallingNameInfo", [urlencodedParser], function(req, res, next){
	
	try{
		// var layer = req.query.layer
		db.fallingNameInfo(function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
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
function setup_limit(limit, count){ // 두개의 인자값을 사용한다 
	count = 16;

	min_limit = parseInt(limit)
    max_limit = parseInt(limit) + count	

    return [min_limit, max_limit]// 인자 값은 배열로 받을 것이다
}

router.get("/dateFallingLogInfo", function(req, res, next){
	try{
		var date = req.query.date;
		db.dateFallingLogInfo(date, function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}
})

router.post("/NameFallingLogInfo", [urlencodedParser], function(req, res, next){
	try{
		var name = req.body.name; 
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;

		var a = new Array();
		var a = setup_limit(start);

		db.nameFallingLogInfo(name, a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
			// console.log(data)
			res.json(data)
		})
	} catch (e){
		next(e)
	}
})

router.post("/dateFallingLogInfo", [urlencodedParser], function(req, res, next){
	try{
		var date = req.body.date; 
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;

		// console.log(date)
		var a = new Array();
		var a = setup_limit(start);

		db.dateFallingLogInfo(date, a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
			// console.log(data)
			res.json(data)
			// console.log(data)
		})
	} catch (e){
		next(e)
	}
})
router.post("/allSetTimeInfo", [urlencodedParser], function(req, res, next){
	try{
		var date = req.body.date; 
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;

		var a = new Array();
		var a = setup_limit(start);

		
		db.fallingLogInfo(a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
			res.json(data)
		})
		
	} catch (e){
		next(e)
	}
})

router.get("/selectDate", function(req, res){
	db.selectDate(function(result){
		res.send(result)
	})
})

router.get("/req_layer_map", function(req,res){
	var layer = req.query.layer;

	db.req_layer_map(layer, function(result){
		res.send(result)
	})
})

router.post("/fallingSetTime", [urlencodedParser], function(req, res, next){
	try{	
		var date = req.body.date; 
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;
		// console.log(date)
		// console.log(date)
		var a = new Array();
		var a = setup_limit(start);

		
		db.fallingSetTime(date, a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
			// console.log(data)
			res.json(data)
		})
		
	} catch (e){
		next(e)
	}
})
router.post("/bedsoreSetTime", [urlencodedParser], function(req, res, next){
	try{
		var date = req.body.date; 
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;

		var a = new Array();
		var a = setup_limit(start);

		
		db.bedsoreSetTime(date, a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
			// console.log(data)
			res.json(data)
		})
		
	} catch (e){
		next(e)
	}
})
router.get("/selectLayer",function(req, res, next){
	try{
		db.selectLayer(function(result){
			res.send(result)
		})	
	} catch (e){
		next(e)	
	}
})

// router.post("/viewAllLayerLogInfo", [urlencodedParser], function(req, res, next){
// 	try{
// 		layer = req.body.layer;
// 		time = req.body.time;
// 		var draw = req.body.draw;
// 		var start = req.body.start;
// 		var length = req.body.length;

// 		// console.log(layer)
// 		// console.log(time)
// 		var a = new Array();
// 		var a = setup_limit(start);

// 		if(time == "all"){
// 			db.allLayerTime(time, layer, a[0], a[1], function(result){
// 				data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
// 				res.json(data)
// 			})
// 		}	
// 		// } else if(time == "all" && layer != -1){
// 		// 	db.allTimeNotAllLayer(time, layer, a[0], a[1], function(result){
// 		// 		data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
// 		// 		res.json(data)
// 		// 	})
// 		// }
// 		else {
// 			// console.log(asdfsdf)
// 			db.LayerSetTime(layer, time, a[0], a[1], function(result){
// 				data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
// 				res.json(data)
// 			})
// 		}		
// 	} catch (e){

// 	}
// })


router.post("/searchFallingLogByName", [urlencodedParser], function(req, res, next){
	try{
		var keyword = req.body.keyword;
		// var date = req.body.date;
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;

		var a = new Array();
		var a = setup_limit(start);

		db.searchFallingLogByName(keyword, a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
			res.json(data)
		})
	} catch (e){

	}
})

router.post("/searchName", [urlencodedParser], function(req, res, next){
	try{
		var time = req.body.time;
        var	layer = req.body.layer;
        var	nameKeyword = req.body.nameKeyword;
        var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;
		// console.log(nameKeyword)

		var a = new Array();
		var a = setup_limit(start);

		db.searchName(time, layer, nameKeyword, a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
			// console.log(data)
			res.json(data)
		})
	} catch (e){

	}
})

router.post("/escapeInfo", [urlencodedParser], function(req, res, next){
	try{
		var draw = req.body.draw;
		var start = req.body.start;
		var length = req.body.length;
		// console.log(nameKeyword)

		var a = new Array();
		var a = setup_limit(start);

		db.escapeInfo(a[0], a[1], function(result){
			data = {"draw":draw, "data":result[0], "recordsTotal":result[1], "recordsFiltered":result[1]}
			// console.log(data)
			res.json(data)
		})
	} catch (e){

	}
})
router.get("/distributionLayer",[urlencodedParser], function(req, res, next){
	// console.log(req.query);
	try{
		db.distributionLayer(function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}
})
router.get("/allFallingInfo",[urlencodedParser], function(req, res, next){
	// console.log(req.query);
	try{
		var layer = req.query.layer;
		db.allFallingInfo(layer, function(result){
			res.send(result)
		})
	} catch (e){
		next(e)
	}
})

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

router.get("/changeFallingName", function(req,res, next){
	try {
		//layer
		var name = req.query.name
		db.changeFallingName(name, function(result){
			res.send(result)
		})
	} catch(e) {
		next(e)
	}

})

router.get("/selectDate", function(req, res){
	db.selectDate(function(result){
		res.send(result)
	})
})
router.get("/timeFallingInfo", function(req, res){
	var date = req.query.date
	
	db.timeFallingInfo(date, function(result){
		res.send(result)
	})
})

router.get("/dotFallingLog", function(req, res){
	
	var time = req.query.time
	var layer = req.query.layer
	var name = req.query.name
	db.dotFallingLog(time, layer, name, function(result){
		res.send(result)
	})
})
module.exports = router;


