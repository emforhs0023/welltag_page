var pool = require("../services/database").pool;

//1. 웰태그 정보 요청
module.exports.getAllWelltagInfo = function(callback) {
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query = "select welltag_seq, welltag_id, welltag_mac, battery, layer from tbl_welltag"
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
//2. 개별 웰태그 정보 요청
module.exports.getIndiWelltagInfo = function(seq, callback) {
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query = "select welltag_seq, welltag_id, welltag_mac, battery, layer from tbl_welltag where welltag_seq = ?"
        connection.query(query,[seq],
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
//3. 웰태그 추가 요청
module.exports.addWelltag = function(id, mac, callback) {
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query = "insert into tbl_welltag (welltag_id, welltag_mac) "
                    +"values (?, ?)"
        connection.query(query,[id, mac],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }

                callback(true);
                // callback(result);
            })
    })
}
//4. 웰태그 업데이트 요청
module.exports.updateWelltag = function(seq, id, mac, callback) {
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query = "update tbl_welltag set welltag_id=?, welltag_mac=? where welltag_seq =?"
        connection.query(query,[id, mac, seq],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }

                callback(true);
                // callback(result);
            })
    })
}
//5. 웰태그 삭제 요청
module.exports.deleteWelltag = function(seq, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="Delete from tbl_welltag where welltag_seq = ?"
        connection.query(query, [seq],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }

                callback(true);
                // callback(result);
            })
    })
}
//6-1 전체 layer요청 
module.exports.getAllLayer = function(callback) {
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query = "select * from tbl_layer"
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
//6-2 map요청
module.exports.getMap = function(layer, callback) {
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query = "select map from tbl_layer where layer = ?"
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
//6. 비콘 위치 요청(beacon_id, loc_x, loc_y)
module.exports.getLocationBeaconInfo = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="select beacon_seq, beacon_id, loc_x, loc_y from tbl_beacon where layer=?"
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
//7. 개별 비콘 정보 요청
module.exports.getIndiBeaconInfo = function(seq, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="select * from tbl_beacon where beacon_seq=?"
        connection.query(query, [seq],
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
//8. 비콘 추가 요청
module.exports.addBeacon = function(id, mac, x, y, layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        } 
        var query ="insert into tbl_beacon (beacon_id, beacon_mac, loc_x, loc_y, layer)"
                    +"values (?,?,?,?,?)"
        connection.query(query, [id, mac, x, y, layer],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }

                callback(true);
                // callback(result);
            })
    })
}
//9. 비콘 업데이트 요청
module.exports.updateBeacon = function(seq, layer, x, y, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="update tbl_beacon set loc_x=?, loc_y=?, "
                    +"layer=? where beacon_seq=?"
        connection.query(query, [x, y, layer, seq],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }

                callback(true);
                // callback(result);
            })
    })
}
module.exports.relocationBeaconInfo = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "select * from tbl_beacon_relocation where layer = ?";
        connection.query(query, [layer], function(err, result){
            if(err){
                console.log(err);
                callback(false);
                return;
            }

            callback(result);
        })
    })
}
module.exports.saveBeaconLocation = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "INSERT INTO tbl_beacon_relocation (seq, beacon_id, loc_x, loc_y, layer) "+
        "(SELECT beacon_seq, beacon_id, loc_x, loc_y, layer FROM tbl_beacon WHERE layer = ?)";
        connection.query(query, [layer], 
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }

                callback(true)
            })
    })
}

module.exports.deleteBeaconLocation = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "Delete from tbl_beacon_relocation where layer = ?";

        connection.query(query,[layer],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }

                callback(true)
            })
    })
}
//10. 비콘 삭제 요청
module.exports.deleteBeacon = function(id, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="Delete from tbl_beacon where beacon_id = ?"
        connection.query(query, [id],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }

                callback(true);
                // callback(result);
            })
    })
}

//11. 센서 태그 정보 요청
module.exports.sensortagInfo = function(callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="select * from tbl_sensor_welltag"
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

module.exports.sensortagInfo = function(callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="select * from tbl_sensor_welltag"
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

module.exports.sensortagInfo = function(callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="select * from tbl_sensor_welltag"
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

module.exports.addSensorTagInfo = function(tag_id, tag_group, location, layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="insert into tbl_sensor_welltag (welltag_id, tag_group, location, layer) "
                    +"values (?,?,?,?)"
        connection.query(query, [tag_id, tag_group, location, layer,],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }

                callback(true);
                // callback(result);
            })
    })
}
module.exports.modiSensorTagInfo = function(tag_id, tag_group, location, layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="update tbl_sensor_welltag set tag_group=?, location=?, layer=? where welltag_id = ?"
        connection.query(query, [tag_group, location, layer, tag_id],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }

                callback(true);
                // callback(result);
            })
    })
}
module.exports.delSensorTagInfo = function(tag_id, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="delete from tbl_sensor_welltag where welltag_id = ?"
        connection.query(query, [tag_id],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }

                callback(true);
                // callback(result);
            })
    })
}

//gateway

module.exports.gatewayInfo = function(callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="select * from tbl_gateway"
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
