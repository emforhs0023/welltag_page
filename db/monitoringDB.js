var pool = require("../services/database").pool;

//전체 layer 요청(layer)
module.exports.getAllLayer = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "select * from tbl_layer";
		connection.query(query,[],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
module.exports.allSortingName = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE layer=? and use_state = 1 and name is not NULL ORDER BY name asc";
		connection.query(query, [layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

module.exports.allSortingFalling = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE layer=? and use_state = 1 and name is not null ORDER BY isFalling DESC";
		connection.query(query, [layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

module.exports.allSortingSignal = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE layer=? and use_state = 1 and name is not null ORDER BY isActive DESC";
		connection.query(query, [layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

module.exports.allSortingBattery = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE layer=? and use_state = 1 and name is not null ORDER BY battery ASC";
		connection.query(query, [layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
module.exports.allSortingType = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE layer=? and use_state = 1 and name is not null ORDER BY Type DESC";
		connection.query(query, [layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
module.exports.sortingName = function(layer, type, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE type = ? and layer=? and use_state = 1 and name is not null ORDER BY NAME ASC";
		connection.query(query, [type, layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
//낙상순 정렬
module.exports.sortingFalling = function(layer, type, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE type = ? and layer=? and use_state = 1 and name is not null ORDER BY isFalling DESC";
		connection.query(query, [type, layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

//신호순 정렬
module.exports.sortingSignal = function(layer, type, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE type=? and layer=? and use_state = 1 and name is not null ORDER BY isActive DESC";
		connection.query(query, [type, layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
module.exports.sortingBattery = function(layer, type, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE type = ? and layer=? and use_state = 1 and name is not null ORDER BY battery ASC";
		connection.query(query, [type, layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
module.exports.sortingType = function(layer, type, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE type = ? and layer=? and use_state = 1 and name is not null ORDER BY Type DESC";
		connection.query(query, [type, layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
//layer별 맵 경로 요청(layer_map)
module.exports.getMap = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "select map from tbl_layer where layer = ?";
		connection.query(query, [layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
//웰태그 위치 정보 요청(welltag_id, loc_x, loc_y, isFalling)
module.exports.getLocationWelltag = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "select name, welltag_id, loc_x, loc_y, isFalling, isActive from tbl_welltag where layer = ? and use_state=1 and name is not null";
		connection.query(query, [layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);

			})
	})
}
//전체 착용 대상 웰태그 및 대상자 정보 요청
module.exports.allWelltagInfo = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT type, welltag_id, name, ward, isFalling, isActive, battery, layer, move, update_date "
					+"FROM tbl_welltag "
					+"where layer=? and use_state = 1 and name is not null ORDER BY isFalling DESC, isActive ASC";
		connection.query(query,[layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
//의료인 착용 웰태그 및 의료인 정보 요청
module.exports.medicalPersonWelltagInfo = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		var query = "select welltag_id, type, name, ward, isFalling, isActive, battery, move from tbl_welltag "
			+ "where layer=? and use_state = 1 and type = '의료인' and name is not null ORDER BY isFalling DESC, isActive ASC";
		connection.query(query,[layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
//의료기구 착용 웰태그 및 의료기구 정보 요청
module.exports.medicalEquimentWelltagInfo = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		var query = "select welltag_id, type, name, ward, isFalling, isActive, battery, move from tbl_welltag "
			+ "where layer=? and use_state = 1 and type = '의료기구' and name is not null ORDER BY isFalling DESC, isActive ASC"
		connection.query(query,[layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
//환자 착용 웰태그 요 및 환자 정보 요청
module.exports.patientWelltagInfo = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "select welltag_id, type, name, ward, isFalling, isActive, battery, move from tbl_welltag "
			+ "where layer=? and use_state = 1 and type = '환자' and name is not null ORDER BY isFalling DESC, isActive ASC"
		connection.query(query,[layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

module.exports.getActiveOffList = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		var query = "SELECT name, welltag_id, loc_x, loc_y FROM tbl_welltag where isActive = 0 and use_state = 1 and layer=? and name is not null"
		connection.query(query,[layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}
				callback(result);
			})
	})
}

//12  초기화
module.exports.resetFalling = function(welltag_id, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "update tbl_welltag set isFalling=0 where welltag_id=?"
		connection.query(query,[welltag_id],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				callback(true);
			})
	})
}

//14. 착용대상 수정 폼 초기 값 요청
module.exports.initWearingWelltagInfo = function(id, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		var query = "SELECT * "
					+"FROM tbl_welltag WHERE welltag_id = ? "
		connection.query(query,[id],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				callback(result);
			})
	})
}
module.exports.changeLayer = function(changeLayer, a, b, callback){
	// console.log("a : " + a)
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t2.layer = ? ORDER BY t1.falling_date DESC LIMIT ?, 15";
		var count_query = "select count(*) as count from tbl_welltag where layer = ?"
		connection.query(query+";"+count_query, [changeLayer, a, changeLayer], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback([result[0],result[1][0].count])
		})
	})
}
module.exports.allWearingWelltagInfo = function(layerSelect, a, b, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		
		var query = "SELECT * FROM tbl_welltag t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t2.layer = ? AND t1.use_state = 1 AND t1.name != '(NULL)' ORDER BY t1.isFalling DESC, t1.isActive ASC LIMIT ?, 15"
		var count_query = "SELECT count(*) AS count FROM tbl_welltag WHERE layer = ? AND name != '(NULL)'"			
		connection.query(query+";"+count_query, [layerSelect, a, layerSelect], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}
			// consol
			callback([result[0],result[1][0].count])
		})
	})
}
//17.사용하지 않는 웰태그 조회
module.exports.notUseWelltagInfo = function(callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "select * from tbl_welltag where use_state = 0"
		connection.query(query, [], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}

			callback(result);
		})
	})
}
module.exports.init_welltag_info = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "select * from tbl_welltag where use_state = 0";
		connection.query(query,[],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
//18. 착용 대상 웰태그 추가 요청
module.exports.addWearingWelltagInfo = function(seq, type, name, ward, modi_age, modi_gender, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "update tbl_welltag set type = ?, name = ?, ward = ?, age = ?, gender = ?, use_state = 1 where welltag_seq = ?";
		connection.query(query, [type, name, ward, modi_age, modi_gender, seq], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}

			callback(true);
		})
	})
}
module.exports.new_welltag_info = function(id, welltag_seq, new_id, modi_age, modi_gender, type, name, ward, layer, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		query = "update tbl_welltag set type = (NULL), name = (NULL), ward = (NULL), age = (NULL), use_state = 0 where welltag_seq = ?";
		var new_query = "update tbl_welltag set type = ?, name = ?, ward = ?, age = ?, gender = ?, layer= ?, use_state = 1 where welltag_id = ?";
		connection.query(query+";"+new_query, [welltag_seq, type, name, ward, modi_age, modi_gender, layer, new_id], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}
			console.log(result)
			callback(true);
		})
	})
}
//18-2 웰태그 사용여부 업데이트 1
module.exports.updateWelltagUseState = function(type, name, ward, age, gender, etc, patient_number, seq, layer, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		try {
			var query = "update tbl_welltag set type = ?, name=?, ward=?, age=?, gender=?, etc=?, patient_number=?, layer = ?, use_state = 1 where welltag_seq = ?";
			connection.query(query, [type, name, ward, age, gender, etc, patient_number, layer, seq], function(err, result) {
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				callback(true);
			})
		} catch(e) {
			console.log("updateWelltagUseState error");
			console.log("layer: " + layer + "," + name + "," + ward + "," + seq);
		}

	})
}
//18-3 윌태그 사용 여부 업데이트 0
module.exports.updateWelltagUseStateReset = function(tag_id, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "update tbl_welltag set use_state = 0, type = (null), name = (null), ward = (null) where welltag_id = ?";
		connection.query(query, [tag_id], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}

			callback(true);
		})
	})
}


