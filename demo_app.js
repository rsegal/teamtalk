var express = require("express");
var app = express();

var fs = require("fs");
app.use(express.bodyParser());

var io = require('socket.io').listen(8888);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on("connection", function(socket) { 
	conversers[socket.id] = ["",false,true];
	socket.on('name', function(data) {
		console.log(data);
		conversers[socket.id] = [data['name'],data['permissions'],true];
	});
	socket.on('post', function(data) {
		console.log(data);
		var statement = [data['name'],data['text']];
		conversation.append([data['name'],data['text']]);
		sockets.emit('post', {statement: statement});
	});
});

function initServer() {
	conversers = {}; // dictionary of user keyed by id, continaing username, permissions, and connection
	conversation = []; // ordered list of user,statement pairs
}

initServer();
app.listen(8889);