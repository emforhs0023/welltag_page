var mqtt = require("mqtt");


client.on("connect", function() {
	console.log("mqtt connect")
});

module.exports.escape = function(tagid, x, y, layer){ //탈원
	client.publish("pusan/hospital/escape",'{"tagId":"'+tagid+'", "x":'+x+', "y":'+y+', "layer":'+layer+'}')
}

module.exports.sendFalling = function(tagid, x, y, layer){ // 낙상
	client.publish("pusan/hospital/falling",'{"tagId":"'+tagid+'", "x":'+x+', "y":'+y+', "layer":'+layer+'}')
}

module.exports.sendDecubitus = function(tagid, x, y, layer){ //욕창
	client.publish("pusan/hospital/decubitus",'{"tagId":"'+tagid+'", "x":'+x+', "y":'+y+', "layer":'+layer+'}')	
}