module.exports.updateFalling = function(tagId, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "update tbl_welltag set isFalling = 1 where welltag_id = ?"
		connection.query(query, [tagId], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}

			callback(true);
		})
	})
}

//fallingDate 등록
module.exports.updateFallingDate = function(tagId, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(null);
			return;
		}

		var query = "UPDATE tbl_welltag SET falling_date = now() where welltag_id = ?"

		connection.query(query, [tagId], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(null);
				return;
			}

			callback(true);
		})
	})
}
//낙상로그 저장
module.exports.insertFallingLog = function(tagId, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(null);
			return;
		}

		var query = "INSERT INTO tbl_falling_log (falling_date, user_name, x, y, layer, state)  "
					+"SELECT falling_date, NAME, loc_x, loc_y, layer, isFalling "
					+"FROM tbl_welltag "
					+"WHERE welltag_id = ?";
		connection.query(query, [tagId], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(null);
				return;
			}

			callback(true)
		})
	})
}

module.exports.escapeInfo = function(){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(null);
			return;
		}

		var query = "";
		var select_query = ""
	})
}

//isFalling이 1일 경우 유지위한 DB
module.exports.fallingUpdateWelltagInfo = function(tagId, x, y, layer, battery, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(null);
			return;
		}

		// var query = "UPDATE tbl_welltag SET loc_x = ?, loc_y=?, layer = ?, battery = ? "
		// 	+ ", move = if(? = 1 and type != '의료기구', move + 3.4, move), isActive = 1, update_date = now() WHERE welltag_id = ?";
		// var select_query = "select welltag_id, type, name, ward, battery, move, isFalling as fail_down, isActive, layer, loc_x as x, loc_y as y "
		// 	+ " from tbl_welltag where layer = ? and use_state = 1 and welltag_id = ?"

		var query = "UPDATE tbl_welltag SET loc_x = ?, loc_y=?, layer = ?, battery = ? "
			+ ", isActive = 1, update_date = now() WHERE welltag_id = ?";
		var select_query = "select welltag_id, type, name, ward, battery, isFalling as fail_down, isActive, layer, loc_x as x, loc_y as y "
			+ " from tbl_welltag where layer = ? and use_state = 1 and welltag_id = ?"
		connection.query(query + ";" + select_query, [x, y, layer, battery, tagId, layer, tagId], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(null);
				return;
			}

			callback(result[1][0]);
		})
	})
}
// //rabbitMQ를 통해 넘어온 데이터 저장 기능
// module.exports.updateWelltagInfo = function(tagId, x, y, layer, isFalling, battery, move, callback){
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(null);
// 			return;
// 		}

