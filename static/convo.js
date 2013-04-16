socket = io.connect("http://198.199.77.186:8888");
debugging = true;

function dbPrint(s) {
    if (debugging) console.log(s);
}

function getUser() {
    return $("#header #demo_name #name").val();
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
	else if (self.peanutDOMObj !== null) self.peanutDOMObj.children(".thread").append(newPost);
    }
    
    self.getPermissions = function() {
	return ($('#perm_true:checked').val() === "true");
    }
    
    self.viewEffects = function() {
	var permission = self.getPermissions();
	if (permission) {
	    $(".main form").show();
	}
	else {
            $(".main form").hide();
        }
	if (self.peanutDOMObj === null) {
	    $(".peanut").hide();
	}
    }
}

function newConversation(name, hasPeanutGallery) {
    var suite = $('<div>').addClass('convSuite').attr('id', name);
    var header = $('<div>').addClass('header').text(name);
    var mainConv = $('<div>').addClass('conv main');
    var peanutConv = $('<div>').addClass('conv peanut');
    var mainThread = $('<div>').addClass('thread').text("Committee");
    var mainForm = $('<form>').append($('<input>').attr('type', 'text')).append($('<input>').attr('type', 'submit'));
    var peanutThread = $('<div>').addClass('thread').text("Peanut Gallery");
    var peanutForm = $('<form>').append($('<input>').attr('type', 'text')).append($('<input>').attr('type', 'submit'));
    mainConv.append(mainThread).append(mainForm);
    peanutConv.append(peanutThread).append(peanutForm);
    suite.append(header).append(mainConv).append(peanutConv);
    $('body').append(suite);

    var conv;
    if (hasPeanutGallery) { 
	conv = new Conversation(name,$(".convSuite .main"),$(".convSuite .peanut"));
    }
    else conv = new Conversation(name,$(".convSuite .main"),null);

    conv.viewEffects();

    $(".conv form").submit( function() {
    // send the post event, with some data
	var content = $(this).children("[type=text]").val();
	var context = $(this).parent('.conv').attr('class');
	currentConv = $(this).parents(".convSuite").attr("id");
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
	conversations[currentConv].addPost(context, my_name, content, date);
	return false;
    });

    return conv;
}

$("#header #demo_name").submit(function() {
    conversations[currentConv].viewEffects();
    return false;
});

$("#header #demo_spawn_conv").submit(function() {
    var name = $(this).children("#name").val();
    $(this).children("#name").val("");
    var hasPeanutGallery = true;
    conversations[name] = newConversation(name, hasPeanutGallery);
    return false;
});

function getUserName() {
    return $("#header #demo_name #name").val();
}

/* $(".conv form").submit( function() {
    // send the post event, with some data
    var content = $(this).children("[type=text]").val();
    var context = $(this).parent('.conv').attr('class');
    currentConv = $(this).parents(".convSuite").attr("id");
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
    conversations[currentConv].addPost(context, my_name, content, date);
    return false;
});*/

socket.on("post", function(data) {
    var name = data["statement"][0];
    var msg = data["statement"][1];
    var context = data["conv"];
    var date = data["statement"][2];
    conversations[context].addPost(context,name,msg,date);
});

$(document).ready(function () {
    dbPrint("Starting app...");
    conversations = {};
    var convName = "demo";
    var conv = newConversation(convName, true);
    dbPrint(conv);
    conversations[convName] = conv;
    currentConv = convName;
});