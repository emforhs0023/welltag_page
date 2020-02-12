// $(function() {
// 	$("#hospital_input").on("click", function(){
// 		$("#dialog-confirm").dialog({
// 			height:"auto",
// 			width:"400px",
// 			modal : true,
// 			buttons: {
				
// 			}
// 		})
// 	})			
// })
$(function(){
	$.ajax({
		url:"/login/req_layer",
		contentType:"application/json",
        method:"get",
        success:function(data){
        	for(var i=0; i<data.length; i++){
        		var layer = i+1;
        		$("#layer").append("<option value="+layer+">"+layer+"F</option>")
        	}
        }
	})
})

function returnLogin(){
	location.href='/login'
}