// 		var query = "UPDATE tbl_welltag SET loc_x = ?, loc_y=?, layer = ?, isFalling = ?, battery = ? "
// 			+ ", move = if(? = 1, move + 3.4, move), isActive = 1, update_date = now() WHERE welltag_id = ?";
// 		var select_query = "select welltag_id, type, name, ward, battery, move, isFalling as fail_down, isActive, layer, loc_x as x, loc_y as y "
// 			+ " from tbl_welltag where layer = ? and use_state = 1 and welltag_id = ?"
// 		connection.query(query + ";" + select_query, [x, y, layer, isFalling, battery, move, tagId, layer, tagId], function(err, result){
// 			connection.release()

// 			if(err){
// 				console.log(err);
// 				callback(null);
// 				return;
// 			}

// 			callback(result[1][0]);
// 		})
// 	})
// }

module.exports.updateWelltagInfo2 = function(tagId, x, y, layer, isFalling, battery, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(null);
			return;
		}

		// var query = "UPDATE tbl_welltag SET loc_x = ?, loc_y=?, layer = ?, isFalling = ?, battery = ? "
		// 	+ ", move = if(? = 1 and type != '의료기구', move + 3.4, move), falling_date=now(), isActive = 1, update_date = now() WHERE welltag_id = ?";
		// var select_query = "select welltag_id, type, name, ward, battery, move, isFalling as fail_down, isActive, layer, loc_x as x, loc_y as y "
		// 	+ " from tbl_welltag where layer = ? and use_state = 1 and welltag_id = ?"

		var query = "UPDATE tbl_welltag SET loc_x = ?, loc_y=?, layer = ?, isFalling = ?, battery = ? "
			+ ", falling_date=now(), isActive = 1, update_date = now() WHERE welltag_id = ?";
		var select_query = "select welltag_id, type, name, ward, battery, isFalling as fail_down, isActive, layer, loc_x as x, loc_y as y "
			+ " from tbl_welltag where layer = ? and use_state = 1 and welltag_id = ?"
		connection.query(query + ";" + select_query, [x, y, layer, isFalling, battery, tagId, layer, tagId], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(null);
				return;
			}

			callback(result[1][0]);
		})
	})
}

