var logger = require("../services/logger");

SocketHandler = (function(){

	var root = this;
	var Module;
	var io = null;

	if(typeof exports !== "undefined"){
		Module = exports;
	}else{
		Module = root.Module = {};
	}

	Module.setSocketIO = function(socketIo){
		io = socketIo;

		io.on("connection", function(socket){
			// layer가 변경 되었을 경우
			socket.on('move_layer', function(data) {

				var from_room = data.from + "_room";
				var to_room = data.to + "_room";

				// console.log('from_room: ' + from_room + ", to_room: " + to_room);

				socket.leave(from_room); // 이전에 있던 방에서 나간다
				socket.join(to_room); // 새방에 들어 온다
			})
		})
	}

	Module.socketWelltagInfo = function(data){
		try {
			// 이전 층에게 웰태그가 다른 층으로 이동했다고 알림
			if(data.from_layer != data.layer) {
				layer_room = data.from_layer + "_room";
				io.to(layer_room).emit("location", data);	
			}

			// 층을 구별하여 데이터를 클라이언트에게 전달
			layer_room = data.layer + "_room";
			io.to(layer_room).emit("location", data);
		} catch(e) {
			console.log(e);
		}
	}

	return Module;
})();


module.exports = SocketHandler;