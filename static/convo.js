function connect() {

}

function changeUser() {

}

$('header').click(function(event) {

});

window.onresize = function(event) {
    resizeDiv();
}	

function resizeDiv() {
	console.log("Resizing height");
    h = $(window).height(); 
    $('body').css({'height': h + 'px'});
}

$(document).ready(function(){
    resizeDiv();
});