var io = require('socket.io').listen(8888);
var express = require("express");
var app = express();
var fs = require("fs");
app.use(express.bodyParser());

var mongo = require('mongodb');
var host = 'localhost';
var port = mongo.Connection.DEFAULT_PORT;

var optionsWithEnableWriteAccess = { w: 1 };
var dbName = 'testDb';

var client = new mongo.Db(
    dbName,
    new mongo.Server(host, port),
    optionsWithEnableWriteAccess
);

function closeDb(){
    client.close();
}

function onDocumentsInserted(err){
    if (err)
        throw err;
    console.log('documents inserted!');
    closeDb();
}

function insertDocuments(collection, docs, done){
    if (docs.length === 0){
        done(null);
        return;
    }
    var docHead = docs.shift(); //shift removes first element from docs
    collection.insert(docHead, function onInserted(err){
        if (err){
            done(err);
            return;
        }
        insertDocuments(collection, docs, done);
    });
}

// Create one user
app.post("/user", function(request, response){
    var user = {
        'email' : request.body.email,
        'password' : request.body.password,
        'orgs' : { },
        'projects' : { },
        'groups' : { },
        'convs' : { },
        'files' : { },
    };
    client.open(function(){
        client.collection('userCollection', function(error, userCollection){
            insertDocuments(userCollection, [user], onDocumentsInserted);
        });
    });
});

app.post('/org', function(request, response){
    var org = {
        'name' : request.body.name,
        'projects' : { },
    };
    client.open(function(){
        client.collection('orgCollection', function(error, orgCollection){
            insertDocuments(orgCollection, [org], onDocumentsInserted);
        });
    });
});

app.post('/project', function(request, response){
    var proj = {
        'name' : request.body.name,
        'groups' : { },
    };
    client.open(function(){
        client.collection('projCollection', function(error, projCollection){
            insertDocuments(projCollection, [proj], onDocumentsInserted);
        });
    });
});

app.post('/group', function(request, response){
    var group = {
        'name' : request.body.name,
        'conv' : { },
    };
    client.open(function(){
        client.collection('groupCollection', function(error, groupCollection){
            insertDocuments(groupCollection, [group], onDocumentsInserted);
        });
    });
});

app.post('/conv', function(request, response){
    var conv = {
        'name' : request.body.name,
    };
    client.open(function(){
        client.collection('convCollection', function(error, convCollection){
            insertDocuments(convCollection, [conv], onDocumentsInserted);
        });
    });
});

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
	//conversers[socket.id] = ["",false,true];
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
    conversations = {};
    conversations["main conv"] = []; //ordered list of user,text pairs
    conversations["peanut conv"] = [];
}

initServer();
app.listen(8889);