//Count
// module.exports.getMonitoringCount = function(layer, callback){
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}
// 		var query = "SELECT COUNT(IF(isFalling=1,isFalling,NULL)) AS falling_count, COUNT(IF(isActive=0,isActive,NULL)) AS active_count FROM tbl_welltag WHERE layer = ?"
// 		connection.query(query, [layer], function(err, result){
// 			connection.release()

// 			if(err){
// 				console.log(err);
// 				callback(false);
// 				return;
// 			}

// 			// callback(true);
// 			callback(result);
// 		})
// 	})
// }

module.exports.moveInfo = function(tag_id, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "select move from tbl_welltag where welltag_id = ?"
		connection.query(query, [tag_id], function(err, result){
			connection.release();

			if(err){
				console.log(err);
				callback(false);
				return;
			}

			callback(result)
		})
	})
}

module.exports.accumMoveInfo = function(name, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT using_date, user_name, SUM(move) as move FROM tbl_move_log where user_name = ? GROUP BY user_name, using_date"
		connection.query(query, [name], function(err, result){
			connection.release();

			if(err){
				console.log(err);
				callback(false);
				return;
			}

			callback(result)
		})
	})
}


module.exports.selectLayer = function(user_id, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT layer FROM tbl_user WHERE user_id = ?"
		connection.query(query, [user_id], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}
			callback(result);
		})
	})
}

module.exports.userState = function(tag_id, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback({'isFalling': -1});
			return;
		}

		var query = connection.query("SELECT isFalling FROM tbl_welltag WHERE welltag_id = ?", [tag_id], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				console.log(query.sql);
				callback({'isFalling': -1});
				return;
			}
			// console.log(query.sql);
			if(result.length > 0)
				callback(result[0])
			else
				callback({'isFalling': -1})
		})
	})
}

module.exports.typeState = function(tag_id, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback({'type': -1});
			return;
		}

		var query = connection.query("SELECT type FROM tbl_welltag WHERE welltag_id = ?", [tag_id], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				// console.log(query.sql);
				callback({'type': -1});
				return;
			}

			if(result.length > 0)
				callback(result[0]);
			else
				callback({'type': -1});
		})
	})
}

module.exports.decubitusState = function(tag_id, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback({'isFalling': -1});
			return;
		}

		var query = "select isFalling from tbl_welltag where welltag_id = ?";
		connection.query(query, [tag_id], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback({'isFalling': -1});
				return;
			}

			if(result.length > 0)
				callback(result[0])
			else
				callback({'isFalling': -1})
		})
	})
}

module.exports.updateO2Welltag = function(tag_id, value, battery, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "UPDATE tbl_sensor_welltag SET o2 = ?, battery = ?, update_date = now() WHERE welltag_id = ?"
		var select_query = "select * from tbl_sensor_welltag where welltag_id = ?"
		connection.query(query+ ";" + select_query, [value, battery, tag_id, tag_id], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}
			// callback(result);
			callback(result[1][0])
		})
	})
}

module.exports.updateCoWelltag = function(tag_id, value, battery, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "UPDATE tbl_sensor_welltag SET co = ?, battery = ?, update_date = now() WHERE welltag_id = ?"
		connection.query(query, [value, battery, tag_id], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}
			// callback(result);
			callback(true)
		})
	})
}

module.exports.updateTempHumiWelltag = function(tag_id, value, value2, battery, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "UPDATE tbl_sensor_welltag SET temp = ?, humi = ?, battery = ?, update_date = now() WHERE welltag_id = ?"
		connection.query(query, [value, value2, battery, tag_id], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}
			// callback(result);
			callback(true)
		})
	})
}

