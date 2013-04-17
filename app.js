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

function insertDocuments(collection, docs, done){
    if (docs.length === 0){
        done(null);
        return;
    }
    var docHead = docs.shift();
    collection.insert(docHead, function onInserted(err){
        if (err){
            done(err);
            return;
        }
        insertDocuments(collection, docs, done);
    });
}

function onInsert(err){
    if (err)
        throw err;
    console.log('documents inserted');
    closeDb();
}

function onUpdate(err){
    if (err)
        throw err;
    console.log('documents updated');
    closeDb();
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
            insertDocuments(userCollection, [user], onInsert);
        });
    });
});

// Create one organization
app.post('/org', function(request, response){
    var org = {
        'name' : request.body.name,
        'projects' : { },
        'groups' : { },
        'users' : { },
        'rootGroups' : { },
    };
    client.open(function(){
        client.collection('orgCollection', function(error, orgCollection){
            insertDocuments(orgCollection, [org], onInsert);
        });
    });
});

// Create one project
app.post('/project', function(request, response){
    var proj = {
        'name' : request.body.name,
        'groups' : { },
    };
    client.open(function(){
        client.collection('projCollection', function(error, projCollection){
            insertDocuments(projCollection, [proj], onInsert);
        });
    });
});

// Get all users
app.get('/user', function(request, response){
    var query = { };
    client.open(function(){
        client.collection('userCollection', function(error, userCollection){
            userCollection.find(query);
        });
    });
});

// Update one user
app.put('/user/:id', function(request, response){
    var id = request.params.id;
    
    client.open(function(){
        client.collection('userCollection', function(error, userCollection){
            
        });
    });
});

// Update one organization
app.put('/org/:id', function(request, response){
    var id = request.params.id;
    
    var query = { id: id };
    var update = { $set: {  } };
    client.open(function(){
        client.collection('orgCollection', function(error, orgCollection){
            orgCollection.update(query, update, { 'multi': true }, onUpdate);
        });
    });
});

/*
app.post('/group', function(request, response){
    var group = {
        'name' : request.body.name,
        'conv' : { },
    };
    client.open(function(){
        client.collection('groupCollection', function(error, groupCollection){
            insertDocuments(groupCollection, [group], onInsert);
        });
    });
});

app.post('/conv', function(request, response){
    var conv = {
        'name' : request.body.name,
    };
    client.open(function(){
        client.collection('convCollection', function(error, convCollection){
            insertDocuments(convCollection, [conv], onInsert);
        });
    });
});
*/

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
//	conversers[socket.id] = [data['name'],data['permissions'],true];
    });
    socket.on('post', function(data) {
	console.log(data);
	var post = data["post"];
	var convName = post.conv;
	if (conversations[convName] === undefined) {
	    conversations[convName] = [];
	}
	conversations[convName].push(post);
	socket.broadcast.emit('post', { post : post });
    });
});

function initServer() {    
    conversations = {};
}

initServer();
app.listen(8889);

