var pool = require("../services/database").pool;

module.exports.layerinfo = function(callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "SELECT * FROM tbl_layer";
        connection.query(query,[], function(err,  result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }

                callback(result);
            }
        ) 
    })
}

module.exports.getMap = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "SELECT map FROM tbl_layer where layer = ?";
        connection.query(query,[layer], function(err,  result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }

                callback(result);
            }
        ) 
    })
}

module.exports.welltaginfo = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "SELECT * FROM tbl_welltag t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t2.layer = ?";
        connection.query(query,[layer], function(err,  result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }

                callback(result);
            }
        ) 
    })
}

module.exports.gatewayinfo = function(callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "select * from tbl_gateway";
        connection.query(query,[], function(err,  result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }

                callback(result);
            }
        ) 
    })
}

module.exports.beaconInfo = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "SELECT * FROM tbl_beacon t1 JOIN tbl_layer t2 ON t1.layer = t2.layer WHERE t2.layer = ?";
        connection.query(query,[layer], function(err,  result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }

                callback(result);
            }
        ) 
    })
}
module.exports.membershipInfo = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "select * from tbl_user where layer = ?";
        connection.query(query,[layer], function(err,  result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }
                console.log(result)
                callback(result);
            }
        ) 
    })
}

module.exports.permissionInfo = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "SELECT * FROM tbl_user WHERE approve_state = 0 AND layer = ? ";
        connection.query(query,[layer], function(err,  result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }
                console.log(result)
                callback(result);
            }
        ) 
    })
}

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

module.exports.save_information = function(select_choice, id, name, layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        
        if(select_choice == "beacon"){
            var query ="update tbl_beacon set beacon_id = ? ,beacon_name = ?, layer = ? where beacon_id = ?"
            query_value = [id, name, layer, id]    
        } else if(select_choice == "welltag") {
            var query ="update tbl_welltag set welltag_id = ? ,welltag_mac = ?, layer = ? where welltag_id = ?"
            query_value = [id, name, layer, id]    
        } else if(select_choice == "gateway") {
            var query ="update tbl_gateway set gateway_id = ? where gateway_id = ?"
            query_value = [id, id]    
        }
        
        connection.query(query, query_value,
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

module.exports.delete_information = function(select_choice, id, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        if(select_choice == "beacon"){
            var query ="Delete from tbl_beacon where beacon_id = ?"
            query_value = [id]
        } else if(select_choice == "welltag") {
            var query ="Delete from tbl_welltag where welltag_id = ?"
            query_value = [id]
        } else if(select_choice == "gateway") {
            var query ="Delete from tbl_gateway where gateway_id = ?"
            query_value = [id]
        }
        
        connection.query(query, query_value,
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

