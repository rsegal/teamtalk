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

function Post(conv,thread,user,date,content) {
    this.conv = conv;
    this.thread = thread;
    this.user = user;
    this.date = date;
    this.content = content;
}

function Conversation(name,mainDOMObj,peanutDOMObj) {
    self = this;
    self.name = name;
    // make a hash?
//    self.id = mainDOMObj.attr('id');
    self.mainDOMObj = mainDOMObj;
    self.mainDOMObj.parent('.convSuite').attr("id", self.name);
    self.peanutDOMObj = peanutDOMObj;
    self.group = null;
    
    self.addToGroup(group) {
	self.group = group;
    }

    self.addPost = function(post) {
        var nameObj = $("<div>").text(post.name).addClass("name");
        var dateObj = $("<div>").text(post.date).addClass("date");
        var contentObj = $("<div>").text(post.content).addClass("content");
        var newPost = $("<div>").addClass("post").append(nameObj).append(dateObj).append(contentObj);
	dbPrint(post);
	var mainThreadName = "conv main";
	dbPrint("Trying to add to thread " + self.name);
	dbPrint("Names: compare " + post.conv + " to " + self.name);
	if (self.name === post.conv) {
	    dbPrint("Thread: compare " + post.thread + " to " +  mainThreadName);
	    if (post.thread === mainThreadName) self.mainDOMObj.children(".thread").append(newPost);
	    else if (self.peanutDOMObj !== null) self.peanutDOMObj.children(".thread").append(newPost);
	}
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
	conv = new Conversation(name,$("#" + name + ".convSuite .main"),$("#" + name + ".convSuite .peanut"));
    }
    else conv = new Conversation(name,$("#" + name + ".convSuite .main"),null);

    conv.viewEffects();

    $(".conv form").submit( function(event) {
	dbPrint(event);
	var form = $(event.target);
    // send the post event, with some data
	dbPrint("This: " + form);
	dbPrint("Parent: " + form.parent());
	dbPrint("Sibling's content: " + form.parent().siblings('.header').text());
	var content = form.children("[type=text]").val();
	var conversation = form.parent().siblings('.header').text();
	var thread = form.parent().attr('class');
//	currentConv = conv;
	dbPrint(thread);
	var user = getUserName();
	var date = new Date();
	var post = new Post(conversation,thread,user,date,content);
    //    var dateString = date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds();
	dbPrint(post.user + " posted " + post.content + " at " + post.date + " in " + post.conv + ":" + post.thread);
	socket.emit('post', { post : post });
	conversations[post.conv].addPost(post);
	return false;
    });

    return conv;
}

$("#header #demo_name").submit(function() {
    for (var conv in conversations) { 
	conversations[conv].viewEffects(); 
//	dbPrint(conversations[conv].name + " ?== " + conv);
    }
    return false;
});

$("#header #demo_spawn_conv").submit(function() {
    var name = $(this).children("#name").val();
    $(this).children("#name").val("");
    if (name) {
	var hasPeanutGallery = true;
	conversations[name] = newConversation(name, hasPeanutGallery); 
    }
    return false;
});

function getUserName() {
    return $("#header #demo_name #name").val();
}

socket.on("post", function(data) {
    var post = data["post"];
    var conv = post.conv;
    conversations[conv].addPost(post);
});

$(document).ready(function () {
    dbPrint("Starting app...");
    conversations = {};
    var convName = "demo";
    var conv = newConversation(convName, true);
    dbPrint(conv);
    conversations[convName] = conv;
});