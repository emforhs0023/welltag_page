var deleteApprove = "<button  id='deleteApprove' class = 'reset_btn'>삭제</button>"
var waitingApprove = "<button  id='waitingApprove' class = 'reset_btn'>승인</button><button class = 'reset_btn' id='deleteApprove'>삭제</button>"

$(function() {
	$.ajax({
		url:"/login/user_Info",
		contentType:"application/json",
		method:"get",
		success:function(data){
			// console.log(data)
			var TableList = data

			for(var i=0; i<TableList.length; i++){
				var row = TableList[i]

				if(row["approve_state"] == 1){
					row["approve_state_btn"] = deleteApprove
				} else{
					row["approve_state_btn"] = waitingApprove
				}
			}

			table = $("#requestTable").DataTable({
				"destroy":true,
	            "ordering": false,
	            "searching": false,
	            "info": false, 
	            "data": TableList,
	            "paging": false,
				"columns":[
				    {"data":"user_id","width":"120px"},
				    {"data":"user_name","width":"120px"},
				    {"data":"user_phone","width":"120px"},
				    {"data":"user_position","width":"120px"},
				   	{"data":"layer","width":"120px"},
				    {"data":"approve_state_btn","width":"120px"},
				    // {"defaultContent": "<button  id='modi_btn' class = 'reset_btn'>승인</button><button class = 'reset_btn'>삭제</button>","width":"120px"}
				], 	
			});
			$("#requestTable").on("click","#waitingApprove",function(){
				var data = table.row($(this).parents("tr")).data()
				var user_id = data.user_id;
				$("#confirm_approve").dialog({
					height:"auto",
					width:"400px",
					modal : true,
					buttons: {
						"btn1" : {
							text : "확인",
							id : "update_approve",
							click:function(){
								$.ajax({
									url:"/login/updata_approve",
									method:"put",
									data:JSON.stringify(data),
									contentType:"application/json",
									success:function(data){
										// console.log(data)
										if(data){
											alert("승인되었습니다");
											location.href = "/system/requestapproval"
										}else{
											alert("승인이 실패되었습니다");
										}
										
									}
								}) 
							}
						},
						"btn2" : {
							text : "취소",
							id : "update_cancel",
							click:function(){
								$( this ).dialog( "close" );
							}
						}
					}
				})			
			})
			$("#requestTable").on("click","#deleteApprove",function(){
				var data = table.row($(this).parents("tr")).data()
				var user_id = data.user_id; 
				$("#delete_approve").dialog({
					height:"auto",
					width:"400px",
					modal : true,
					buttons: {
						"btn1" :{
							text : "확인",
							id : "success_approve",
							click:function(){
								$.ajax({
									url:"/login/delete_approve?user_id="+user_id,
									method:"delete",
									contentType:"application/json",
									success:function(data){
										if(data){
											alert("삭제 되었습니다");
											location.href = "/system/requestapproval"
										}else{
											alert("삭제가 실패되었습니다");
										}
									}
								})
							}
						},
						"btn2" :{
							text : "취소",
							id : "delete_approve",
							click:function(){
								$( this ).dialog( "close" );
							}
						}
					}
				})
			})
		}
	})
})	
			
