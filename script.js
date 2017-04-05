var canSwitch = true;

$(document).ready(function(){
    $(".skill-content").hide();

    $(".skill-front").mouseenter(function(){
        $(".skill-content").slideDown();
    });
    $(".skill-front").mouseleave(function(){
        $(".skill-content").slideUp();
    })
    //$(".skill").mouseenter(skillToggle);
    //$(".skill").mouseleave(skillToggle);

});

function skillToggle(){
    $(this).find(".skill-content").toggle(1000);
    //$(this).find(".skill-content").toggle(1000);

}
