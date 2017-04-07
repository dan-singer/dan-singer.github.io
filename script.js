var canSwitch = true;

$(document).ready(function(){

    $(".skill-content").hide();

    $(".skill-front").click(function(){
        $(this).siblings(".skill-content").toggle(1000);
    });


});
