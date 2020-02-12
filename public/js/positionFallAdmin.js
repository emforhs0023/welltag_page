var areax = 10;
var areay = 10;

var isfalling = "<p style='color:tomato;font-weight:700'>낙상</p>"
var decubitus = "<p style='color:#3fbd3f;font-weight:700'>욕창</p>"
var nofalling = "<p>정상</p>"
var active_on  = "<p>ON</p>"
var active_off  = "<p style='color:red'>OFF</p>"
var low_battery = "<p style = 'color:red'>교체 요망</p>"
var escape = "<p style = 'color:red'>탈원</p>"

var table = null;

// 층 변경 정보를 socket io 통해 전달할 때 사용되는 변수
var from_layer = 1;
var to_layer = 1;

// 웰태그 위치 정보 저장 변수
var welltag_loc = {};

$(function() {
	var cx = 979;
	var cy = 762;
 	var px = 10;
	var py = 10;

    // countState()
    nowYear();

    layer_type = location.href.split("=")[1];
    // var socket = io.connect("http://certi.fsrnt.com:9000")
    var socket = io();
     $.ajax({
        url:"/monitoring/req_layer",
        contentType:"application/json",
        method:"get",
        success:function(data){
            for(var i = 0; i<data.length; i++){
                // console.log(data[i].layer)
                var layer = data[i].layer;
                var location = data[i].location;
                $("#tracking_layer").append("<option value="+layer+">"+location+"</option>");
            }
        }
    })

    $.ajax({
        url:"/monitoring/req_layer",
        contentType:"application/json",
        method:"get",
        success:function(data){

            for(var i = 0; i<data.length; i++){
                // console.log(data[i].layer)
                var layer = data[i].layer;
                var location = data[i].location;
                $("#escape_layer").append("<option value="+layer+">"+location+"</option>");
            }
           escapeImgview(layer)
        }
    })
    $.ajax({
        url:"/monitoring/escape_count",
        contentType:"application/json",
        method:"get",
        success:function(data){
            
            table1 = $("#escape_table").DataTable({
                "processing": true,
                "serverSide": true,
                "ordering":false,
                "filter": false,
                "pageLength": 15,
                "bLengthChange": false,
                "orderMulti": false,
                "ajax": {
                    "url": "/monitoring/escape",
                    "type": 'post',
                    "datatype": "json"
                },
                "columnDefs":[
                    {
                        "targets": [3],
                        "render":function(data){
                            if(data == 1){                      
                                return "on"
                            }else{
                                return noActive                                 
                            }
                        }   
                    },
                    {
                        "targets":[2],
                        "render":function(data){
                            update_date = new Date(data);
                            var FallingDate_format = moment(update_date).format("YYYY-MM-DD hh:mm:ss"); 
                            return FallingDate_format;
                        }
                    },
                    {
                        "targets": [4],
                        "render":function(data){
                            if(data < 16){
                                return low_battery
                            }else{
                                return data                     
                            }
                        }   
                    }
                ],
                "columns":[
                    {"data":"name","width":"70px"},
                    {"data":"ward"},
                    {"data":"update_date","width":"100px"},
                    {"data":"isActive","width":"50px"},
                    {"data":"battery","width":"70px"},
                    {"defaultContent": "<img src='/static/img/MagnifyingGlass.png' id='escape_view' style='width: 20px; cursor: pointer; border: 1px solid gray; padding: 3px; border-radius: 5px; background-color: #f2f2f2;'>","width":"60px"},
                ]
            });
        }
    })
	$.ajax({
		url:"/monitoring/req_layer",
        contentType:"application/json",
        method:"get",
        success:function(data){
            for(var i = 0; i<data.length; i++){
                // console.log(data[i].layer)
                var layer = data[i].layer;
                var location = data[i].location;
                $("#select_layer").append("<option value="+layer+">"+location+"</option>");
            }

            user_id = {"user_id":user_id}

            $.ajax({
                url:"/monitoring/selectLayer",
                contentType:"application/json",
                method:"post",
                data:JSON.stringify(user_id),
                success:function(data){ 
                    var layer = data[0].layer

                    if(layer_type != undefined){
                        if(layer != layer_type){
                            layer = layer_type;
                        }
                    }
                    if(layer == 100){
                        canvasx = 979;
                        canvasy = 762;
                        $("#canvas").attr("width","979px");
                        $("#canvas").attr("height","762px");    
                    }else{
                        canvasx = 600;
                        canvasy = 762;
                        $("#canvas").attr("width","600px");
                        $("#canvas").attr("height","762px");    
                    }
                    

                    $("#select_layer").val(layer)
                    order(layer, 0)
                    imgview(layer)
                    // 최초 층 변경 정보를 전달함.(필수)
                    socket.emit('move_layer', {'from': from_layer, 'to': layer})
                    to_layer = layer;
                    from_layer = layer;
                }
            })
        }
    });
    
    $("#select_layer").on("change", function(){
        var layer = this.value;
        socket.emit('move_layer', {'from': from_layer, 'to': layer})
        location.href = "/monitoring?layer=" + layer;
    });

    $("#welltagTable").on("click","tr",function(){
        var data = table.row($(this)).data();
        var thisRow = $(this);
        var welltag_id = data.welltag_id;
        if(welltag_id){
            update(welltag_id,thisRow);
        }
    });
    $("#welltagTable").on("click", "#tracking_btn", function(){
        var data = table.row($(this).parents("tr")).data();

        var name = data.name;
        var layer= data.layer;
        var ward = data.ward;

        $("#trackingWard").html(ward)
        $("#trackingName").html(name)
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        
        var date = new Date()
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var date1 = year+"-"+month+"-"+day;


        tracking(date1, "00:00:00", "23:59:59", name, layer);

    })
    $("#tracking_layer").on("change", function(){
        var name  = $("#trackingName").html()
        var layer = this.value;
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})

        var date = new Date()
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var date1 = year+"-"+month+"-"+day;

        tracking(date1, "00:00:00", "23:59:59", name, layer);
  
    })
    $("#select_tracking_date").on("change", function(){
        var name  = $("#trackingName").html();
        var layer = $("#tracking_layer").val();
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        var date1 = this.value;

        tracking(date1, "00:00:00", "23:59:59", name, layer);
    })

    
    // function drawEscapeDot(name, layer){
    //     $.ajax({
    //         url:"/monitoring/tracking_escape?name="+ name+"&layer="+layer,
    //         method:"get",
    //         contentType:"application/JSON",
    //         success:function(data){
    //             for(var i = 0; i<data.length; i++){
    //                 var xValue = data[i].loc_x; 
    //                 var yValue = data[i].loc_y;
    //                 x = xValue * (tracking_canvasx/areax);
    //                 y = tracking_canvasy - yValue * (tracking_canvasy/areay);

    //                 $('#tracking_canvas').drawArc({
    //                   layer:true,
    //                   fillStyle: '#ff6347',
    //                   strokeWidth: 5,
    //                   x: x, y: y,
    //                   radius: 10
    //                 }).drawLayers()
    //             }
    //         }
    //     })
    // }
    // function drawStartDot(name, layer){
    //     $.ajax({
    //         url:"/monitoring/tracking_start?name="+ name+"&layer="+layer,
    //         method:"get",
    //         contentType:"application/JSON",
    //         success:function(data){
    //             var xValue = data[0].loc_x; 
    //             var yValue = data[0].loc_y;
    //             x = xValue * (tracking_canvasx/areax);
    //             y = tracking_canvasy - yValue * (tracking_canvasy/areay);

    //             $('#tracking_canvas').drawArc({
    //               layer:true,
    //               fillStyle: '#00b050',
    //               strokeWidth: 5,
    //               x: x, y: y,
    //               radius: 8
    //             }).drawLayers()
    //         }
    //     })
        
    // }
    // function drawEndDot(name, layer){
    //     $.ajax({
    //         url:"/monitoring/tracking_end?name="+ name+"&layer="+layer,
    //         method:"get",
    //         contentType:"application/JSON",
    //         success:function(data){
    //             var xValue = data[0].loc_x; 
    //             var yValue = data[0].loc_y;
    //             x = xValue * (tracking_canvasx/areax);
    //             y = tracking_canvasy - yValue * (tracking_canvasy/areay);

    //             $('#tracking_canvas').drawArc({
    //               layer:true,
    //               fillStyle: '#bfbfbf',
    //               strokeWidth: 5,
    //               x: x, y: y,
    //               radius: 5
    //             }).drawLayers()
    //         }
    //     })
    // }
    

    // $("#welltagTable").on("click","#accum_view_btn",function(){
    //     var data = table.row($(this).parents("tr")).data();
    //     var name = data.name;
    //     // alert(name)
    //     $.ajax({
    //         url:"/monitoring/accumMoveInfo?name=" +name,
    //         method:"get",
    //         contentType:"application/json",
    //         success:function(data){
    //             var TableList = data

    //             for(var i = 0 ; i<TableList.length; i++){
    //                 // console.log(TableList[i].using_date)
    //                 var row = TableList[i]
    //                 using_date = new Date(row["using_date"]);
    //                 var using_date_format = moment(using_date).format("YYYY/MM/DD");

    //                 row["using_date"] = using_date_format
    //             }

    //             accum_move_table = $("#accum_move_table").DataTable({
    //                 "destroy":true,
    //                 "ordering":false,
    //                 "searching": false,
    //                 "info": false,
    //                 "scrollY": "598px",
    //                 "scrollCollapse": true,
    //                 "bLengthChange": false,
    //                 "data": TableList,
    //                 "paging": false,
    //                 "columns":[
    //                     {"data":"using_date","width":"120px"},
    //                     {"data":"user_name","width":"120px"},
    //                     {"data":"move","width":"120px"},
    //                 ]
    //             });
    //         }
    //     })
    //     $("#accum_move_form").dialog({
    //         height:"auto",
    //         width:"600px",
    //         modal : false
    //     })
    // })

    $("#welltagTable").on("click","#reset_btn",function(){
        var data = table.row($(this).parents("tr")).data();
        var welltag_id = data.welltag_id;

        data = {"welltag_id":welltag_id};

        $.ajax({
            url:"/monitoring/reset_falling",
            data: JSON.stringify(data),
            contentType:"application/json",
            method:"put",
            success:function(data){
                layer = $("#select_layer").val();
                countState()
                updateFallingDisplay(welltag_id,0);
                var rowIndex = findRowIndex(welltag_id);
                var rowData = table.row(rowIndex).data();
                rowData['fallingStr'] = nofalling;

                table.row(rowIndex).data(rowData).draw(false);
            }
        })
    })




    socket.on("location", function(data) {
        // console.log(data)

        if(data["name"] == null){

        }else{
            var layerState = $("#select_layer").val()
            // welltag_id
            var tagId = data["welltag_id"];
            // X 좌표
            var xValue = getXAxisValue(data["x"]);
            // Y 좌표
            var yValue = getYAxisValue(data["y"]);
            // 상태
            var fail_down = data["fail_down"];
            // 사용자 이름
            var name = data["name"];
            // 현재 필터중인 착용대상 select_wear_type 변수에 저장
            var select_wear_type = $("#wearing_type option:selected").text()

            // 필터를 전체로 해놓은 경우
            if(select_wear_type == "전체"){
                realtimeMonitoringTable(data)
            }
            // 다른 착용대상으로 해놓은 경우
            if(select_wear_type == data["type"]){
                realtimeMonitoringTable(data)
            }
            
            //현재 층과 들어온 층값이 같을 경우
            if(data["layer"] == layerState){
                //웰태그_txt값을 가진 layer가 존재할 경우
                if($("#canvas").getLayer(tagId+'_txt')) {
                    //updateWlltg 함수 호출
                    updateWellTag(tagId, xValue, yValue, canvasx, canvasy);
                //웰태그_txt값을 가진 layer가 존재하지 않을 경우
                } else {
                    //addWelltag 함수 호출
                    addWellTag(name, tagId, xValue, yValue, fail_down);
                }
            } else{
                // delete welltag_loc[tagId];
                $("#canvas").removeLayer(tagId+'_txt').drawLayers();
            }
            //updateFallingDisplay 함수 호출
            updateFallingDisplay(tagId, fail_down);
        }
        // 현재 layer 상태 값 layerState 변수에 저장
     
    })

    // 신호 손실에 대해 주기적으로 서버에 요청함
    setInterval(function() {
        getActiveOff();
    }, 300000);

    setInterval(reloadMonitoring, 600000)
});