module.exports.updateDustWelltag = function(tag_id, value, battery, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "UPDATE tbl_sensor_welltag SET dust = ?, battery = ?, update_date = now() WHERE welltag_id = ?"
		connection.query(query, [value, battery, tag_id], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
				return;
			}
			// callback(result);
			callback(true)
		})
	})
}

// 전체
module.exports.allSearchName = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE use_state = 1 ORDER BY NAME ASC"
		connection.query(query, [],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

module.exports.SearchFalling = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE use_state = 1 ORDER BY isFalling DESC"
		connection.query(query, [],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

module.exports.SearchActive = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE use_state = 1 ORDER BY isActive DESC"
		connection.query(query, [],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
module.exports.allSearchBattery = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE use_state = 1 ORDER BY battery ASC"
		connection.query(query, [],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
module.exports.allSearchType = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE use_state = 1 ORDER BY type DESC"
		connection.query(query, [],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}


//태그 정보 이름순
module.exports.searchName = function(type, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE type = ? AND use_state = 1 ORDER BY NAME ASC"
		connection.query(query, [type],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
//태그 정보 낙상순 정렬
module.exports.searchFalling = function(type, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE type = ? AND use_state = 1 ORDER BY isFalling DESC"
		connection.query(query, [type],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
//태그 정보 신호순 정렬
module.exports.searchSignal = function(type, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE type = ? AND use_state = 1 ORDER BY isActive DESC"
		connection.query(query, [type],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
module.exports.searchBattery = function(type, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE type = ? AND use_state = 1 ORDER BY battery ASC"
		connection.query(query, [type],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

module.exports.searchType = function(type, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag WHERE type = ? AND use_state = 1 ORDER BY type DESC"
		connection.query(query, [type],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}
module.exports.all_welltag_Wearing = function(layer, callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT TYPE, welltag_id, NAME, ward, isFalling, isActive, battery, layer FROM tbl_welltag WHERE layer=? AND use_state = 1 ORDER BY isFalling DESC, isActive ASC"
		connection.query(query, [layer],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}


module.exports.medical_person_welltag_Wearing = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT type, welltag_id, name, ward, isFalling, isActive, battery, layer FROM tbl_welltag WHERE use_state = 1 AND TYPE = '의료인' ORDER BY isFalling DESC, isActive ASC"
		connection.query(query, [],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

module.exports.medical_equiment_welltag_Wearing = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT type, welltag_id, name, ward, isFalling, isActive, battery, layer FROM tbl_welltag WHERE use_state = 1 AND TYPE = '의료기구' ORDER BY isFalling DESC, isActive ASC"
		connection.query(query, [],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

module.exports.patient_welltag_Wearing = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT type, welltag_id, name, ward, isFalling, isActive, battery, layer FROM tbl_welltag WHERE use_state = 1 AND TYPE = '환자' ORDER BY isFalling DESC, isActive ASC"
		connection.query(query, [],
			function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

//센서 태그 DB
module.exports.sensorTagLocation = function(layer, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "select welltag_id, loc_x, loc_y, layer from tbl_sensor_welltag where layer = ?"
		connection.query(query, [layer], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
			}
			callback(result)
		})
	})
}

module.exports.sensorTagTable = function(layer, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT tag_group, location, layer, SUM(o2) AS o2,  SUM(co) as co, SUM(temp) AS temp, SUM(humi) AS humi, SUM(dust) AS dust FROM tbl_sensor_welltag WHERE layer=? GROUP BY tag_group, layer, location"
		connection.query(query, [layer], function(err, result){
			connection.release()

			if(err){
				console.log(err);
				callback(false);
			}
			callback(result)
		})
	})
}

module.exports.checkDecubitus = function(tag_id, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback({'isFalling': -1});
			return;
		}

		var query = "select isFalling from tbl_welltag where tag_id = ";
		connection.query(query, [tag_id], function(err, result){

		})
	})
}

module.exports.searchFallingLogByName = function(keyword, type, layer, a, b, callback){
	keyword_a = "%"+keyword+"%";
	console.log(type)
	console.log(keyword)
	
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		if(type == 0){
			query = "SELECT * FROM tbl_welltag t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t2.layer = ? AND TYPE LIKE ? OR NAME LIKE ? OR ward LIKE ? ORDER BY t1.falling_date DESC LIMIT ?, 15";
			var count_query = "SELECT count(*) as count FROM (SELECT * FROM tbl_welltag WHERE type LIKE ? OR name LIKE ? OR ward LIKE ?)cnt WHERE layer = ?";
			query_value = [layer, keyword_a, keyword_a, keyword_a,  a, keyword_a,keyword_a,keyword_a, layer]
		} 
		else if(type == 1){
			query = "SELECT * FROM tbl_welltag t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t2.layer = ? AND TYPE LIKE ? ORDER BY t1.falling_date DESC LIMIT ?, 15";
			var count_query = "SELECT count(*) as count FROM (SELECT * FROM tbl_welltag WHERE type LIKE ?)cnt WHERE layer = ?";
			query_value = [layer, keyword_a, a, keyword_a, layer]
		}
		else if(type == 2){
			query = "SELECT * FROM tbl_welltag t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t2.layer = ? AND NAME LIKE ? ORDER BY t1.falling_date DESC LIMIT ?, 15";
			var count_query = "SELECT count(*) as count FROM (SELECT * FROM tbl_welltag WHERE name LIKE ?)cnt WHERE layer = ?";
			query_value = [layer, keyword_a, a, keyword_a, layer]
		}
		else if(type == 3){
			query = "SELECT * FROM tbl_welltag t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t2.layer = ? AND ward LIKE ? ORDER BY t1.falling_date DESC LIMIT ?, 15";
			var count_query = "SELECT count(*) as count FROM (SELECT * FROM tbl_welltag WHERE ward LIKE ?)cnt WHERE layer = ?";
			query_value = [layer, keyword_a, a, keyword_a, layer]
		}

		connection.query(query+";"+count_query, query_value, function(err, result){
			connection.release();

			if(err){
				console.log(err);
				callback(false)
			}
  
			callback([result[0], result[1][0].count])
			console.log([result[0], result[1][0].count])
		})
	})
}

module.exports.fallingLogInfo = function(a, b, callback){
	// console.log("a : " + a)
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "select * from tbl_welltag order by falling_date desc limit ?, 15";
		var count_query = "select count(*) as count from tbl_welltag"
		connection.query(query+";"+count_query, [a, b], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback([result[0],result[1][0].count])
		})
	})
}

module.exports.changeLayer = function(changeLayer, a, b, callback){
	// console.log("a : " + a)
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_welltag t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t2.layer = ? AND t1.use_state = 1 ORDER BY t1.falling_date DESC LIMIT ?, 15";
		var count_query = "select count(*) as count from tbl_welltag where layer = ?"
		connection.query(query+";"+count_query, [changeLayer, a, changeLayer], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback([result[0],result[1][0].count])
		})
	})
}

