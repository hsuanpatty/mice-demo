// ----------------- 滑動導航（不卡優化版） -----------------
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".scroll-tag .section");
  const sections = document.querySelectorAll("section");

  if (!navItems.length || !sections.length) return;

  // 初始化 active
  navItems.forEach((item, index) => {
    item.classList.toggle("active", index === 0);
  });

  let firstClickDone = false; // 標記第一次點擊

  function smoothScrollTo(targetY, duration = 800) {
    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // easeInOutCubic 漸進效果
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + distance * ease);

      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
  }

  // 點擊 nav
  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const section = sections[index];
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const targetY = scrollTop + rect.top - window.innerHeight / 2 + rect.height / 2;

      if (!firstClickDone) {
        // 第一次使用 native smooth，不卡
        section.scrollIntoView({ behavior: "smooth", block: "center" });
        firstClickDone = true;
      } else {
        // 之後慢速滑動
        smoothScrollTo(targetY, 1000);
      }

      // 更新 active
      navItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // 滾動監聽，切換 active
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach((section, index) => {
      if (!section) return;
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navItems.forEach((el) => el.classList.remove("active"));
        navItems[index].classList.add("active");
      }
    });
  });
});

// ----------------- 自訂下拉選單 + 表單必填檢查 -----------------
document.addEventListener("DOMContentLoaded", function () {
  // ===== 自訂下拉選單 =====
  document.querySelectorAll(".custom-select").forEach((select) => {
    if (!select) return;

    const selected = select.querySelector(".selected");
    const options = select.querySelector(".options");
    const input = select.parentElement
      ? select.parentElement.querySelector('input[type="hidden"]')
      : null;

    if (!selected || !options || !input) {
      console.warn("custom-select 元素不完整", select);
      return;
    }

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
      if (!option) return;
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        selected.textContent = option.textContent;
        input.value = option.dataset.value || "";
        options.style.display = "none";

        selected.classList.remove("error"); 
        selected.classList.add("has-value"); 
        selected.style.color = "#000"; 
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
  const form = document.getElementById("miceForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      let errorMsg = "";

      // 下拉選單檢查
      const selectFields = [
        { input: document.querySelector('input[name="theme"]'), label: "旅遊主題" },
        { input: document.querySelector('input[name="needs"]'), label: "需求項目" },
        { input: document.querySelector('input[name="days"]'), label: "預計天數" }
      ];

      selectFields.forEach((field) => {
        if (!field.input) {
          console.warn(`找不到 ${field.label} 對應的 input`);
          return;
        }
        if (!field.input.value || field.input.value === "請選擇") {
          errorMsg += `請選擇【${field.label}】\n`;
          const selectedDiv = field.input.previousElementSibling;
          if (selectedDiv) {
            selectedDiv.classList.add("error");
            selectedDiv.style.color = "#000"; // 強調紅框內文字
          }
        } else {
          if (field.input.previousElementSibling) {
            field.input.previousElementSibling.classList.remove("error");
          }
        }
      });

      // 文字欄位必填
      const textFields = [
        { input: document.querySelector('input[placeholder="請填市內電話或手機"]'), label: "聯絡電話" },
        { input: document.querySelector('input[placeholder="請填寫姓名"]'), label: "聯絡窗口" }
      ];

      textFields.forEach((field) => {
        if (!field.input) {
          console.warn(`找不到 ${field.label} 對應的 input`);
          return;
        }
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
  }

  // 文字欄位輸入時移除紅框
  document.querySelectorAll(".form-row input, .form-row textarea").forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      if (el.value.trim() !== "") el.classList.remove("error");
    });
  });
});
