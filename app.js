var express = require("express");
var app = express();

var fs = require("fs");
app.use(express.bodyParser());

var userdata;

function readFile(filename, defaultData, callbackFn) {
	fs.readFile(filename, function(err, data) {
		if (err) {
			console.log("Error reading file: ", filename);
			data = defaultData;
		} else {
			console.log("Success reading file: ", filename);
		}
		if (callbackFn) callbackFn(err, data);
	});
};

function writeFile(filename, data, callbackFn) {
	fs.writeFile(filename, data, function(err) {
		if (err) {
			console.log("Error writing file: ", filename);
		} else {
			console.log("Success writing file: ", filename);
		}
		if (callbackFn) callbackFn(err);
	});
};

// Get all users
app.get("/user/", function (request, response) {
	console.log("getting /test");
	response.send({
		success: true
	});
});

// Get one user
app.get("/user/:id", function (request, response) {
	console.log("getting file");
    response.sendfile("user/" + request.params.id);
});

// Create one user
app.post("/user", function(request, response){
	var user = {};
	response.send({
		user: user,
		success: true
	});
});

// Update one user
app.put("/user/:id", function(request, repsonse){
	var id = request.params.id;
	response.send({
		user: user,
		success: true
	});
});

// Delete all users
app.delete("/user", function(request, repsonse){
	userdata = [];
	writeFile("users.txt", JSON.stringify(userdata));
	response.send({
		userdata: userdata,
		success: true
	});
});

// Delete one user
app.delete("/user/:id", function(request, response){
	var id = request.params.id;
	var old = userdata[id];
	userdata.splice(id, 1);
	writeFile("users.txt", JSON.stringify(teamdata));
	response.send({
		userdata: old,
		success: (old !== undefined)
	});
});

// Get one html page
app.get("/static/:filename", function(request, response){
    response.sendfile("static/" + request.params.filename);
});

function initServer() {
	var defaultList = "{}";
	readFile("users.txt", defaultList, function(err, data) {
		userdata = JSON.parse(data);
	});
}

initServer();
app.listen(8889);