module.exports.escape = function(a, b, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}            
		var query = "SELECT * FROM tbl_welltag WHERE use_state = 1 AND isFalling = 6 AND NAME IS NOT NULL ORDER BY NAME ASC LIMIT ?, 5";
		var count_query = "SELECT count(*) AS count FROM tbl_welltag WHERE use_state = 1 AND isFalling = 6 AND NAME IS NOT NULL"
		connection.query(query+";"+count_query, [a, b], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback([result[0],result[1][0].count])
		})
	})
}

module.exports.escape_count = function(callback) {
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT count(*) AS count FROM tbl_welltag WHERE use_state = 1 AND isFalling = 6 AND NAME IS NOT NULL";
		connection.query(query,[],function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				// callback(true);
				callback(result);
			})
	})
}

module.exports.userEscapeState = function(tagId, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "select isFalling, name from tbl_welltag where welltag_id = ?";
		connection.query(query, [tagId], function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				callback(result);
		})
	})
}
// saveEscapeLog

module.exports.saveEscapeLog = function(tagId, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "insert into tbl_escape_log(welltag_id, name, x, y, layer, escape_date) select welltag_id, name, loc_x, loc_y, layer, now() from tbl_welltag where welltag_id = ?";
		connection.query(query, [tagId], function(err, result){
				connection.release()

				if(err){
					console.log(err);
					callback(false);
					return;
				}

				callback(true);
		})
	})
}
module.exports.insertWelltagLog = function(tagId, x, y, layer, fail_down, battery, escape, name, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		var query ="insert into tbl_welltag_log(welltag_id, loc_x, loc_y, layer, isFalling, battery, update_date, escape, name) values (?,?,?,?,?,?,now(),?,?)";
		connection.query(query, [tagId, x, y, layer, fail_down, battery, escape, name], function(err,result){
			connection.release();

			if(err){
				console.log(err);
				callback(false);
				return;
			}

			callback(true)
		})
	})
}
module.exports.userNameCheck = function(tagId, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		var query = "select name from tbl_welltag where welltag_id = ?";
		connection.query(query, [tagId], function(err, result){
			connection.release();

			if(err){
				console.log(err);
				callback(false);
				return;
			}

			callback(result)
		}) 
	})
}
module.exports.tracking = function(start, end, name, layer,  callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		// console.log(start)
		// console.log(end)
		// var query = "SELECT * FROM tbl_welltag_log WHERE NAME=? AND layer= ? AND update_date > CURRENT_DATE() GROUP BY HOUR(update_date) , FLOOR(MINUTE(update_date)/10) ORDER BY seq ASC";
		var query = "SELECT loc_x, loc_y, layer, COUNT(*) AS count, NAME, update_date FROM tbl_welltag_log WHERE update_date BETWEEN ? AND ? AND NAME = ? AND layer = ? GROUP BY loc_x, loc_y, layer;"
		connection.query(query, [start, end, name, layer], function(err, result){
			connection.release();

			if(err){
				console.log(err);
				callback(false);
				return;
			}
			// console.log(query)
			callback(result);
		})

	})
}
module.exports.selectTrackingDate = function(callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		// console.log(start)
		// console.log(end)
		// var query = "SELECT * FROM tbl_welltag_log WHERE NAME=? AND layer= ? AND update_date > CURRENT_DATE() GROUP BY HOUR(update_date) , FLOOR(MINUTE(update_date)/10) ORDER BY seq ASC";
		var query = "SELECT DATE_FORMAT(update_date, '%Y-%m-%d') AS update_date FROM tbl_welltag_log GROUP BY DATE_FORMAT(update_date, '%Y%m%d') ORDER BY update_date DESC LIMIT 7"
		connection.query(query, [], function(err, result){
			connection.release();

			if(err){
				console.log(err);
				callback(false);
				return;
			}
			// console.log(query)
			callback(result);
		})
	})
}
// module.exports.startTracking = function(name, layer, callback){
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}

