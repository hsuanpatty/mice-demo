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

// 控制自訂下拉選單 + 必填檢查
document.addEventListener("DOMContentLoaded", function () {
  // ===== 自訂下拉選單 =====
  document.querySelectorAll(".custom-select").forEach((select) => {
    const selected = select.querySelector(".selected");
    const options = select.querySelector(".options");
    const input = select.parentElement.querySelector('input[type="hidden"]');

    // 點擊開關
    selected.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = options.style.display === "block";
      document.querySelectorAll(".custom-select .options").forEach((opt) => {
        opt.style.display = "none";
      });
      options.style.display = isOpen ? "none" : "block";

      // 點選時移除紅框
      selected.classList.remove("error");
    });

    // 點選選項
    options.querySelectorAll("li").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        selected.textContent = option.textContent;
        input.value = option.dataset.value;
        options.style.display = "none";

        selected.classList.remove("error"); // 移除紅框
        selected.classList.add("has-value"); // 標記已選擇
        selected.style.color = "#000"; // 選到值後文字變黑
      });
    });
  });

  // 點外面收合所有下拉
  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select .options").forEach((options) => {
      options.style.display = "none";
    });
  });

  // ===== 表單必填檢查 =====
  document.getElementById("miceForm").addEventListener("submit", function (e) {
    let errorMsg = "";

    // 下拉選單檢查
    const selectFields = [
      { input: document.querySelector('input[name="theme"]'), label: "旅遊主題" },
      { input: document.querySelector('input[name="needs"]'), label: "需求項目" },
      { input: document.querySelector('input[name="days"]'), label: "預計天數" }
    ];

    selectFields.forEach((field) => {
      if (!field.input.value || field.input.value === "請選擇") {
        errorMsg += `請選擇【${field.label}】\n`;
        const selectedDiv = field.input.previousElementSibling;
        selectedDiv.classList.add("error");
        selectedDiv.style.color = "#000"; // 強調紅框內文字
      } else {
        field.input.previousElementSibling.classList.remove("error");
      }
    });

    // 文字欄位必填
    const textFields = [
      { input: document.querySelector('input[placeholder="請填市內電話或手機"]'), label: "聯絡電話" },
      { input: document.querySelector('input[placeholder="請填寫姓名"]'), label: "聯絡窗口" }
    ];

    textFields.forEach((field) => {
      if (!field.input.value.trim()) {
        errorMsg += `請填寫【${field.label}】\n`;
        field.input.classList.add("error");
      } else {
        field.input.classList.remove("error");
      }
    });

    if (errorMsg) {
      e.preventDefault();
      alert(errorMsg);

      // 自動滾動到第一個紅框欄位
      const firstError = document.querySelector(".error");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // 文字欄位輸入時移除紅框
  document.querySelectorAll(".form-row input, .form-row textarea").forEach((el) => {
    el.addEventListener("input", () => {
      if (el.value.trim() !== "") el.classList.remove("error");
    });
  });
});
