$(document).ready(function () {

  // 👇 新增：關閉狀態鎖
  let announcementClosed = false;

  function adjustSubMenu() {
    const windowWidth = $(window).width();

    // 👇 這行改掉（加入關閉判斷）
    const isNotice = !announcementClosed && $("#announcement-bar").is(":visible");

    // =========================
    // 桌面 / 平板 marginTop & header top
    // =========================
    let subMenuMargin = 8;
    let headerTop = 0;

    if (windowWidth >= 1200) {
      subMenuMargin = isNotice ? 70 : 22;
      headerTop = isNotice ? 48 : 0;
    } else if (windowWidth >= 992) {
      subMenuMargin = isNotice ? 58 : 22;
      headerTop = isNotice ? 48 : 0;
    } else if (windowWidth >= 769) {
      subMenuMargin = isNotice ? 58 : 8;
      headerTop = isNotice ? 48 : 0;
    } else {
      subMenuMargin = isNotice ? 70 : 20;
      headerTop = isNotice ? 60 : 0;
    }

    $(".sub_menu")
      .stop(true, true)
      .animate({ marginTop: subMenuMargin + "px" }, 100);

    $("#header")
      .stop(true, true)
      .css("position", "fixed")
      .animate({ top: headerTop + "px" }, 100);

    // =========================
    // 手機 pushy-right
    // =========================
    if (windowWidth <= 1199) {

      let pushyHeight = "100%";
      let pushyMargin = 0;

      if (windowWidth <= 375) {
        pushyHeight = isNotice ? "auto" : "100%";
        pushyMargin = isNotice ? 63 : 0;
      } else if (windowWidth <= 425) {
        pushyHeight = isNotice ? "auto" : "100%";
        pushyMargin = isNotice ? 64 : 0;
      } else if (windowWidth <= 575) {
        pushyHeight = isNotice ? "auto" : "100%";
        pushyMargin = isNotice ? 60 : 0;
      } else if (windowWidth <= 769) {
        pushyHeight = isNotice ? "auto" : "100%";
        pushyMargin = isNotice ? 60 : 0;
      } else {
        pushyHeight = isNotice ? "auto" : "100%";
        pushyMargin = isNotice ? 70 : 0;
      }

      $(".pushy-right")
        .css({
          bottom: 0,
          overflowY: "auto",
          position: "fixed",
          height: pushyHeight
        })
        .stop(true, true)
        .animate({ top: pushyMargin + "px" }, 350);

    } else {
      $(".pushy-right").css({
        top: "",
        bottom: "",
        overflowY: "",
        position: "",
        height: "",
      });
    }
  }

  // 初始載入
  adjustSubMenu();

  // 移除 nav-bg 陰影
  $(".nav-bg").css("box-shadow", "none");

  // =========================
  // 關閉公告（重點修改）
  // =========================
  $("#close-bar").on("click", function () {

    announcementClosed = true; // 👈 記錄已關閉

    $("#announcement-bar")
      .stop(true, true)
      .slideUp(100, function () {
        adjustSubMenu();
      });
  });

  // 點開手機選單時，也重新調整
  $(".menu-btn, .pushy-open-right .pushy").on("click", function () {
    adjustSubMenu();
  });

  // 瀏覽器 resize 時也調整
  $(window).on("resize", function () {
    adjustSubMenu();
  });

});