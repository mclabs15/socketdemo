window.onload = function() {

var nodes = [];

var socket = io();


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

fillCircle = function(cx,cy,radius) {

ctx.beginPath();
ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
ctx.fill();

};
line = function(x1,y1,x2,y2) {
ctx.beginPath();
ctx.moveTo(x1,y1);
ctx.lineTo(x2,y2);
ctx.stroke();

};



var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");


pointDistance = function(x1,y1,x2,y2) {
	return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
}


setInterval(function(){

window.w = window.innerWidth;
window.h = window.innerHeight;

canvas.setAttribute("width",window.w);
canvas.setAttribute("height",window.h);

ctx.fillStyle = "#000";
ctx.fillRect(0,0,window.w,window.h);

for(var i = 0; i < nodes.length; i++) {
	for(var j = 0; j < nodes.length; j++) {
		if(pointDistance(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y) <= 150) {
			ctx.lineWidth = "3px";
			ctx.strokeStyle = "#072";
			line(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y);
		}
	}


ctx.fillStyle="#FFF";
fillCircle(nodes[i].x,nodes[i].y,6.5);
ctx.fillStyle = "rgb("+nodes[i].r+","+nodes[i].g+","+nodes[i].b+")";
fillCircle(nodes[i].x,nodes[i].y,5);
}




},10);

socket.on('nodes',function(data){
//console.log(data);

nodes = JSON.parse(data);

});

/*cvs.addEventListener('mousemove', function(evt) {
    mousePos = getMousePos(cvs, evt);
    //console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
    angle = Math.atan2(mousePos.x - screenWidth/2, - (mousePos.y - screenHeight/2) )*(180/Math.PI) - 90;
    //console.log("Angle: " + angle);
    mv = Math.sqrt(Math.pow(mousePos.x - screenWidth/2,2)+Math.pow(mousePos.y - screenHeight/2,2));
    //console.log(mv);
  }, false);*/

canvas.addEventListener('mouseup',function(evt) {
	var mp = getMousePos(canvas,evt);
	socket.emit('evt',JSON.stringify([mp.x,mp.y]));
	console.log('clicked');
});


var lastMove = null;
canvas.addEvent('touchmove', function(event) {
  lastMove = event;
});
canvas.addEventListener('touchend',function(evt) {
	evt.preventDefault();
	var mp = lastMove/*.changedTouches*/;
	for(var i = 0; i < mp.touches.length; i++) {
		socket.emit('evt',JSON.stringify([mp.touches[i].screenX,mp.touches[i].screenY]));
	}
	console.log('clicked');
});


}