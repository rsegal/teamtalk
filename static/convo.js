socket = io.connect("http://localhost:8888");
debugging = true;

function dbPrint(s) {
	if (debugging) console.log(s);
}

function addPost(conversation, name, content, date) {
	var nameObj = $("<div>").text(name).addClass("name");
	var dateObj = $("<div>").text(date).addClass("date");
	var contentObj = $("<div>").text(content).addClass("content");
	var newPost = $("<div>").addClass("post").append(nameObj).append(dateObj).append(contentObj);
	conversation.append(newPost);
}

function permissionsEffects() {
	var permission = $('#perm_true:checked').val();
	dbPrint("Permission: " + permission);
	if (permission === "true") {
		$("#main form").css("display","block");
	}
	else {
		$("#main form").css("display","none");
	}
}

$("#header form").submit(function() {
	permissionsEffects();
	return false;
});

$("#main form, #peanut form").submit(function() {
    // send the post event, with some data
    var content = $(this).children(".chatbox").val();
    var conv = $(this).parent('.convo_box').attr('id');
    var my_name = $("#header #name").val();
    var date = new Date();
    var dateString = date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds();
    dbPrint(my_name + " posted " + content + " at " + dateString);
   	socket.emit('post', {
    		conversation : conv,
    		name : my_name,
    		text : content,
    		date : dateString 
    	});  
    addPost($('#' + conv + ' .thread'), my_name, content, dateString);
    return false;
});

socket.on("post", function(data) {
	var name = data["statement"][0];
	var msg = data["statement"][1];
	var conv = data["conv"];
	var date = data["statement"][2];
	addPost($('#' + conv + ' .thread'), name, msg, date);
});

$(document).ready(function () {
	dbPrint("Starting app...");
		permissionsEffects();
});