//웹페이지 새로고침 기능
function reloadMonitoring(){
    layer = $("#select_layer").val();
    location.href = "/monitoring?layer=" + layer;
}

function realtimeMonitoringTable(data){
    // 현재 층
    var layerState = $("#select_layer").val()
    // 수신된 웰태그 ID
    var tagId = data["welltag_id"];
    // 수신된 웰태그의 X좌표
    var xValue = getXAxisValue(data["x"]);
    // 수신된 웰태그의 Y좌표
    var yValue = getYAxisValue(data["y"]);
    // 수신된 웰태그의 베터리양
    var battery = data["battery"];
    // 수신된 웰태그의 액션스테이터스 값
    var fail_down = data["fail_down"];
    // 수신된 웰태그의 이동 유무
    // var move = data["move"];
    // 수신된 웰태그 사용자 이름
    var name = data["name"];

    // 현재층이 같을 경우
    if(data["layer"] == layerState){
        rowIndex = findRowIndex(tagId)
        if(rowIndex != undefined){
            var rowData = table.row(rowIndex).data();
            if(data['battery'] < 16){
                rowData['batteryStr'] = low_battery;
            }else{
                rowData['batteryStr'] = data['battery'];
            }

            rowData['ActiveStr'] = 'ON';
            // console.log(data)
            if(data['fail_down'] == 0)
                rowData["fallingStr"] = nofalling;
            if(data['fail_down'] == 1)
                rowData["fallingStr"] = isfalling;
            if(data['fail_down'] == 3)
                rowData["fallingStr"] = decubitus;
            if(data['fail_down'] == 6)
                rowData["fallingStr"] = escape;

            // rowData["move"] = move
            // if(data["move"] == 0){
            //     rowData["move"] = "-"
            // }else{
            //     rowData["move"] = move
            // }

            table.row(rowIndex).data(rowData).draw(false);
        } else {
            // console.log(fail_down)
            if(fail_down == 0)
                fallingStr = nofalling;
            if(fail_down == 1)
                fallingStr = isfalling;
            if(fail_down == 3)
                fallingStr = decubitus;
            if(fail_down == 6)
                fallingStr = escape;

            if(data.battery < 16){
                batteryStr = low_battery
            }else{
                batteryStr = data.battery
            }

            table.row.add( {
                "welltag_id": tagId,
                "type": data.type,
                "name": data.name,
                "ward": data.ward,
                "fallingStr": fallingStr,
                "ActiveStr": "ON",
                "batteryStr": batteryStr,
                // "move": data.move
            } ).draw(false);
        }             
    } else {
        deleteRowIndex = findRowIndex(tagId);
        if(deleteRowIndex != undefined) {
            table.row(deleteRowIndex).remove().draw(false);
        }
    }
}
function change_order(value) {
    var layer = $("#select_layer").val();
    // console.log(value)
    // var value = $("#order_select").val();
    order(layer, value);
};

