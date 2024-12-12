$(document).ready(function(){
   $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();
    if (scroll < 50) {
      $(".header-sticky").removeClass("sticky-bar");
      $('#back-top').fadeOut(500);
    } else {
      $(".header-sticky").addClass("sticky-bar");
      $('#back-top').fadeIn(500);
    }
  });

// Scroll Up
  $('#back-top a').on("click", function () {

    $('body,html').animate({
      scrollTop: 0
    }, 1000);
    return false;
  });


});
