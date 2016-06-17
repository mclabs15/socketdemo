var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('client'));

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user '+ socket+' disconnected');
  });
  socket.on('evt',function(data) {
	handleEvt(data,socket);
  });

});

http.listen(80, function(){
  console.log('listening on *:3000');
});



handleEvt = function(data,socket) {

//console.log('recieved data: ' + data + ' from '+socket.id);

try {
data = JSON.parse(data);

	console.log('got data');
	if(data.length == 2) {
		data[0] = parseInt(Math.round(data[0]));
		data[1] = parseInt(Math.round(data[1]));

		nodes.push(new Node(data[0],data[1],Math.random()*1 - Math.random()*1,Math.random()*1 - Math.random()*1,Math.round(Math.random()*255),Math.round(Math.random()*255),Math.round(Math.random()*255)));
	}

}
catch(e) {
	console.log(e);
}

};

//io.emit(type, data);

Global = {
	minX:-200,
	maxX:1280,
	minY:-200,
	maxY:920,
};


Node = function(x,y,xvel,yvel,r,g,b) {
this.x = x;
this.y = y;
this.xvel = xvel;
this.yvel = yvel;
this.r = r;
this.g = g;
this.b = b;


}
Node.prototype.move = function() {
	this.x += this.xvel;
	this.y += this.yvel;

	if(this.x < Global.minX || this.x > Global.maxX || this.y < Global.minY || this.y > Global.maxY) {
		this.del = true;
	}
}

nodes = [];

nodes.push(new Node(0,0,0.1,0.1,255,74,103));

setInterval(function(){
	for(var i = 0; i < nodes.length; i++) {
		nodes[i].move();
	}
	var delIndex = 0;
	for(var i = 0; i < nodes.length - delIndex; i++) {
		if(nodes[i].del) {
			nodes.splice(i,1);
			delIndex ++;
		}
	}


io.emit('nodes',JSON.stringify(nodes));


},10);
