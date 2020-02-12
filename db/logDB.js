var pool = require("../services/database").pool;

module.exports.fallingLogInfo = function(a, b, callback){
	// console.log("a : " + a)
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}            
		var query = "SELECT * FROM tbl_falling_log t1 JOIN tbl_layer t2 ON t1.layer = t2.layer where t1.user_name is not null order by falling_date desc limit ?, 15";
		var count_query = "select count(*) as count from tbl_falling_log where user_name is not null"
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

module.exports.fallingNameInfo = function(callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT user_name FROM tbl_falling_log GROUP BY user_name";
		connection.query(query, [], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback(result)
		})
	})
}


// module.exports.dateFallingLogInfo = function(date, a, b, callback){
// 	// console.log(date)
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}
// 		var query = "SELECT * FROM tbl_falling_log WHERE DATE(falling_date) = ? order by falling_date DESC LIMIT ?, 15";
// 		var count_query = "select count(*) as count from tbl_falling_log WHERE DATE(falling_date) = ?" 
// 		connection.query(query+";"+count_query, [date, a, date], function(err,result){
// 			connection.release()

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}
// 			// console.log(result[0])
// 			callback([result[0],result[1][0].count])
// 		})
// 	})
// }
// module.exports.nameFallingLogInfo = function(name, a, b, callback){
// 	// console.log(name)
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}
// 		var query = "SELECT * FROM tbl_falling_log ORDER BY falling_date DESC LIMIT ?, 15";
// 		var count_query = "SELECT COUNT(user_name) AS COUNT FROM tbl_falling_log" 
// 		connection.query(query+";"+count_query, [name, a, name], function(err,result){
// 			connection.release()

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}
// 			// console.log([result[0],result[1][0].count])
// 			callback([result[0],result[1][0].count])
// 		})
// 	})
// }
// module.exports.allSetTimeInfo = function(date, a, b, callback){
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}
// 		var query = "SELECT * FROM tbl_falling_log WHERE DATE(falling_date) = ? order by falling_date desc LIMIT ?, 15";
// 		var count_query = "select count(*) as count from tbl_falling_log WHERE DATE(falling_date) = ?" 
// 		connection.query(query+";"+count_query, [date, a, date], function(err,result){
// 			connection.release()

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}

// 			callback([result[0],result[1][0].count])
// 		})
// 	})
// }
// module.exports.allfallingSetTime = function(a, b, callback){
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}
// 		var query = "select * from tbl_falling_log where state = 1 order by falling_date desc LIMIT ?, 15";
// 		var count_query = "select count(*) as count from tbl_falling_log where state = 1"
// 		connection.query(query+";"+count_query, [a], function(err,result){
// 			connection.release()

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}

// 			callback([result[0],result[1][0].count])
// 		})
// 	})
// }

// module.exports.allBedsoreSetTime = function(a, b, callback){
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}
// 		var query = "select * from tbl_falling_log where state = 3 order by falling_date desc  LIMIT ?, 15";
// 		var count_query = "select count(*) as count from tbl_falling_log where state = 3"
// 		connection.query(query+";"+count_query, [a], function(err,result){
// 			connection.release()

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}

// 			callback([result[0],result[1][0].count])
// 		})
// 	})
// }

module.exports.fallingSetTime = function(date, a, b, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_falling_log t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t1.user_name IS NOT NULL AND t1.state = 1 ORDER BY falling_date DESC LIMIT ?, 15"
		var count_query = "select count(*) as count from tbl_falling_log WHERE state = 1"
		connection.query(query+";"+count_query, [a], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}
			// console.log(result)
			callback([result[0],result[1][0].count])
		})
	})
}

module.exports.bedsoreSetTime = function(date, a, b, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_falling_log t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t1.user_name IS NOT NULL AND t1.state = 3 ORDER BY falling_date DESC LIMIT ?, 15";
		var count_query = "select count(*) as count from tbl_falling_log WHERE state = 3";
		connection.query(query+";"+count_query, [a], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}
			// console.log(result)
			callback([result[0],result[1][0].count])
		})
	})
}