// 신호 손실에 대한 처리
function getActiveOff() {
    var layer = $("#select_layer").val();
    if(layer == undefined) {
        layer = 1
    }

    $.ajax({
        url:"/monitoring/active_off?layer="+layer,
        contentType:"application/json",
        method:"get",
        success:function(data){
            for(var idx = 0; idx < data.length; idx++) {
                var tagId = data[idx]["welltag_id"];
                var xValue = getXAxisValue(data[idx]["loc_x"]);
                var yValue = getYAxisValue(data[idx]["loc_y"]);
                var name = data[idx]["name"];
				if(name == "") {
					continue;
				}

                rowIndex = findRowIndex(tagId)

                if(rowIndex == undefined) {
                    continue;
                }

                var rowData = table.row(rowIndex).data();
                rowData['ActiveStr'] = active_off;
                table.row(rowIndex).data(rowData).draw(false);

                $("#canvas").removeLayer(tagId+'_txt').drawLayers();
                addWellTag(name, tagId, xValue, yValue, 0, false);
            }
        }
    })
}


function initDataTable(data) {
    var layer = $("#select_layer").val();
    var TableList = data

    for(var i = 0; i<TableList.length; i++){
        var row = TableList[i]

        if(row["isFalling"] == 0 || row["isFalling"] == 2  || row["isFalling"] == 3 || row["isFalling"] == 4)
            row["fallingStr"] = nofalling;
        if(row["isFalling"] == 1)
            row["fallingStr"] = isfalling;
        if(row["isFalling"] == 3)
            row["fallingStr"] = decubitus;
        if(row["isFalling"] == 6)
            row["fallingStr"] = escape;

        if(row["isActive"]) {
            row["ActiveStr"] = active_on;
        } else {
            row["ActiveStr"] = active_off;
        }
        if(row["battery"] < 16){
            row["batteryStr"] = low_battery
        }else{
            row["batteryStr"] = row["battery"]
        }

        // if(row["move"] == 0){
        //     row["move"] = "-"
        // }
    }

    // console.log(TableList);

    table = $("#welltagTable").DataTable({
        "destroy":true,
        "ordering":false,
        "searching": false,
        "info": false,
        "scrollY": "598px",
        "scrollCollapse": true,
        "bLengthChange": false,
        "data": TableList,
        "paging": false,
        "columnDefs":[
            {"targets": [0], "visible": false}
        ],
        "columns":[
        {"data":"welltag_id"},
        {"data":"type","width":"120px"},
        {"data":"name","width":"120px"},
        {"data":"ward","width":"120px"},
        {"data":"fallingStr","width":"120px"},
        {"data":"ActiveStr","width":"120px"},
        {"data":"batteryStr","width":"120px"},
        // {"data":"move","width":"120px"},
        {"defaultContent": "<button id = 'tracking_btn'>보기</button>","width":"120px"},
        // {"defaultContent": "<button id = 'accum_view_btn'>보기</button>","width":"120px"},
        {"defaultContent": "<button id = 'reset_btn'>초기화</button>","width":"120px"}
        ]
    });
    
};

