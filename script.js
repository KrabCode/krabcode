
$(document).bind('keyup', function(e) {
    if(e.which == 39){
        $('.carousel').carousel('next');
        e.preventDefault();
    }
    else if(e.which == 37){
        $('.carousel').carousel('prev');
        e.preventDefault();
    }
});
/*
$(window).on('shown.bs.modal', function() {
    document.getElementById("background").pause();
});

$(window).on('hide.bs.modal', function() {
    document.getElementById("background").play();
});
*/