var currentRow = null;  // 현재 선택한 월태그

$(function() {
	$.ajax({
	 	url:"/system/all_welltag_info",
	 	contentType:"application/json",
	 	method:"get",
	 	success:function(data){
	 		var wellTagList = data;

	 		/*for(var i = 0; i<wellTagList.length; i++){
	 			console.log(wellTagList[i])
	 			var seq = wellTagList[welltag_seq]; 
	 		}*/

	 		table = $("#welltagTable").DataTable({
		 			"destroy":true,
		            "ordering": false,
		            "searching": false,
		            "info": false, 
					"bLengthChange": false,  
					"scrollY": "450px",
					"scrollCollapse": true,
		            "data": wellTagList,
		            "paging": false,
					"columns":[
					    {"data":"welltag_seq","width":"80px"},
					    {"data":"welltag_id","width":"120px"},
					    {"data":"welltag_mac","width":"120px"},
					    {"data":"layer","width":"80px"},
					    {"data":"battery","width":"120px"},
					], 
			});

			
	 		 
			$("#welltagTable").on("click","tbody tr",function(){
				var data = table.row($(this)).data()

				var seq = data.welltag_seq;

				if($(this).hasClass("selected")) {
                    $(this).removeClass("selected");
                } else {
                    table.$("tr.selected").removeClass("selected");
                    $(this).addClass("selected");
                }
                // 선택한 row 햔재 row를 설정함 
                currentRow = this;

                var data = table.row(this).data();
                // console.log(data)
                welltag_info(data["layer"],data["welltag_id"],data["welltag_mac"],data["welltag_seq"]) 
                // console.log(welltag_info)
				// $.ajax({
				// 	url:"/system/indi_welltag_info?welltag_seq="+seq,
				// 	contentType:"application/json",
				// 	method:"get",
				// 	success:function(data){
				// 		// console.log(data)
				// 		var welltag_seq = data[0].welltag_seq
				// 		var welltag_id = data[0].welltag_id
				// 		var welltag_Mac = data[0].welltag_mac
				// 		var layer = data[0].layer
				// 		// console.log(Well_Tag_seq)
				// 		$("#Well_Tag_seq").html(welltag_seq)
				// 		$("#Well_Tag_id").html(welltag_id)
				// 		$("#Well_Tag_Mac").html(welltag_Mac)
				// 		$("#Well_Tag_layer").val(layer)

				// 	}
				// })

			})		
			
	 	}
	 })
})
function welltag_info(layer, welltag_id, welltag_mac, welltag_seq){
	$('#Well_Tag_seq').html(welltag_seq);
    $('#Well_Tag_id').val(welltag_id);
    $('#Well_Tag_Mac').val(welltag_mac);
   	$('#Well_Tag_layer').val(layer);
}

    
// 윌태그 추가 
function addWell_TagInfo(){
	var id  = $("#Well_Tag_id").val()
	var mac = $("#Well_Tag_Mac").val()

	var data = {"id": id, "mac":  mac}
	// console.log(seq)
	// console.log(id)
	// console.log(mac)

	$.ajax({
		url:"/system/add_welltag",
		contentType:"application/json",
		data:JSON.stringify(data),
		method:"post",
		success:function(data){
			// console.log(data)
			if(data == true){
				alert("생성 성공")

				location.href = "/system"
			}else{
				alert("실패")
				location.href = "/system"
			}
		}
	})
}
// 저장 
function updateWell_TagInfo(){
	var seq = $("#Well_Tag_seq").html()
	var id  = $("#Well_Tag_id").val()
	var mac = $("#Well_Tag_Mac").val()

	var data = {"seq":  seq, "id": id, "mac":mac}

	$.ajax({
        url:"/system/update_welltag",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        contentType:"application/json",
        data:JSON.stringify(data),
        method:"put",
        success:function(data){
        	// console.log(data)
            if(true) {
         		alert("업데이트 성공")  
         		location.href = "/system" 
            } else {
           		alert("실패")
				location.href = "/system"
           	}
        }
    })
}


// 윌태그 삭제
function deleteWell_TagInfo(){
	if(currentRow == null) {
        alert("삭제할 월태그가 없습니다");
        return;
    }


	var seq = $("#Well_Tag_seq").html();
	var delete_confirm =confirm("삭제 하시겠습니까?.");
	if(delete_confirm == true){
		$.ajax({
			url:"/system/del_welltag?welltag_seq="+seq,
			contentType:"application/json",
			method:"delete",
			success:function(data){
				if(true) {
					// 선택된 row를 삭제하고 table을 다시 그림
	                table.row($(currentRow)).remove().draw(false);
	                initWellTagForm();
	                alert("삭제되었습니다")
	            } else {
	            	alert("삭제 되지 않았습니다.")
	            }
			}
		})
	} else {
		alert("취소 되었습니다.")
	} 

	// console.log(seq)
	
}

function initWellTagForm() {
    $('#Well_Tag_layer').val(""); 
    currentRow = null;
}