function update(tagId, thisRow){
    var color = null;

    $("#welltagTable tr").css({"background-color":"white"})

    thisRow.css({"background-color":"#bdbdbd"})

    $('#canvas').setLayers({
        shadowColor: 'white',
        shadowBlur: 10,
    }).drawLayers();

    $('#canvas').setLayer(tagId+"_txt", {
        shadowColor: "#000",
        shadowBlur: 25,
    }).drawLayers();
};

function countState(){

    // var layer = $("#select_layer").val()

    // if(layer == null){
    //     var layer = 1;
    // }

    // $.ajax({
    //     url:"/monitoring/count?layer="+layer,
    //     contentType:"application/json",
    //     method:"get",
    //     success:function(data){
    //         $("#falling_count").html(data[0].falling_count)
    //         $("#off_count").html(data[0].active_count)
    //     }
    // })
};

function findRowIndex(tagId){
    var dataSet = table.rows().data();
     for(var idx = 0; idx < dataSet.length; idx++) {
        if(dataSet[idx]["welltag_id"] == tagId) {
            return idx;
        }
    }

    return undefined;
};

// 낙상 인지를 확인 할때 tagId, isFalling이 필요하다
function updateFallingDisplay(tagId, isFalling){
    var color = null;

    if(isFalling == 1){
        fillcolor = "tomato";
        color = "tomato";
    }else if(isFalling == 3){
        fillcolor = "#3fbd3f";
        color = "#3fbd3f";
    }else if(isFalling == 6){
        fillcolor = "red";
        color = "red";
    }else{
        fillcolor: "#4374D9";
        color = "#4374D9";
    }

    $('#canvas').setLayer(tagId+"_txt", {
        fillStyle: color
    }).drawLayers();
}

