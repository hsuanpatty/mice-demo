$(document).ready(function () {
    // 網頁go top
    $("#gotop").click(function () {
        $("html,body").animate({
            scrollTop: 0
        }, 500);
    });
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#gotop').fadeIn("fast");
        } else {
            $('#gotop').stop().fadeOut("fast");
        }
    });

    // FirmCooperation {
$('#FirmCooperation-owl-carousel').owlCarousel({

    loop: true,
    margin: 20,
    nav: true,
    smartSpeed: 600,
    slideBy: 1,

    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,

    navText: [
        "<img src='/images/member/20_back.png'>",
        "<img src='/images/member/20_next.png'>"
    ],

    responsive:{
        0:{
            items:2,
            dots:false   // 手機關閉
        },
        768:{
            items:4,
            dots:false   // 平板關閉
        },
        1200:{
            items:6,
            dots:true,   // 桌機才開
            dotsEach:6
        }
    }

});

  // 禁止選單點選時，而馬上關閉
  $("body").on("click", ".menu_btn", function(e) {
    e.stopPropagation();
    $(".menu_btn_box").addClass("active");
  });
  
  // 以下是menu正常功能
  $('.m_ul_inner').hide();
  $('.menu_btn_ul li').click(function() {
    $(this).children('.m_ul_inner').slideToggle();
    $(this).siblings().children('.m_ul_inner').slideUp();
    $(this).toggleClass('active');
    // $(this).siblings().removeClass('active');
  });


  $(".menu_close").click(function() {
    $(".menu_btn_box").removeClass("active");
    return false;
  });


  $("body").on("click", ".platform_btn", function(e) {
    e.stopPropagation();
    $(".platform_menu_box").addClass("active");
  });


  $(".menu_close").click(function() {
    $(".menu_btn_box").removeClass("active");
    return false;
  });

  $(".platform_menu_close").click(function() {
    $(".platform_menu_box").removeClass("active");
    return false;
  });

});
