
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