function getXAxisValue(xValue) {
    return xValue * (canvasx/areax);
}

function getYAxisValue(yValue) {
    return canvasy - yValue * (canvasy/areay);
}


function imgview(layer){
	$.ajax({
        url:"/monitoring/req_map?layer="+layer,
        contentType:"application/json",
        method:"get",
        success:function(data){
            var map = data[0].map
            $("#canvas").css({"background-image":"url("+map+")","background-size":"100% 100%"})
        }
    })

    $.ajax({
        url:"/monitoring/layer_location_welltag_info?layer="+layer,
        contentType:"application/json",
        method:"get",
        success:function(data){
            welltag_loc = {};
            $('#canvas').removeLayers().drawLayers();
            for(var i = 0 ; i<data.length;i++){
                var name = data[i].name
                var x = data[i].loc_x;
                var y = data[i].loc_y;
                var tagId = data[i].welltag_id;
                var isFalling = data[i].isFalling;
                var isActive = data[i].isActive;

                var x_value = x *(canvasx/10);
                var y_value = canvasy - y * (canvasy/10);

                addWellTag(name, tagId, x_value, y_value, isFalling, isActive);
            }
        }
    })

}

function updateWellTag(tagId, xValue, yValue, canvasx, canvasy) {
    if(xValue < 0 || yValue < 0){
       $("#canvas").removelayer(tagId);
   } else {
        delete welltag_loc[tagId]
        result = setupLocation(xValue, yValue, tagId);
        xValue = result[0];
        yValue = result[1];

        $("#canvas").animateLayer(tagId, {
            x: xValue,
            y: yValue,
        }).drawLayers()

        $("#canvas").animateLayer(tagId+"_txt", {
            x: xValue,
            y: yValue,
        }).drawLayers()
   }

   // console.log(JSON.stringify(welltag_loc));
}

