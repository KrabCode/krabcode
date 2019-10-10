
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

window.onload = function() {
    // placeDomainName();
};

function placeDomainName(){
    let domain = window.location.href;
    let titleHeader = '';
    if(domain.endsWith('.eu')){
        titleHeader = 'krabcode';
    }else if(domain.endsWith('.cz')){
        titleHeader = 'Jakub Rak';
    }else{
        titleHeader = 'localhost';
    }
    document.getElementById("header").innerText = titleHeader;
    document.getElementById("title").innerText = titleHeader;
}