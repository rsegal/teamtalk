socket = io.connect("http://198.199.77.186:8888");
debugging = true;

function dbPrint(s) {
    if (debugging) console.log(s);
}

function getUser() {
    return $("#header #name").val();
}

function dateToTimeframe(date) {
    var currentTime = new Date();
    var roundThreshold = 2; // measure in smaller units until have larger - e.x. 36 hours, not 1.5 days
    var years = currentTime.getFullYear - date.getFullYear;
    if (years < roundThreshold) {
	var months = 12 * years + (currentTime.getMonth() - date.getMonth());
	if (months < roundThreshold) {
	    var weeks = 4 * months + (currentTime.getDay() - date.getDay()) / 7;
	    if (weeks < roundThreshold) {
		var days = currentTime.getDay() - date.getDay();
		if (days < roundThreshold) {
		    var hours = 24 * days + (currentTime.getHours() - date.getHours());
		    if (hours < roundThreshold) {
			var minutes = 60 * hours + (currentTime.getMinutes() - date.getMinutes());
			if (minutes < roundThreshold) {
			    var seconds = 60 * minutes + (currentTime.getSeconds() - date.getSeconds());
			    return seconds + " seconds ago";
			}
			else return minutes + " minutes ago";
		    }
		    else return hours + " hours ago";
		}
		else return days + " days ago";
	    }
	    else return weeks + " weeks ago";
	}
	else return months + " months ago";
    }
    else return years + " years ago";
}

function Conversation(name,mainDOMObj,peanutDOMObj) {
    self = this;
    self.name = name;
    self.id = mainDOMObj.attr('id');
    self.mainDOMObj = mainDOMObj;
    self.mainDOMObj.parent('.convSuite').attr("id", self.name);
    self.peanutDOMObj = peanutDOMObj;

    self.addPost = function(context, name, content, date) {
        var nameObj = $("<div>").text(name).addClass("name");
        var dateObj = $("<div>").text(date).addClass("date");
        var contentObj = $("<div>").text(content).addClass("content");
        var newPost = $("<div>").addClass("post").append(nameObj).append(dateObj).append(contentObj);
	dbPrint(context);
	if (context === "main conv") self.mainDOMObj.children(".thread").append(newPost);
	else self.peanutDOMObj.children(".thread").append(newPost);
    }
    
    self.getPermissions = function() {
	return ($('#perm_true:checked').val() === "true");
    }
    
    self.permissionEffects = function() {
	var permission = self.getPermissions();
	if (permission) {
	    $(".main form").css("display","block");
	}
	else {
            $(".main form").css("display","none");
        }
    }
}

$("#header form").submit(function() {
	conv.permissionEffects();
	return false;
}); 

function getUserName() {
    return $("#header #name").val();
}

$(".conv form").submit(function() {
    // send the post event, with some data
    var content = $(this).children(".chatbox").val();
//    $(this).children(".chatbox").val("");
    var context = $(this).parent('.conv').attr('class');
    dbPrint(context);
    var my_name = getUserName();
    var date = new Date();
//    var dateString = date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds();
    dbPrint(my_name + " posted " + content + " at " + date);
    socket.emit('post', {
    	conversation : context,
    	name : my_name,
    	text : content,
    	date : date
    });
    dbPrint(context + " , " + my_name + " , " + content + " , " + date);
    conv.addPost(context, my_name, content, date);
    return false;
});

socket.on("post", function(data) {
    var name = data["statement"][0];
    var msg = data["statement"][1];
    var conversation = data["conv"];
    var date = data["statement"][2];
    conv.addPost(conversation,name,msg,date);
});

$(document).ready(function () {
    dbPrint("Starting app...");
    conv = new Conversation("demo",$(".convSuite .main"),$(".convSuite .peanut"));
    conv.permissionEffects();
    dbPrint(conv);
});