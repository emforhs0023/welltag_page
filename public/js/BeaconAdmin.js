$(function(){

	layer_type = location.href.split("=")[1];

	$.ajax({
		url:"/system/req_layer",
		contentType:"application/json",
		mathod:"get",
			success:function(data){
				for(var i=0; i<data.length;i++){
					console.log(data[i])
					var layer = data[i].layer // 콘솔로 찍어보면 0과 1이 나오기에 1을 더해준다 
					var location = data[i].location 
					$("#select_layer").append("<option value="+layer+">"+location+"</option>")
				} // 층 뿌리기 
				if(layer_type == undefined || layer_type == ""){
					layer_type = 3
				}

				if(layer_type == 100){
                    canvasx = 979;
                    canvasy = 762;
                    $("canvas").attr("width","979px");
                    $("canvas").attr("height","762px");    
                }else{
                    canvasx = 600;
                    canvasy = 762;
                    $("canvas").attr("width","600px");
                    $("canvas").attr("height","762px");    
                }

				$("#select_layer").val(layer_type)
				imgview(layer_type)
			}
	})
	$("#select_layer").on("change", function(){
		var layer = this.value
		// imgview(layer) // imgview 정보를 가져온다 
		location.href = "/system/beacon_setting?layer=" + layer;
	})
	// imgview(3)
})
function imgview(layer){
	/*console.log(layer)*/
	$.ajax({
		url:"/system/req_map?layer="+layer,
		contentType:"application/json",
        method:"get",
        success:function(data){
        	console.log(data)
        	//해당하는 map을 변수로 선언 해준다 
        	var map = data[0].map
        	$("#canvas").css({"background-image":"url("+map+")","background-size":"100% 100%"})
        }
	})
	$.ajax({
		url:"/system/location_beacon_info?layer="+layer,
		contentType:"application/json",
		method:"get",
		success:function(data){
			// console.log(data)
			$('canvas').removeLayers().drawLayers(); 

			for (var i = 0; i<data.length; i++) {
				// console.log(data[i])
				var beacon_seq = data[i].beacon_seq
				// console.log(beacon_seq)
				var beacon_id = data[i].beacon_id
				// console.log(beacon_id)
				var loc_x = data[i].loc_x
				var loc_y = data[i].loc_y
				var x_value = loc_x*(canvasx/10);
				var y_value = canvasy - loc_y*(canvasy/10);

				visibleBeacon(x_value, y_value, beacon_id, beacon_seq);
			};
		}

	})

}

function visibleBeacon(x_value, y_value, beacon_id, beacon_seq){

	var x = x_value
	var y = y_value

	if($("canvas").getLayer(beacon_id)) {
		$("canvas").setLayer(beacon_id, {
			x:x,
			y:y
		}).drawLayers();
		$("canvas").setLayer(beacon_id + "_txt", {
            x: x,
            y: y
        }).drawLayers();
	}

	else {
		$("canvas").drawArc({
	        layer: true,
	        name: beacon_id,
	        draggable: true,
	        bringToFront: true,
	        strokeStyle: "#36c",
	    	strokeWidth: 1,
	        x: x,
	        y: y,
	        radius: 13,
	        concavity: 1,
	        data: {id: beacon_id},  
	        click:function(){
	        	setupBeaconInfo(beacon_seq)
	        },
	        dragstart: function(layer) {
	        	setupBeaconInfo(beacon_seq)
	        	setupLocation(layer)
	        },
	        drag: function(layer) {
	         	// setupBeaconInfo(beacon_seq)
                setupLocation(layer)
            },
	       	dragstop: function(layer) {
	       		setupLocation(layer)	
	       		setupBeaconInfo(beacon_seq)

	       		if($("#Beacon_x").val() != x_value && $("#Beacon_y").val() != y_value){
	       			if(confirm("비콘위치를 적용하시겠습니까?") == true){
	       				updateBeaconInfo()
	       			} else {
	       				setupBeaconInfo(beacon_seq)
	       				// $("canvas").removeLayer(beacon_id).drawLayers();
	       				visibleBeacon(x_value, y_value, beacon_id, beacon_seq)
	       			}
	       		}
			}

	    })  
		.drawText({
	        layer: true,
	        name: beacon_id + "_txt",
	        fillStyle: '#000',
	        fontStyle: "bold",
	        strokeWidth: 10,
	        x: x,
	        y: y,
	        fontSize: '10pt',
	        text: beacon_id.substring(5)
	    });
	}
} 