// 		var query = "SELECT * FROM tbl_welltag_log WHERE NAME=? AND layer = ?AND update_date > CURRENT_DATE() GROUP BY HOUR(update_date) , FLOOR(MINUTE(update_date)/10) ORDER BY seq ASC  LIMIT 1;";
// 		connection.query(query, [name, layer], function(err, result){
// 			connection.release();

// 			if(err){
// 				console.log(err);
// 				callback(false);
// 				return;
// 			}

// 			callback(result);
// 		})

// 	})
// }
// module.exports.endTracking = function(name, layer, callback){
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}

// 		var query = "SELECT * FROM tbl_welltag_log WHERE NAME=? AND layer = ?AND update_date > CURRENT_DATE() GROUP BY HOUR(update_date) , FLOOR(MINUTE(update_date)/10) ORDER BY seq DESC  LIMIT 1;";
// 		connection.query(query, [name, layer], function(err, result){
// 			connection.release();

// 			if(err){
// 				console.log(err);
// 				callback(false);
// 				return;
// 			}

// 			callback(result);
// 		})

// 	})
// }

// module.exports.escapeTracking = function(name, layer, callback){
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}

// 		var query = "SELECT * FROM tbl_welltag_log WHERE NAME=? AND layer = ? AND ESCAPE = 1 AND update_date > CURRENT_DATE() ORDER BY seq ASC;";
// 		connection.query(query, [name, layer], function(err, result){
// 			connection.release();

// 			if(err){
// 				console.log(err);
// 				callback(false);
// 				return;
// 			}

// 			callback(result);
// 		})

// 	})
// }