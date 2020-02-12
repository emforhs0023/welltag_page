function position(cx, cy, px, py){
	for(var i = 0 ; i < py ; i++){
		var yline = cy-(cy/py*i);
		$('#cv').drawLine({
		  layer: true,
		  strokeStyle: '#ddd',
		  strokeWidth: 1,
		  x1: 0, y1: yline,
		  x2: cx, y2: yline
		});
	}
	for(var i = 0 ; i < px ; i++){
		var xline = cx/px*i;
		$('#cv').drawLine({
		  layer: true,
		  strokeStyle: '#ddd',
		  strokeWidth: 1,
		  x1: xline, y1: 0,
		  x2: xline, y2: cy
		});
	}
}