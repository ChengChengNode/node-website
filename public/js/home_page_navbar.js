//sticky navigation bar
$(function (){
    var navOffset = $("header").offset().top;
    // alert(navOffset);
    $(window).scroll(function () {
        var scrollPos = $(window).scrollTop();

        if(scrollPos >= navOffset){
            $('header').addClass('fixed');
        }
        else{
            $('header').removeClass('fixed');
        }
    });
    // alert(scrollPosition);
});
function rotate() {
    $('.flipper .front').css('transform','rotateY(-180deg)');
    $('.flipper .back').css('transform','rotateY(0deg)');
};
function rotateback() {
    $('.flipper .front').css('transform','rotateY(0deg)');
    $('.flipper .back').css('transform','rotateY(180deg)');
};