// module.exports.allLayerTime = function(time, layer, a, b, callback){
// 	console.log(layer)
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}
// 		var query = "select * from tbl_falling_log where state = 1 order by falling_date desc  LIMIT ?, 15";
// 		var count_query = "select count(*) as count from tbl_falling_log"
// 		// 둘다 all 일때 
// 		if(time == "all" && layer == -1){
// 			// var query = "select * from tbl_falling_log where state = 1 order by falling_date desc  LIMIT ?, 15";
// 			// var count_query = "select count(*) as count from tbl_falling_log where state = 1"
// 			query + "order by falling_date desc  LIMIT ?, 15"
// 			count_query
// 			query_value = [a]
// 		} else if(time == "all" && layer != -1){ // 시간은 all 이고 layer가 있을때
// 			var query = "select * from tbl_falling_log where state = 1 and layer = ? order by falling_date desc  LIMIT ?, 15";
// 			var count_query = "select count(*) as count from tbl_falling_log where state = 1"
// 			query_value = [layer , a]
// 		}
// 		connection.query(query+";"+count_query, query_value, function(err,result){
// 			connection.release()

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}
// 			console.log([result[0],result[1][0].count])
// 			callback([result[0],result[1][0].count])
// 		})
// 	})
// }
// module.exports.allTimeNotAllLayer = function(layer, time, a, b, callback){
// 	// console.log(layer)
// 	// console.log(time)
// 	pool.getConnection(function(err, connection){
// 		if(err){ 
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}
// 		var query = "select * from tbl_falling_log where state = 1 and layer = ? order by falling_date desc  LIMIT ?, 15";
// 		var count_query = "select count(*) as count from tbl_falling_log where state = 1"

// 		connection.query(query+";"+count_query, [layer, a], function(
// 			err,result){
// 			connection.release()

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}
// 			console.log([result[0],result[1][0].count])
// 			callback([result[0],result[1][0].count])
// 		})
// 	})
// }
// module.exports.LayerSetTime = function(layer, time, a, b, callback){
// 	// console.log(layer)
// 	// console.log(time)
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}
// 		if(time != "all" && layer == -1){
// 			query = "SELECT * FROM tbl_falling_log WHERE state = 1 AND DATE(falling_date) = ? order by falling_date desc LIMIT ?, 15";
// 			var count_query = "select count(*) as count from tbl_falling_log WHERE state = 1 AND DATE(falling_date) = ? "
// 			query_value = [time, a, time]
// 		}
// 		else if(time != "all" && layer != -1){
// 			query = "SELECT * FROM tbl_falling_log WHERE state = 1 AND DATE(falling_date) = ? AND layer = ? order by falling_date desc LIMIT ?, 15";
// 			var count_query = "select count(*) as count from tbl_falling_log WHERE state = 1 AND DATE(falling_date) = ? AND layer = ?"
// 			query_value = [time, layer, a ,time, layer]
// 		}
		
// 		connection.query(query+";"+count_query, query_value, function(err,result){
// 			connection.release()

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}
// 			// console.log([result[0],result[1][0].count])
// 			callback([result[0],result[1][0].count])
// 		})
// 	})
// }








// module.exports.viewDetails = function(vdTime, vdLayer, vdName, a, b, callback){
// 	vdTime = vdTime;
// 	vdLayer = vdLayer;
// 	vdName = "%"+vdName+"%";

// 	console.log(vdTime)
// 	console.log(vdLayer)
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}

// 		// if(vdTime == -1 && vdLayer == -1){
// 		// 	query = "select * from tbl_falling_log order by falling_date desc LIMIT ?, 15";
// 		// 	var count_query = "select count(*) as count from tbl_falling_log";
// 		// 	query_value = [a]
// 		// }
// 		if(vdName){
// 			query = "select * from tbl_falling_log where user_name like ? order by falling_date desc LIMIT ?, 15";
// 			var count_query = "select count(*) as count from tbl_falling_log where user_name like ?";
// 			query_value = [vdName, a , vdName]
// 		} 
// 		else if(vdTime == -1 && vdLayer){
// 			query = "select * from tbl_falling_log where layer = ? order by falling_date desc LIMIT ?, 15";
// 			var count_query = "select count(*) as count from tbl_falling_log where user_name layer = ?";
// 			query_value = [vdLayer, a , vdLayer]
// 		}

// 		connection.query(query+";"+count_query, query_value, function(err, result){
// 			connection.release();

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}
// 			console.log([result[0], result[1][0].count])
// 			callback([result[0], result[1][0].count])
// 		})
// 	})
// }

module.exports.selectDate = function(callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT DATE_FORMAT(falling_date, '%Y-%m-%d') AS falling_date_format FROM tbl_falling_log GROUP BY DATE_FORMAT(falling_date, '%Y-%m-%d') ";
		connection.query(query, [], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback(result)
		})
	})
}


module.exports.req_layer_map = function(layer, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT map FROM tbl_layer WHERE layer = ?";
		connection.query(query, [layer], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback(result)
		})
	})
}

// module.exports.viewDetails = function(vdName, a, b, callback){
	
// 	// console.log(vdTime)
// 	// console.log(vdLayer)

