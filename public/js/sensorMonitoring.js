var canvasx = 979;
var canvasy = 762;
var areax = 10;
var areay = 10;

var table = null;

$(function(){
    // alert("good")
    var cx = 979;
    var cy = 762;
    var px = 10;
    var py = 10;


    $.ajax({
        url:"/monitoring/req_layer",
        contentType : "application/json",
        method :"get",
        success:function(data){
            for (var i = 0; i<data.length; i++){
                // console.log(data[i].layer)
                var layer = data[i].layer;
                $("#select_layer").append("<option value="+layer+">"+layer+"F</option>")
            }

            user_id = {"user_id":user_id}

            $.ajax({
                url:"/monitoring/selectLayer",
                contentType:"application/json",
                method:"post",
                data: JSON.stringify(user_id),
                success:function(data){
                    var layer = data[0].layer;
                    $("#select_layer").val(layer);
                    tableView(layer)
                }
            })
            $("#select_layer").on("change", function(){
                var layer = this.value;
                // alert(layer)
                $("#wearing_type").find("option:eq(0)").prop("selected", true);
                tableView(layer);
            })
        }
    })

    setInterval(function(){
        tableView($("#select_layer").val());
    }, 60000)
})

function update(tagId, thisRow){

    $("#welltagTable tr").css({"background-color":"white"})

    thisRow.css({"background-color":"#bdbdbd"})

    $('canvas').setLayers({
        shadowColor: 'white',
        shadowBlur: 10,
    }).drawLayers();

    $('canvas').setLayer(tagId+"_txt", {
        shadowColor: "#000",
        shadowBlur: 25,
    }).drawLayers();      
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
function co(){
    $("#carbon_monoxide").dialog({
            height:"auto",
            width:"600px",
            modal : false
    })
}
function dust(){
    $("#fine_dust").dialog({
            height:"auto",
            width:"560px",
            modal : false
    })
}

function tableView(layer){
    $.ajax({
        url:"/monitoring/getSensorData?layer="+layer,
        conntentType : "application/json",
        method:"get",
        success:function(data){
            initDataTable(data)
        }
    })
}

function initDataTable(data){
    // console.log(data)
    var TableList = data;

    for(var i = 0 ; i<TableList.length; i++){
        var row = TableList[i]
        // console.log(row["o2"])
        if(row["o2"] == 0){
            row["o2"] = "-"
        }

        if(row["co"] == 0){
            row["co"] = "-"
        }

        if(row["temp"] == 0){
            row["temp"] = "-"
        }

        if(row["humi"] == 0){
            row["humi"] = "-"
        }
        
        if(row["dust"] == 0){
            row["dust"] = "-"
        }
    }

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
        "columns":[
            // {"data":"layer"},
            {"data":"location","width":"200px"},
            {"data":"o2","width":"200px"},
            {"data":"co","width":"200px"},
            {"data":"temp","width":"200px"},
            {"data":"humi","width":"200px"},
            {"data":"dust","width":"200px"}
            // {"data":"battery"}
        ]
    })
}

function addWelltag(tagId, xValue, yValue){
    var color = "blue";
    var fillcolor = "blue";

    $("canvas").drawText({
        layer: true,
        name: tagId + "_txt",
        fillStyle: color,
        fontStyle: "bold",
        x: xValue,
        y: yValue,
        fontSize: '11pt',
        text: tagId
    });
}