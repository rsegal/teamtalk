
function refreshDOM(data) {
	
}

function get(url) {
    $.ajax({
        type: "get",
        url: url,
        success: function(data) {
        	  		console.log(data);
        }
    });
}

$(document).ready(function() {
    $('#register-form').submit(function(){
    	    var email = $('#register-form #register-email').val();
    	    var password = $('#register-form #register-password').val();
    	    newUser(email, password);
    	    $('#register-form input').val('');
    	    return false;
    });
});

function newUser(email, password) {
    $.ajax({
        type: "post",
        data: {
            'email' : email,
            'password' : password
        },
        url: "/user",
        success: function(data) {
            console.log(data);
        }
    });
}

function newOrg(name){
    $.ajax({
        type: 'post',
        data: {
            'name' : name
        },
        url: '/org',
        success: function(data) {
            console.log(data);
        }
    });
}

function newProject(name){
    $.ajax({
        type: 'post',
        data: {
            'name' : name
        },
        url: '/project',
        success: function(data) {
            console.log(data);
        }
    });
}

function newGroup(name){
    $.ajax({
        type: 'post',
        data: {
            'name' : name
        },
        url: '/group',
        success: function(data) {
            console.log(data);
        }
    });
}

function newConv(name){
    $.ajax({
        type: 'post',
        data: {
            'name' : name
        },
        url: '/conv',
        success: function(data) {
            console.log(data);
        }
    });
}