function setupLocation(xValue, yValue, tagId) {
    // xValue, yValue 설정
    var cur_idx = 0;
    var searching = true;
    var count = 0;
    var loc_length = Object.keys(welltag_loc).length;

    while(loc_length > 0) {
        for(key in welltag_loc) {
            searching = false;
            welltag = welltag_loc[key];

            if(welltag.x == xValue && welltag.y == yValue && count < 7) {
                if(welltag.idx == 0) {
                    yValue -= 25;
                    cur_idx = 1;
                    searching = true;
                    count += 1;
                    break;
                } else if(welltag.idx == 1) {
                    xValue -= 45;
                    yValue += 10;
                    cur_idx = 2;
                    searching = true;
                    count += 1;
                    break;
                } else if(welltag.idx == 2) {
                    yValue += 25;
                    cur_idx = 3;
                    searching = true;
                    count += 1;
                    break;
                } else if(welltag.idx == 3) {
                    xValue += 47;
                    yValue += 15;
                    cur_idx = 4;
                    searching = true;
                    count += 1;
                    break;
                } else if(welltag.idx == 4) {
                    xValue += 45;
                    yValue -= 15;
                    cur_idx = 5;
                    searching = true;
                    count += 1;
                    break;
                } else if(welltag.idx == 5) {
                    yValue -= 27;
                    cur_idx = 6;
                    searching = true;
                    count += 1;
                    break;
                }
            }
        }

        if(searching == false) {
            break;
        }
    }

    welltag_loc[tagId] = {"x": xValue, "y": yValue, "idx": cur_idx}

    return [xValue, yValue];
}


function addWellTag(name, tagId, xValue, yValue, isFalling = 0, isActive = true){

    var color = null;
    var fillcolor = null;

    if(isFalling == 1){
        color = "tomato";
    } else if(isFalling == 3){
        color = "#3fbd3f"
    }else if(isFalling == 6){
        color = "red"
    }else if(isActive == false) {
        color = "#BDBDBD";
    } else {
        color = "#4374D9";
    }

    loc_result = setupLocation(xValue, yValue, tagId);
    xValue = loc_result[0];
    yValue = loc_result[1];

    // var xValue = xValue *(canvasx/10);
    // var xValue = canvasy - yValue * (canvasy/10);

    // $("canvas").drawPolygon({
    //     layer: true,
    //     name: tagId,
    //     fillStyle: color,
    //     strokeStyle: '#000',
    //     x: xValue, y: yValue,
    //     radius: 20,
    //     sides: 6,
    //     rotate: 0
    // }).drawText({
    $("#canvas").drawText({
        layer: true,
        name: tagId + "_txt",
        fillStyle: color,
        fontStyle: "bold",
        x: xValue,
        y: yValue,
        fontSize: '11pt',
        text: name
    });

    // .drawRect({
    //     layer: true,
    //     fillStyle: color,
    //     width: 60,
    //     height: 25,
    //     x: xValue, y: yValue,
    // })
}



function allWelltagInfo(layer){
    $.ajax({
        url:"/monitoring/all_welltag_info?layer="+layer,
        contentType:"application/json",
        method:"get",
        success:function(data){
            initDataTable(data);
        }
    })
}
function order(layer, value){
    // console.log(value);
    var type = $("#wearing_type").val();
    if(value == "0"){
        $.ajax({
            url:"/monitoring/sortingName?layer="+layer+"&type="+type,
            contentType:"application/json",
            method:"get",
            success:function(data){
                initDataTable(data)
            }
        })
    }
    if(value == "1"){
        $.ajax({
            url:"/monitoring/sortingFalling?layer="+layer+"&type="+type,
            contentType:"application/json",
            method:"get",
            success:function(data){
                initDataTable(data)
            }
        })
    }
    if(value == "2"){
        $.ajax({
            url:"/monitoring/sortingSignal?layer="+layer+"&type="+type,
            contentType:"application/json",
            method:"get",
            success:function(data){
                initDataTable(data)
            }
        })
    }
    if(value == "3"){
        $.ajax({
            url:"/monitoring/sortingBattery?layer="+layer+"&type="+type,
            contentType:"application/json",
            method:"get",
            success:function(data){
                initDataTable(data)
            }
        })
    }
    if(value == "4"){
        $.ajax({
            url:"/monitoring/sortingType?layer="+layer+"&type="+type,
            contentType:"application/json",
            method:"get",
            success:function(data){
                initDataTable(data)
            }
        })
    }
}
// function mainType(value){
//     var layer = $("#select_layer").val();

    
//     $.ajax({
//         url:"/monitoring/all_welltag_info?layer="+layer,
//         contentType:"application/json",
//         method:"get",
//         success:function(data){
//             initDataTable(data);
//         }
//     })
// }

