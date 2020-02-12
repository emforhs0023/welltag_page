var pool = require("../services/database").pool;

//유저 정보
module.exports.alrequestapprovalInfo = function(callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query ="select * from tbl_user"
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

module.exports.signinAdmin = function(id, pwd, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return
        }
        var query = "select auth, approve_state from tbl_user where user_id = ? and user_password=? Group by auth, approve_state"
        connection.query(query,[id, pwd],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err);
                    callback(false, null, null)
                }

                var rows = result.length;
                if(rows>0){
                    if(result[0]["approve_state"] == 1){
                        callback(true, result[0]["auth"], result[0]["approve_state"]);    
                    }else{
                        callback(true, null, result[0]["approve_state"]);
                    }
                } else {
                    callback(false, null, null)
                }
            })
    })
}
module.exports.doubleCheck = function(id, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return
        }

        var query = "select count(*) as count from tbl_user where user_id = ?"
        connection.query(query,[id],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err)
                    callback(false)
                }

                if(result[0]["count"]>0){     
                    callback(false)
                }else{
                    callback(true)
                }
            })
    })
}
module.exports.InsertUserInfo = function(id, pw, name, sex, phone, position, layer, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return
        }

        var query = "INSERT INTO tbl_user (user_id, user_password, user_name, user_sex, user_phone, user_position, layer) "
                    +"VALUES (?,?,?,?,?,?,?)"       
        connection.query(query,[id, pw, name, sex, phone, position, layer],
            function(err, result){
                connection.release()

                if(err){
                    console.log(err)
                    callback(false)
                }

                callback(true)
            })
    })
}

// 병진 작업
module.exports.initApproveInfo = function(id, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return
        }

        var query = "select * from tbl_user where user_id = ?"
        connection.query(query,[id],
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


module.exports.updataApproveInfo = function(id, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return
        }

        var query = "UPDATE tbl_user SET approve_state=1 WHERE user_id=?"
        connection.query(query,[id],
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

module.exports.deleteApproveInfo = function(id, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return
        }

        var query = "DELETE FROM tbl_user WHERE user_id = ?"
        connection.query(query,[id],
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

module.exports.getAllLayer = function(callback) {
    pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        var query = "select layer from tbl_layer"
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