function setupBeaconInfo(beacon_seq){
	$.ajax({
        url:"/system/indi_beacon_info?beacon_seq="+beacon_seq,
        contentType:"application/json",
        method:"get",
        success:function(data){
        	// console.log(data)
            var beacon_seq = data[0].beacon_seq
            // console.log(beacon_seq)
            var beacon_id = data[0].beacon_id
            var beacon_name = data[0].beacon_name
            // console.log(beacon_id)
            var beacon_mac = data[0].beacon_mac

            var layer = data[0].layer
            // console.log(beacon_mac)
            var loc_x = data[0].loc_x
            // console.log(loc_x)
            var loc_y = data[0].loc_y
            // console.log(loc_y)
            $("#Beacon_seq").val(beacon_seq)
            $("#Beacon_id").val(beacon_id)
            $("#Beacon_Mac").val(beacon_mac)
            $("#Beacon_Name").val(beacon_name)
            $("#Beacon_layer").val(layer)
            $("#Beacon_x").val(loc_x)
            $("#Beacon_y").val(loc_y)
        }
    })
}

function setupLocation(beaconLayer){
	x_pos1 = beaconLayer['x'].toString()
	y_pos1 = beaconLayer['y'].toString()
	x_pos = (x_pos1)/(canvasx/10);
	y_pos = (762 - y_pos1)/76.2
	$("#Beacon_x").val(x_pos.toFixed(2))
	$("#Beacon_y").val(y_pos.toFixed(2))

	txt_layer = $("canvas").getLayer(beaconLayer.data.id + "_txt");
    txt_layer.x = beaconLayer.x;
    txt_layer.y = beaconLayer.y;
}

function deleteBeaconInfo(){
	var seq = $("#Beacon_seq").val();
	var beacon_id = $("#Beacon_id").val();
	// console.log(beacon_id)
	console.log()
	if(seq == ""){
		return;
	}

	if(confirm("삭제 하시겠습니까?") == true) {
		// $("canvas").removeLayer(beacon_id).drawLayers();      
		 $.ajax({
	        url:"/system/delete_beacon?beacon_id="+beacon_id,
	        contentType:"application/json",
	        method:"delete",
	        success:function(data){
	            if(true){
	            	alert("삭제되었습니다")
	    			location.href="/system/beacon_setting"  	 
	            }
	        }
		})

	}
}

function updateBeaconInfo() {
	var layer_state = $("#select_layer").val()
	var beacon_seq = $("#Beacon_seq").val()
	var beacon_id = $("#Beacon_id").val()
	var layer = $("#Beacon_layer").val()
	var locX = $("#Beacon_x").val()
	var locY = $("#Beacon_y").val()
	
	data = {"beacon_seq":beacon_seq, "beacon_id":beacon_id, "layer":layer,"loc_x":locX,"loc_y":locY};

	$.ajax({
        url:"/system/update_beacon",
        contentType:"application/json",
        data:JSON.stringify(data),
        method:"put",
        success:function(data){
        	// console.log(data)
			if(true){
				alert("수정되었습니다")
				if(layer != layer_state){
					 $("canvas").removeLayer(beacon_id).drawLayers();  
					 $("canvas").removeLayer(beacon_id+"_txt").drawLayers();  
				}
			}

        }
    })
	
}