function wearingType(value){
    var layer = $("#select_layer").val();
    if(value == "all"){
        $.ajax({
            url:"/monitoring/all_welltag_info?layer="+layer,
            contentType:"application/json",
            method:"get",
            success:function(data){
                initDataTable(data);
            }
        })
    }else if(value == "medical_person"){
        $.ajax({
            url:"/monitoring/medical_person_welltag_info?layer="+layer,
            contentType:"application/json",
            method:"get",
            success:function(data){
                initDataTable(data);
            }
        })
    }else if(value == "medical_equiment"){

        $.ajax({
            url:"/monitoring/medical_equiment_welltag_info?layer="+layer,
            contentType:"application/json",
            method:"get",
            success:function(data){
                initDataTable(data);
            }
        })
    }else if(value == "patient"){
        $.ajax({
            url:"/monitoring/patient_welltag_info?layer="+layer,
            contentType:"application/json",
            method:"get",
            success:function(data){
                initDataTable(data);
            }
        })
    }
}

// function operationalStatus(value){
//     var layer = $("#select_layer").val();
//     if(value == "ON"){
//         $.ajax({
//             url:"/monitoring/active_on?layer="+layer,
//             contentType:"application/json",
//             method:"get",
//             success:function(data){
//                 initDataTable(data);
//             }
//         })
//     }else if(value == "OFF"){
//         $.ajax({
//             url:"/monitoring/active_off?layer="+layer,
//             contentType:"application/json",
//             method:"get",
//             success:function(data){
//                 initDataTable(data);
//             }
//         })
//     }
// }

// function fallingState(value){
//     var layer = $("#layer").val();
//     if(value == "nofalling"){
//         $.ajax({
//             url:"/monitoring/nofalling?layer="+layer,
//             contentType:"application/json",
//             method:"get",
//             success:function(data){
//                 initDataTable(data);
//             }
//         })
//     }else if(value == "falling"){
//         $.ajax({
//             url:"/monitoring/falling?layer="+layer,
//             contentType:"application/json",
//             method:"get",
//             success:function(data){
//                 initDataTable(data);
//             }
//         })
//     }
// }

function getRandomPosition(postion) {
    rand_postion = (Math.random() * 20 - 5) + postion;
    rand_postion = parseFloat(rand_postion.toFixed(6))
    return rand_postion;
}

function trackingTime(value){
    var name  = $("#trackingName").html()
    var layer = $("#tracking_layer").val()
    var date = $("#select_tracking_date").val()

    if(value == 0){
        start = "00:00:00";
        end = "23:59:59";
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        $("#t0").css({"background-color":"white","color":"black"})
    }
    if(value == 1){
        start = "00:00:00";
        end = "02:59:59";
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        $("#t1").css({"background-color":"white","color":"black"})
    }
    if(value == 2){
        start = "03:00:00";
        end = "05:59:59";
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        $("#t2").css({"background-color":"white","color":"black"})
    
    }
    if(value == 3){
        start = " 06:00:00";
        end = " 08:59:59";
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        $("#t3").css({"background-color":"white","color":"black"})
    
    }
    if(value == 4){
        start = "09:00:00";
        end = "11:59:59";
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        $("#t4").css({"background-color":"white","color":"black"})
    
    }
    if(value == 5){
        start = "12:00:00";
        end = "14:59:59";
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        $("#t5").css({"background-color":"white","color":"black"})
    
    }
    if(value == 6){
        start = "15:00:00";
        end = "17:59:59";
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        $("#t6").css({"background-color":"white","color":"black"})
    }
    if(value == 7){
        start = "18:00:00";
        end = "20:59:59";
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        $("#t7").css({"background-color":"white","color":"black"})
    }
    if(value == 8){
        start = "21:00:00";
        end = "23:59:59";
        $(".tt_btn").css({"border":"1px solid gray;","background-color":"gray","color":"white"})
        $("#t8").css({"background-color":"white","color":"black"})
    }

    tracking(date, start, end, name, layer)
}
// function drawLine(data){
//     $('#tracking_canvas').removeLayers().drawLayers();
//     for(var i = 0; i<data.length; i++){

//         var xValue = data[i].loc_x; 
//         var yValue = data[i].loc_y;
//         x = xValue * (tracking_canvasx/areax);
//         y = tracking_canvasy - yValue * (tracking_canvasy/areay);

//         path.push([x, y]); 

//     }

//     var obj = {
//         layer:true,
//         strokeStyle: '#0070c0',
//         strokeWidth: 4,
//         rounded: true
//     };

//     // Add the points from the array to the object
//     for (var p = 0; p < path.length; p += 1) {
//       obj['x'+(p+1)] = path[p][0];
//       obj['y'+(p+1)] = path[p][1];
//     }