// 	vdName_a = "%"+vdName+"%";
	
	
	


// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}

		// if(vdTime){
		// 	query = "select * from tbl_falling_log where DATE(falling_date) = ? order by falling_date desc LIMIT ?, 15";
		// 	var count_query = "select count(*) as count from tbl_falling_log where DATE(falling_date) = ?";
		// 	query_value = [vdTime_a, a, vdTime_a]
		// } else if(vdLayer){
		// 	query = "SELECT * FROM tbl_falling_log WHERE layer LIKE ? ORDER BY falling_date DESC LIMIT ?, 15";
		// 	var count_query = "select count(*) as count from tbl_falling_log where layer like ?";
		// 	query_value = [vdLayer_a, a, vdLayer_a]
		// }
		//  if(vdName){
		// 	query = "SELECT * FROM tbl_falling_log WHERE user_name LIKE ? ORDER BY falling_date DESC LIMIT ?, 15";
		// 	var count_query = "select count(*) as count from tbl_falling_log where user_name like ?";
		// 	query_value = [vdName_a, a, vdName_a]
		// } 
		// else if(vdCondition){
		// 	query = "SELECT * FROM tbl_falling_log WHERE state = ? ORDER BY falling_date DESC LIMIT ?, 15";
		// 	var count_query = "select count(*) as count from tbl_falling_log where state = ?";
		// 	query_value = [vdCondition_a, a, vdCondition_a]
		// }

		// if(vdtime == "" && vdLayer_a =="" && vdName =="" && vdCondition_a == ""){
		// 	query = "select * from tbl_falling_log order by falling_date desc LIMIT ?, 15";
		// 	var count_query = "select count(*) as count from tbl_falling_log";
		// 	query_value = [vdTime_a, a, vdTime_a]
		// }else{
		// 	if(vdTime){
		// 		var time = "DATE(falling_date) = "+vdTime_a;	
		// 	}
		// 	if(vdLayer){
		// 		var layer = "layer = "+vdLayer_a;	
		// 	}
		// 	if(vdName){
		// 		var name = "user_name =" + vdName_a;	
		// 	}
		// 	if(vdCondition){
		// 		var condition = "state=" + vdCondition_a;	
		// 	}
	
		// 	query = "select * from tbl_falling_log where"+time+	
		// 	var count_query = "select count(*) as count from tbl_falling_log";
		// 	query_value = [vdTime_a, a, vdTime_a]
		// }

		

		
// 		connection.query(query+";"+count_query,query_value, function(err, result){
// 			connection.release();

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}
// 			console.log([result[0], result[1][0].count])
// 			callback([result[0], result[1][0].count])
// 		})
// 	})
// }
module.exports.selectLayer = function(callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT layer FROM tbl_falling_log GROUP BY layer";
		connection.query(query, [], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback(result)
		})
	})
}

module.exports.searchFallingLogByName = function(keyword, a, b, callback){
	keyword_a = "%"+keyword+"%";
	// console.log(date)
	// console.log(state)
	
	
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}

		// console.log("ok")
		query = "select * from tbl_falling_log where user_name like ?  order by falling_date desc LIMIT ?, 15";
		var count_query = "select count(*) as count from tbl_falling_log where user_name like ?";
		query_value = [keyword_a, a, keyword_a]
		
			
		
		connection.query(query+";"+count_query, query_value, function(err, result){
			connection.release();

			if(err){
				console.log(err);
				callback(false)
			}
			console.log([result[0], result[1][0].count])
			callback([result[0], result[1][0].count])
		})
	})
}

// module.exports.searchName = function(time, layer, nameKeyword, a, b, callback){
// 	knameKeyword_a = "%"+nameKeyword+"%";
// 	// console.log(time)
// 	// console.log(layer)
// 	console.log(knameKeyword_a)
	
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}

// 		// var query = "SELECT * FROM tbl_falling_log"
// 		// var count_query = "SELECT count(*) AS count FROM tbl_falling_log WHERE state = 1 AND user_name LIKE ?"

