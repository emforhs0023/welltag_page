var express = require("express");

var router = express.Router();

router.get("/", function(req, res){
	res.render("test/test.html")
})
router.get("/1", function(req, res){
	res.render("test/test2.html")
})
router.get("/2", function(req, res){
	res.render("test/test3.html")
})
router.get("/typetest", function(req, res){
	res.render("test/type.html")
})
router.post("/welltag_location", function(req, res) {
	console.log(res.body);
	res.end("good");
})

module.exports = router;