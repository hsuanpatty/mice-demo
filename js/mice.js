 // 指定位置 滑動
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".scroll-tag .section");
  const sections = document.querySelectorAll("section");

  navItems.forEach((item, index) => {
    if (index === 0) item.classList.add("active");
    else item.classList.remove("active");
  });

  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      sections[index].scrollIntoView({ behavior: "smooth" });

      // 點擊後更新 active
      navItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
    });
  });

  window.addEventListener("scroll", () => {
    let scrollPosition = window.scrollY;
    sections.forEach((section, index) => {
      if (
        scrollPosition >= section.offsetTop - section.offsetHeight / 2 &&
        scrollPosition < section.offsetTop + section.offsetHeight / 2
      ) {
        navItems.forEach((el) => el.classList.remove("active"));
        navItems[index].classList.add("active");
      }
    });
  });
});

 // 控制自訂下拉選單
document.querySelectorAll(".custom-select").forEach((select) => {
  const selected = select.querySelector(".selected");
  const options = select.querySelector(".options");
  const input = select.parentElement.querySelector('input[type="hidden"]');

  selected.addEventListener("click", () => {
    options.style.display = options.style.display === "block" ? "none" : "block";
  });

  options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      selected.textContent = option.textContent;
      input.value = option.dataset.value;
      options.style.display = "none";
    });
  });

// 點外面收合
  document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) options.style.display = "none";
  });
});