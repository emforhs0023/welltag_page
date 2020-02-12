var schedule = require("node-schedule");
var pool = require("./database.js").pool;

module.exports.startSchedule = function() {
    var job = schedule.scheduleJob('*/30 * * * *', function() {
        
            pool.getConnection(function(err, connection){
                if(err){
                    console.log(err);
                    callback(false);
                    return;
                }
        
                var unActive_update ="UPDATE tbl_welltag SET isActive = 0 WHERE DATE_ADD(update_date, INTERVAL 30 MINUTE) < NOW()";
                connection.query(unActive_update, [],
                    function(err, result){
                        connection.release()
                        if(err){
                            console.log(err);
                            return;
                        }
                    })
            })
        }
    )
}