// 		// 시간과 층이 둘다 전체 일때 
// 		if(time == "all" && layer == -1){
// 			query = "SELECT * FROM tbl_falling_log WHERE state = 1 AND user_name LIKE ? ORDER BY falling_date DESC  LIMIT ?, 15"
// 			var count_query = "SELECT count(*) AS count FROM tbl_falling_log WHERE state = 1 AND user_name LIKE ?"
// 			query_value = [knameKeyword_a, a, knameKeyword_a]
// 		}
// 		// 시간이 전체 이고 층이 전체가 아닐때
// 		else if(time == "all" && layer != -1){
// 			query = "SELECT * FROM tbl_falling_log WHERE state = 1 AND layer = ? AND user_name LIKE ? ORDER BY falling_date DESC  LIMIT ?, 15"
// 			var count_query = "SELECT count(*) AS count FROM tbl_falling_log WHERE state = 1 AND layer = ? AND user_name LIKE ?"
// 			query_value = [layer, knameKeyword_a, a, layer, knameKeyword_a]
// 		}
// 		// 층이 전체이고 시간이 전체가 아닐때  
// 		else if(time != "all" && layer == -1){
// 			query = "SELECT * FROM tbl_falling_log WHERE state = 1 AND DATE(falling_date) = ? AND user_name LIKE ? ORDER BY falling_date DESC  LIMIT ?, 15"
// 			var count_query = "SELECT count(*) AS count FROM tbl_falling_log WHERE state = 1 AND DATE(falling_date) = ? AND user_name LIKE ?"
// 			query_value = [time, knameKeyword_a, a, time, knameKeyword_a]
// 		}
// 		// 층과 시간이 아닐때 
// 		else if(time != "all" && layer != -1){
// 			query = "select * from tbl_falling_log where state = 1 AND DATE(falling_date) = ? AND layer = ? AND user_name LIKE ? ORDER BY falling_date DESC  LIMIT ?, 15"
// 			var count_query = "SELECT count(*) AS count FROM tbl_falling_log WHERE state = 1 AND DATE(falling_date) = ? AND layer = ? AND user_name LIKE ?"
// 			query_value = [time, layer, knameKeyword_a, a, time, layer, knameKeyword_a]
// 		}

// 		connection.query(query+";"+count_query, query_value, function(err, result){
// 			connection.release();

// 			if(err){
// 				console.log(err);
// 				callback(false)
// 			}
// 			console.log([result[0], result[1][0].count])
// 			callback([result[0], result[1][0].count])
// 		})
// 	})
// }

module.exports.escapeInfo = function(a, b, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_escape_log ORDER BY escape_date DESC LIMIT ?, 15";
		var count_query = "select count(*) AS count FROM tbl_escape_log where name is not null"
		connection.query(query+";"+count_query, [a], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback([result[0],result[1][0].count])
		})
	})
}
module.exports.distributionLayer = function(callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_layer";
		connection.query(query, [], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback(result)
		})
	})
}
module.exports.allFallingInfo = function(layer, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT x, y, count(*) AS count, layer FROM tbl_falling_log WHERE layer = ? AND falling_date > CURRENT_DATE() GROUP BY x, y";
		connection.query(query, [layer], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback(result)
		})
	})
}

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
module.exports.selectDate = function(callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT DATE_FORMAT(falling_date, '%Y-%m-%d') AS falling_date_format FROM tbl_falling_log GROUP BY DATE_FORMAT(falling_date, '%Y-%m-%d') ORDER BY falling_date_format DESC ";
		connection.query(query, [], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback(result)
		})
	})
}
// module.exports.changeFallingName = function(name, callback) {
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			console.log(err);
// 			callback(false);
// 			return;
// 		}
// 		var query = "SELECT x,y, count(*) AS count, layer, user_name FROM tbl_falling_log WHERE layer = 3  AND user_name = ? AND falling_date GROUP BY x,y";
// 		connection.query(query, [name],
// 			function(err, result){
// 				connection.release()

// 				if(err){
// 					console.log(err);
// 					callback(false);
// 					return;
// 				}

// 				// callback(true);
// 				callback(result);
// 			})
// 	})
// }

module.exports.timeFallingInfo = function(date, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		var query = "SELECT * FROM tbl_falling_log WHERE DATE(falling_date) = ?";
		connection.query(query, [date], function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback(result)
		})
	})
}


module.exports.dotFallingLog = function(time, layer, name, callback){
	pool.getConnection(function(err, connection){
		if(err){
			console.log(err);
			callback(false);
			return;
		}
		if(name == "all"){
			var query = "SELECT x, y, count(*) AS count, layer, user_name FROM tbl_falling_log WHERE state = 1 AND DATE(falling_date) = ? AND layer = ? GROUP BY x, y, user_name";		
			var query_data = [time, layer]
		}else{
			var query = "SELECT x, y, count(*) AS count, layer, user_name FROM tbl_falling_log WHERE state = 1 AND DATE(falling_date) = ? AND layer = ? AND user_name = ? GROUP BY x, y";
			var query_data = [time, layer, name]				
		}
		
		connection.query(query, query_data, function(err,result){
			connection.release()

			if(err){
				console.log(err);
				callback(false)
			}

			callback(result)
		})
	})
}