var canvas = document.getElementById("cv");
var context = canvas.getContext("2d");           
context.beginPath();
context.moveTo(900,590);
context.lineTo(700,590);
context.stroke();
context.translate(900,590)
context.rotate((Math.PI/180)*190);