//     // Draw the line
//     $('#tracking_canvas').drawLine(obj).drawLayers()

//     for(var i = 0; i<data.length; i++){
//         var xValue = data[i].loc_x; 
//         var yValue = data[i].loc_y;
//         x = xValue * (tracking_canvasx/areax);
//         y = tracking_canvasy - yValue * (tracking_canvasy/areay);

//         $("#tracking_canvas").drawArc({
//             layer: true,
//             fillStyle: "navy",
//             strokeWidth: 5,
//             radius: 3,
//             x: x, y: y
//         })
//     }

//     
// }
function tracking(date, start, end, name, layer){
     $.ajax({
        url:"/monitoring/req_map?layer="+layer,
        contentType:"application/json",
        method:"get",
        success:function(data){
            var map = data[0].map
            $("#tracking_canvas").css({"background-image":"url("+map+")","background-size":"100% 100%"});
        }
    })
    $("#select_tracking_date").val(date)
    start1 = date+ " "+start
    end1 = date+ " "+end
    // console.log(start1)
    // console.log(end1)
    // console.log(year+"-"+month+"-"+day+" "+start)
    // console.log(year+"-"+month+"-"+day+" "+end)
    $("#tracking_layer").val(layer)
    $.ajax({
        url:"/monitoring/tracking?name="+ name+"&layer="+layer+"&start="+start1+"&end="+end1,
        method:"get",
        contentType:"application/JSON",
        success:function(data){
            // path = [];
            // console.log(layer);
            if(layer == 100){
                tracking_canvasx = 979;
                tracking_canvasy = 702;
                $("#tracking_canvas").attr("width","979px");
                $("#tracking_canvas").attr("height","702px");    
                // drawLine(data)
            }else{
                tracking_canvasx = 600;
                tracking_canvasy = 702;
                $("#tracking_canvas").attr("width","600px");
                $("#tracking_canvas").attr("height","702px");    
                // drawLine(data)
            }

            
            $('#tracking_canvas').removeLayers().drawLayers();
            for(var i = 0; i<data.length; i++){
                var xValue = data[i].loc_x; 
                var yValue = data[i].loc_y;

                x = xValue * (tracking_canvasx/areax);
                y = tracking_canvasy - yValue * (tracking_canvasy/areay);

                // console.log(x)
                // console.log(y)
                var count = data[i].count;

                if(count > 1 && count < 50){
                    color = "#b7dee8"
                }else if (count > 51 && count < 150){
                    color = "#6abad0"
                }else if (count > 151 && count < 300){
                    color = "#2b7589"
                }else if (count > 301 && count < 500){
                    color = "#153943"
                }else if (count > 501 && count < 800){
                    color ="#d0deb0"
                }else if (count > 801 && count < 1200){
                    color = "#a7c36f"
                }else if (count > 1201 && count < 1600){
                    color = "#667f35"
                }else if (count > 1600){
                    color = "#2b3517"
                }

                $('#tracking_canvas').drawArc({
                  layer:true,
                  fillStyle: color,
                  strokeWidth: 5,
                  x: x, y: y,
                  radius: 15,
                  text: data[i].count
                }).drawLayers()

                $('#tracking_canvas').drawText({
                  layer:true,
                  fillStyle: 'white',
                  strokeWidth: 2,
                  x: x, y: y,
                  fontSize: 10,
                  fontFamily: 'Verdana, sans-serif',
                  text: data[i].count
                }).drawLayers()
            }
            // drawEndDot(name, layer)
            // drawStartDot(name, layer)
            // drawEscapeDot(name, layer)
            $("#tracking").dialog({
                height:"auto",
                width:tracking_canvasx+"20px;",
                modal : true,
                buttons: {
                }      
            })
        }
    })
}
    // function drawStartDot(name, layer){
    //     $.ajax({
    //         url:"/monitoring/tracking_start?name="+ name+"&layer="+layer,
    //         method:"get",
    //         contentType:"application/JSON",
    //         success:function(data){
    //             var xValue = data[0].loc_x; 
    //             var yValue = data[0].loc_y;
    //             x = xValue * (tracking_canvasx/areax);
    //             y = tracking_canvasy - yValue * (tracking_canvasy/areay);

    //             $('#tracking_canvas').drawArc({
    //               layer:true,
    //               fillStyle: '#00b050',
    //               strokeWidth: 5,
    //               x: x, y: y,
    //               radius: 8
    //             }).drawLayers()
    //         }
    //     })
    // }