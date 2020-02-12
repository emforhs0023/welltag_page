
$(function(){
	initTable()
	setInterval(function(){
		initTable();
    }, 30000)
})

function initTable(){
	$.ajax({
		url:"/system/gatewayInfo",
		method:"get",
		contentType:"application/json",
		success:function(data){
			console.log(data)
			var TableList = data;

			for(var i = 0; i<TableList.length; i++){
				var row = TableList[i]
				// console.log(row)
				pingTime = new Date(row["ping_time"]);
				var pingTime_format = moment(pingTime).format("YYYY/MM/DD   HH:mm:ss");
				row["ping_time"] = pingTime_format
			}
		    table = $("#gateway_table").DataTable({
		        "destroy":true,
		        "ordering":false,
		        "searching": false,
		        "info": false, 
		      	"bLengthChange": false,  
		        "data": TableList,
		        "paging": true,
				"pageLength": 14, 
		        "columns":[
		            {"data":"gateway_num", "width":"150px"},
		          	{"data":"ping_time", "width":"250px"},
		            {"data":"notification", "width":"150px"}
		        ]
		    })
		}
	})
}