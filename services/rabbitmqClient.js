var config = require("../config");
// var logger = require("./loger");
var amqp = require("amqp");
var socketHandler = require("./socketHandler");
var db = require("../db/monitoringDB");

var conn = amqp.createConnection({
	host: config.rabbitmq.host,
	port: config.rabbitmq.port,
	login: config.rabbitmq.user,
	password: config.rabbitmq.password,
	vhost: config.rabbitmq.vhost
})

conn.on("error", function(err){
	console.log(err);
})

conn.on("ready", function(){
	console.log("connected rabbitmq");
	// conn.queue("celery_result", {autoDelete: false}, function(q){

	// 	q.bind("celery_result")

	// 	q.subscribe(function(msg){
	// 		console.log(msg.toString());
	// 		data = JSON.parse(msg.data.toString());
	// 		var tagId = data['tagId']
	// 		var x = data['x']
	// 		var y = data['y']
	// 		var layer = data['layer']
	// 		var battery = data['battery']
	// 		var fail_down = data['fail_down']
	// 		// console.log(tagId)

	// 		db.updateWelltagInfo(tagId, x, y, layer, fail_down, battery, function(result){
	// 			console.log(result)
	// 		})

	// 		// if(fail_down){
	// 		// 	db.updateFalling(tagId, function(result){
	// 		// 		console.log(result)
	// 		// 	})
	// 		// }
	// 		//소켓 연결 테스트
	// 		socketHandler.socketWelltagInfo(data);
	// 		//socket.io를 이용한 웰태그 위치/낙상 데이터 클라이언트에 전송

	// 	})
	// })
})

module.exports.send_beaconInfo = function(type, beacon_id, loc_x, loc_y, layer) {
    msg = {
        "type": parseInt(type), 
        "beacon_id": beacon_id, 
        "x": parseFloat(loc_x), 
        "y": parseFloat(loc_y),
        'layer': parseInt(layer)
    }

    conn.publish('beacon_mg', JSON.stringify(msg), {deliveryMode: 2}, function(err) {
        if(err) {
            logger.info(err);
        }
    })
}