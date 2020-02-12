var pool = require("../services/database").pool;

module.exports.getLayer = function(callback){
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
                    return
                }
                
                callback(result);
            }
        ) 
    })
}
module.exports.getMapImg = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "select map from tbl_layer where layer= ?";
        connection.query(query,[layer],
            function(err, result){
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
module.exports.getWelltagInfo = function(callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "select * from tbl_welltag";
        connection.query(query,[],
            function(err, result){
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


module.exports.getNoWearPatientInfo = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "SELECT * FROM tbl_patient WHERE patient_layer = ? && welltag_seq = 0";
        connection.query(query,[layer],
            function(err, result){
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

module.exports.getWearPatientInfo = function(layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "SELECT t1.seq, t1.name, t1.patient_number, t1.age, t1.phone_number, t1.gender, t1.etc, t1.ward, t2.welltag_id, t2.loc_x, t2.loc_y, t2.isFalling, t2.battery, t2.isActive, t2.move FROM tbl_patient t1 JOIN tbl_welltag t2 ON t1.welltag_seq = t2.welltag_seq WHERE t2.layer = ? and use_state = 1";
        connection.query(query,[layer],
            function(err, result){
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

module.exports.availableWelltag = function(callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "SELECT * FROM tbl_welltag where use_state = 0";
        connection.query(query,[],
            function(err, result){
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

module.exports.regiPatient= function(name, age, gender, patient_number, phone_number, ward, etc, patient_layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "INSERT INTO tbl_patient(NAME, age, gender, phone_number, patient_number, ward, etc, patient_layer) VALUES (?,?,?,?,?,?,?,?);";
        connection.query(query,[name, age, gender, phone_number, patient_number, ward, etc, patient_layer],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }
                
                callback(true);
            }
        )
    })
}


module.exports.modiPatient= function(seq, name, age, gender, patient_number, phone_number, ward, etc, patient_layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "update tbl_patient set name = ?, age= ?, gender = ?, patient_number = ?, phone_number = ?, ward = ?, etc = ?, patient_layer = ? where seq = ? ";
        connection.query(query,[name, age, gender, patient_number, phone_number, ward, etc, patient_layer, seq],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }
                
                callback(true);
            }
        )
    })
}
module.exports.regiWearInfo= function(no, seq, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "update tbl_patient set welltag_seq = ? where seq = ?";
        var query2 = "update tbl_welltag set use_state = 1 where welltag_seq = ?";
        connection.query(query+";"+query2,[seq, no, seq],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }
                
                callback(true);
            }
        )
    })
}
module.exports.modiWearInfo= function(no, use_welltag, seq, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "update tbl_patient set welltag_seq = ? where seq = ?";
        var query2 = "update tbl_welltag set use_state = 0 where welltag_id = ?";
        var query3 = "update tbl_welltag set use_state = 1 where welltag_seq = ?";
        connection.query(query+";"+query2+";"+query3,[seq, no, use_welltag, seq],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }
                
                callback(true);
            }
        )
    })
}



module.exports.delWearInfo= function(no, use_welltag, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "update tbl_patient set welltag_seq = 'null' where seq = ?";
        var query2 = "update tbl_welltag set use_state = 0 where welltag_id = ?";
        connection.query(query+";"+query2,[no, use_welltag],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }
                
                callback(true);
            }
        )
    })
}

module.exports.delPatient= function(seq, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }

        var query = "delete from tbl_patient where seq = ?";
    
        connection.query(query,[seq],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false);
                    return
                }
                
                callback(true);
            }
        )
    })
}
