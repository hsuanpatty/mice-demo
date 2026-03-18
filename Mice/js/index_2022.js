// 忘記密碼
$(function () {
    $($('#menu button').eq(0).addClass('active').find('a').attr('href'))
      .siblings('.content')
      .hide();

    $('#menu button').click(function () {
        $($(this).find('a').attr('href')).show().siblings('.content').hide();
        $(this).addClass('active').siblings('.active').removeClass('active');
    });
});

// 輪播圖
$(document).ready(function(){
$('.slick_img').slick({
    infinite: true,
    arrows: false,
    dots: false,
    autoplay: false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
});
});


//輪播圖 progerss bar
var percentTime;
var tick;
var time = 0.1;
var progressBarIndex = 0;

$('.slick_img_title .progressBar').each(function (index) {
    var progress = "<div class='inProgress inProgress" + index + "'></div>";
    $(this).html(progress);
});

function startProgressbar() {
    resetProgressbar();
    percentTime = 0;
    tick = setInterval(interval, 10);
    // 讓網站一進入時，第一個項目吃到效果
    $('.slick_img_title .item').removeClass('active');
    $('.slick_img_title .item').eq(progressBarIndex).addClass('active');
}

function interval() {
    if (
      $(
        '.slick_img .slick-track div[data-slick-index="' +
          progressBarIndex +
          '"]',
      ).attr('aria-hidden') === 'true'
    ) {
        progressBarIndex = $(
          '.slick_img .slick-track div[aria-hidden="false"]',
        ).data('slickIndex');
        $('.slick_img_title .item').removeClass('active');
        $('.slick_img_title .item').eq(progressBarIndex).addClass('active');
        startProgressbar();
    } else {
        percentTime += 1 / (time + 8);
        $('.inProgress' + progressBarIndex).css({
            width: percentTime + '%',
        });
        if (percentTime >= 100) {
            $('.single-item').slick('slickNext');
            progressBarIndex++;

            if (progressBarIndex > 5) {
                progressBarIndex = 0;
            }

            $('.slick_img_title .item').removeClass('active');
            $('.slick_img_title .item').eq(progressBarIndex).addClass('active');
            startProgressbar();
        }
    }
}

function resetProgressbar() {
    $('.inProgress').css({
        width: 0 + '%',
    });
    clearInterval(tick);
}
startProgressbar();
// End ticking machine

$(document).on('click', '.item', function () {
    clearInterval(tick);
    var goToThisIndex = $(this).find('span').data('slickIndex');
    $('.single-item').slick('slickGoTo', goToThisIndex, false);
    startProgressbar();
});

$('.featured_img').slick({
    dots: true,
    lazyLoad: 'ondemand', // ondemand progressive anticipated
    infinite: true,
});