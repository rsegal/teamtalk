socket = io.connect("http://198.199.77.186:8888");
debugging = true;

function dbPrint(s) {
    if (debugging) console.log(s);
}

function getUser() {
    return $("#header #name").val();
}

function Conversation(name,mainDOMObj,peanutDOMObj) {
    self = this;
    self.name = name;
    self.id = mainDOMObj.attr('id');
    self.mainDOMObj = mainDOMObj;
    self.peanutDOMObj = peanutDOMObj;

    self.addPost = function(conversation, name, content, date) {
        var nameObj = $("<div>").text(name).addClass("name");
        var dateObj = $("<div>").text(date).addClass("date");
        var contentObj = $("<div>").text(content).addClass("content");
        var newPost = $("<div>").addClass("post").append(nameObj).append(dateObj).append(contentObj);
	if (conversation === "main") self.mainDOMObj.children(".thread").append(newPost);
	else self.peanutDOMObj.children(".thread").append(newPost);
    }
    
    self.getPermissions = function() {
	return ($('#perm_true:checked').val() === "true");
    }
    
    self.permissionEffects = function() {
//	var user = getUser(); // just username so far
	var permission = self.getPermissions();
	if (permission) {
	    $("#main form").css("display","block");
	}
	else {
            $("#main form").css("display","none");
        }
    }
}

/* function addPost(conversation, name, content, date) {
	var nameObj = $("<div>").text(name).addClass("name");
	var dateObj = $("<div>").text(date).addClass("date");
	var contentObj = $("<div>").text(content).addClass("content");
	var newPost = $("<div>").addClass("post").append(nameObj).append(dateObj).append(contentObj);
	conversation.append(newPost);
} */

/* function permissionsEffects() {
	var permission = $('#perm_true:checked').val();
	dbPrint("Permission: " + permission);
	if (permission === "true") {
		$("#main form").css("display","block");
	}
	else {
		$("#main form").css("display","none");
	}
} */

$("#header form").submit(function() {
	conv.permissionEffects();
	return false;
});

$("#main form, #peanut form").submit(function() {
    // send the post event, with some data
    var content = $(this).children(".chatbox").val();
    var convo = $(this).parent('.convo_box').attr('id');
    console.log(convo);
    var my_name = $("#header #name").val();
    var date = new Date();
    var dateString = date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds();
    dbPrint(my_name + " posted " + content + " at " + dateString);
   	socket.emit('post', {
    		conversation : convo,
    		name : my_name,
    		text : content,
    		date : dateString 
    	});  
//    conv.addPost($('#' + convo + ' .thread'), my_name, content, dateString);
    conv.addPost(convo, my_name, content, dateString);
    return false;
});

socket.on("post", function(data) {
    var name = data["statement"][0];
    var msg = data["statement"][1];
    var conv = data["conv"];
    var date = data["statement"][2];
    //	addPost($('#' + conv + ' .thread'), name, msg, date);
    conv.addPost(conv,name,msh,date);
});

$(document).ready(function () {
    dbPrint("Starting app...");
    conv = new Conversation("demo",$("#main"),$("#peanut"));
    conv.permissionEffects();
});