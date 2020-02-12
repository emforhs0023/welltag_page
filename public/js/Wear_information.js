var isfalling = "<p style='color:red'>낙상</p>"
var decubitus = "<p style='color:#3fbd3f'>욕창</p>"
var nofalling = "<p>정상</p>"
var active_on  = "<p>ON</p>"
var active_off  = "<p style='color:red'>OFF</p>"
var active_off  = "<p style='color:red'>OFF</p>"
var gender_one  = "<p>여자</p>"
var gender_zero  = "<p>남자</p>"
var low_battery = "<p style = 'color:red'>교체 요망</p>"

$(function() {

	layer_type = location.href.split("=")[1];
	
	user_id = {"user_id":user_id}
	// console.log(user_id)

    $.ajax({
		url:"/monitoring/req_layer",
        contentType:"application/json",
        method:"get",
        success:function(data){
        	// console.log(data)
        	for(var i = 0; i<data.length; i++){
                // console.log(data[i].layer)
                var layer = data[i].layer
              	var location = data[i].location
              	// console.log(location)
                $("#select_layer").append("<option value="+layer+">"+location+"</option>");
			}

			$.ajax({
		        url:"/monitoring/selectLayer",
		        contentType:"application/json",
		        method:"post",
		        data:JSON.stringify(user_id),
		        success:function(data){
		        	var layerSelect = data[0].layer
		        	// console.log(layer_type)
		        	if(layer_type != undefined){
		                if(layerSelect != layer_type){
		                    layerSelect = layer_type;
		                }
		            }
		            // console.log(layer_type)
		            $("#select_layer").val(layerSelect)
		        	
	        		table = $("#welltagTable").DataTable({
						"processing": true,
				        "serverSide": true,
				        "ordering":false,
				        "filter": false,
				        "pageLength": 10,
				        "bLengthChange": false,
				        "orderMulti": false,
					    "ajax": {
					    	"url":"/monitoring/all_wearing_welltag_Info",
					        "type": "post",
					        "datatype": "json",
					        "data":function(data){
					        	data.layerSelect = layerSelect;
					        }
					    },
					    "columnDefs":[
						     // {
				       //      	"targets":[0],
				       //      	"visible": false
				       //      },
				            {
				            	"targets":[6],
				            	"render":function(data){
				            		if(data == 1){
				            			return gender_one;
				            		}else{
					    				return gender_zero
					    			}
				            	}
				            },
				            {
				            	"targets":[7],
				            	"render":function(data){
				            		console.log(data)
				            		if(data == 1){
				            			return isfalling;
				            		}else if(data == 3){
				            			return decubitus
				            		}else{
					    				return nofalling
					    			}

				            	}
				            },
							{
				            	"targets": [8],
				            	"render":function(data){
				            		// return data;
				            		if(data == 1){
				            			return active_on;
				            		}else{
					    				return active_off
					    			}
				            		 	
				            		
				            	}
				            },
				            {
				            	"targets": [9],
				            	"render":function(data){
				            		// return data;
				            		if(data < 16){
				            			return low_battery;
				            		}else{
					    				return data
					    			}
				            		 	
				            		// else if(data == 3){
				            		// 	return "욕창"
				            		// }
				            	}
				            }
			        	],
					    "columns":[
						    {"data":"welltag_id", "width":"150px"},
						    {"data":"type", "width":"150px"},
						    {"data":"name", "width":"200px"},
						    {"data":"location", "width":"100px"},
						    {"data":"ward", "width":"100px"},
						    {"data":"age", "width":"100px"},
						    {"data":"gender", "width":"100px"},
						    {"data":"isFalling", "width":"150px"},
						    {"data":"isActive", "width":"150px"},
						    {"data":"battery", "width":"150px"},
						    {"defaultContent": "<button  id='modi_btn' class = 'reset_btn'>수정</button><button id='delete_button' class ='reset_btn'>삭제</button>", "width":"150px"}
						]
				    })
				}
		    })  
			// console.log(user_id)

			
		}
	})
	$("#select_layer").on("change", function(){
		var layer = $("#select_layer").val()
		console.log(layer)
		// console.log(layer)
		// var changeLayer = $("#select_layer").val();

		location.href = "/monitoring/wearing_welltag_info?layer=" + layer;
	})
	//클릭시 초기값 설정
					
	$("#welltagTable").on("click","#delete_button",function(){
		var data = table.row($(this).parents("tr")).data()
		var welltag_id = data.welltag_id;
		var layer = data.layer;
		
		// console.log(welltag_id)
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
							url:"/monitoring/delete_wearing_welltag_info?welltag_id="+welltag_id,  
							contentType:"application/json",
							method:"get",
							success:function(data){
								alert("삭제 되었습니다")
								location.href = "/monitoring/wearing_welltag_info?layer=" + layer;
							}
						})
					}	
				}	
			}
		})
	})
	$("#welltagTable").on("click","#modi_btn",function(){
		var data = table.row($(this).parents("tr")).data() 
		var layer = data.layer;
	 	var welltag_id = data.welltag_id;
	 	$.ajax({
	 		url:"/monitoring/init_welltag_info",
			contentType:"application/json",
			method:"get",
			success:function(data){
				console.log(data)
				for(var i = 0; i<data.length; i++){
					var welltag_id = data[i].welltag_id;
					var use_state = data[i].use_state;
					$("#change_modi_welltag").append("<option value='"+welltag_id+"'>"+welltag_id+"</option>");
				}
			}
	 	})
	 	$.ajax({
	 		url:"/monitoring/init_wearing_welltag_info?welltag_id="+welltag_id,
			contentType:"application/json",
			method:"get",
			success:function(data){
				console.log(data)
				var welltag_seq = data[0].welltag_seq
				var welltag_id = data[0].welltag_id
				var type = data[0].type
				var name = data[0].name
				var ward = data[0].ward
				var age = data[0].age
				var gender = data[0].gender
				if(gender == 0){
					$('input:radio[name="modi_gender"][value="0"]').prop('checked', true)
				} else if(gender == 1){
					$('input:radio[name="modi_gender"][value="1"]').prop('checked', true)
				}
				$("#backup_welltag_seq").val(welltag_seq)
				$("#backup_type").val(type)
				$("#modi_welltag_seq").val(welltag_seq)
				$("#modi_welltag").html(welltag_id)
				// $("#change_modi_welltag").val(welltag_id)
				$("#modi_type").val(type)
				$("#modi_age").val(age)
				$("#modi_name").val(name)
				$("#modi_ward").val(ward)
			}
	 	})
		$("#dialog-confirm1").dialog({
			height:"auto",
			width:"400px",
			modal : true,
			buttons: {
				"btn1" : {
					text : "수정",
					id : "update_welltag_button",
					click:function(){
						var backup_welltag_seq = $("#backup_welltag_seq").val();
						var backup_type = $("#backup_type").val();
						var welltag_seq = $("#modi_welltag_seq").val();
						var type = $("#modi_type").val();
						var name = $("#modi_name").val();
						var ward = $("#modi_ward").val();
						var modi_gender = $(":input:radio[name=modi_gender]:checked").val();
						var modi_age = $("#modi_age").val();
						var id = $("#modi_welltag").html();
						var new_id = $("#change_modi_welltag").val();
						var layer = $("#select_layer").val();
						console.log(new_id)
						if(new_id == 0){
							modify_data = {"welltag_seq":welltag_seq,"type":type,"name":name,"ward":ward, "modi_gender":modi_gender, "modi_age":modi_age}
							$.ajax({
								url:"/monitoring/modi_welltag_info",
								contentType:"application/json",
								method:"post",
								data:JSON.stringify(modify_data),
								success:function(data){
									alert("수정되었습니다.")
									location.href = "/monitoring/wearing_welltag_info?layer=" + layer;
								}
							}) 							
						} else {
							new_data = {"welltag_seq":welltag_seq,"type":type,"name":name,"ward":ward, "modi_gender":modi_gender, "modi_age":modi_age, "id":id, "new_id":new_id, "layer":layer}
							$.ajax({
								url:"/monitoring/new_welltag_info",
								contentType:"application/json",
								method:"post",
								data:JSON.stringify(new_data),
								success:function(data){
									alert("수정되었습니다.")
									location.href = "/monitoring/wearing_welltag_info?layer=" + layer;
								}
							})
						}
						
						
					$( this ).dialog( "close" );
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
	// $("#change_modi_welltag").on("change", function(){
	// 	var welltag_seq = $("#backup_welltag_seq").val();
	// 	var id = $("#modi_welltag").html();
	// 	var new_id = $("#change_modi_welltag").val();
	// 	var modi_age = $("#modi_age").val();
	// 	var modi_gender = $(":input:radio[name=modi_gender]:checked").val();
	// 	var type = $("#modi_type").val();
	// 	var name = $("#modi_name").val();
	// 	var ward = $("#modi_ward").val();
	// 	console.log(welltag_seq)
	// 	new_data = {"welltag_seq":welltag_seq,"id":id,"new_id":new_id,"modi_age":modi_age,"modi_gender":modi_gender, "type":type, "name":name, "ward":ward}

	// 	$.ajax({
	// 		url:"/monitoring/new_data_welltag",
	// 		contentType:"application/json",
	// 		method:"post",
	// 		data:JSON.stringify(new_data),
	// 		success:function(data){
	// 			console.log(data)
	// 		}
	// 	})
	// })
})

function addWearingWelltagInfo(){
	$.ajax({
		url:"/monitoring/not_use_welltag_info",
		contentType:"application/json",
		method:"get",
		success:function(data){
			for(var i = 0 ; i<data.length; i++){
				$("#not_use_welltag").append('<option value='+	data[i].welltag_seq+'>'+data[i].welltag_id+'</option>')
			}

		}
	})
	$("#dialog-confirm").dialog({
		height:"auto",
		width:"400px",
		modal : true,
		buttons: {
			"btn1" : {
				text : "추가",
				id : "add_welltag_button",
				click:function(){
					var layer = $("#select_layer").val()
					var welltag_seq = $("#not_use_welltag").val()
					var type = $("#type").val()
					var name = $("#name").val()
					var age = $("#age").val()
					var ward = $("#ward").val()
					var etc = $("#etc").val()
					var gender = $(":input:radio[name=gender]:checked").val();
					var patient_number = $("#patient_number").val()
					if(name == ""){
						alert("이름을 입력하세요.")
						$("#name").focus();
						return false;	
					}
					if(ward == ""){
						alert("병실을 입력하세요.")
						$("#name").focus();
						return false;	
					}
					if(age == ""){
						alert("나이를 입력하세요.")
						$("#age").focus();
						return false;	
					}
					if(age == ""){
						alert("나이를 입력하세요.")
						$("#age").focus();
						return false;	
					}
					if(!$("input[name='gender']:checked").val()){
						alert("성별을 선택하세요.")
						return false;	
					}
					if(etc == ""){
						alert("특이사항을 입력하세요.")
						$("#etc").focus();
						return false;	
					}
					if(patient_number == ""){
						alert("환자번호를 입력하세요.")
						$("#patient_number").focus();
						return false;	
					}
					data = {"welltag_seq":welltag_seq,"type":type,"name":name,"ward":ward,"age":age,"gender":gender,"etc":etc,"patient_number":patient_number,"layer":layer}
					// console.log(data);
					$.ajax({
						url:"/monitoring/add_wearing_welltag_info",
						contentType:"application/json",
						method:"post",
						data:JSON.stringify(data),
						success:function(data){
							if(data){
								alert("추가되었습니다.")
							}else{
								alert("실패하였습니다.")
							}
						}
					})
					$( this ).dialog( "close" );
					location.href = "/monitoring/wearing_welltag_info"
				}
			},
			"btn2" : {
				text : "취소",
				id : "add_cancel",
				click:function(){
					$( this ).dialog( "close" );
				}
			}
		}
	})
}
// 환자 병원 
// function All_select(){
// 	var type = $("#All_select").val();
// 	var type2 = $("#All_name_select").val();
// 	typeSelect(type);

// }

function typeSelect(layer, value){
	// console.log(value)
	if(value == "all"){
		$.ajax({
			url:"/monitoring/all_welltag_Wearing="+layer,
			contentType:"application/json",
			method:"get",
			success:function(data){
				// console.log(data)
				initDataTable(data)	
			}
		})
	}
}

// 이름 낙상 신호순 select
// function selectOrder(value){
// 	var type = $("#All_name_select").val();
// 	order(type, value);
// }

// function order(type, value){
// 	var select_type = $("#All_select").val();

// 	if(value == "0"){
//         $.ajax({
//             url:"/monitoring/searchName?select_type=" + select_type,
//             contentType:"application/json",
//             method:"get",
//             success:function(data){
//             	initDataTable(data)
// 			}
//         })
//     }
//     if(value == "1"){
//     	$.ajax({
//             url:"/monitoring/searchFalling?select_type=" + select_type,
//             contentType:"application/json",
//             method:"get",
//             success:function(data){
//             	initDataTable(data)
//             }
//         })   
//     }
//     if(value == "2"){
//     	$.ajax({
//             url:"/monitoring/searchSignal?select_type=" + select_type,
//             contentType:"application/json",
//             method:"get",
//             success:function(data){
//             	initDataTable(data)
//             }
//         })
//     }
//     if(value == "3"){
//     	$.ajax({
//             url:"/monitoring/searchBattery?select_type=" + select_type,
//             contentType:"application/json",
//             method:"get",
//             success:function(data){
//             	initDataTable(data)
//             }
//         })
//     }
//     if(value == "4"){
//     	$.ajax({
//             url:"/monitoring/searchType?select_type=" + select_type,
//             contentType:"application/json",
//             method:"get",
//             success:function(data){
//             	initDataTable(data)
//             }
//         })
//     }	
// }



function viewText(type){
	if(type=="선택"){
		$("#new_user_name").css({"display":"none"})
		$("#new_ward").css({"display":"none"})
		$("#add_welltag_button").css({"display":"none"})
	}
	if(type=="환자"){
		$("#new_user_name").css({"display":"block"})
		$("#new_ward").css({"display":"block"})
		$("#new_age").css({"display":"block"})
		$("#new_sex").css({"display":"block"})
		$("#new_etc").css({"display":"block"})
		$("#new_patient_number").css({"display":"block"})
		$("#add_welltag_button").css({"display":"inline"})
	}
	if(type=="의료인"){
		$("#new_user_name").css({"display":"block"})
		$("#new_ward").css({"display":"none"})
		$("#add_welltag_button").css({"display":"inline"})
	}
	if(type=="의료기구"){
		$("#new_user_name").css({"display":"block"})
		$("#new_ward").css({"display":"none"})
		$("#add_welltag_button").css({"display":"inline"})
	}	
}

function wardText(type){
	if(type=="선택"){
		$("#new_modi_name").css({"display":"none"})
		$("#new_modi_ward").css({"display":"none"})
		$("#update_welltag_button").css({"display":"none"})
	}
	if(type=="환자"){
		$("#new_modi_name").css({"display":"block"})
		$("#new_modi_ward").css({"display":"block"})
		$("#update_welltag_button").css({"display":"inline"})
	}
	if(type=="의료인"){
		$("#new_modi_name").css({"display":"block"})
		$("#new_modi_ward").css({"display":"block"})
		$("#update_welltag_button").css({"display":"inline"})
	}
	if(type=="의료기구"){
		$("#new_modi_name").css({"display":"block"})
		$("#new_modi_ward").css({"display":"none"})
		$("#update_welltag_button").css({"display":"inline"})
	}		
}
