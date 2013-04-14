var io = require('socket.io').listen(8888);

var express = require("express");
var app = express();

var fs = require("fs");
app.use(express.bodyParser());

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

app.get("/static/:staticFilename", function (request, response) {
  response.sendfile("static/" + request.params.staticFilename);
});

io.sockets.on("connection", function(socket) { 
	conversers[socket.id] = ["",false,true];
	socket.on('name', function(data) {
		console.log(data);
		conversers[socket.id] = [data['name'],data['permissions'],true];
	});
	socket.on('post', function(data) {
		console.log(data);
		var convo = conversations[data["conversation"]];
		var statement = [data['name'],data['text'],data['date']];
		if (convo === undefined) {
			conversations[data["conversation"]] = [];
			convo = conversations[data["conversation"]];
		}
		convo.push(statement);
		socket.broadcast.emit('post', {statement: statement, conv: data["conversation"]});
	});
});

function initServer() {
	conversers = {}; // dictionary of user keyed by id, continaing username, permissions, and connection
	conversations = {};
	conversations["#main .chatbox"] = []; //ordered list of user,text pairs
	conversations["#peanut .chatbox"] = [];
}

initServer();
app.listen(8889);