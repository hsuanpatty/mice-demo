// ----------------- 滑動導航（不卡優化版） -----------------
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".scroll-tag .section");
  const sections = document.querySelectorAll("section");

  // 👉 等畫面穩定再啟動（關鍵）
  setTimeout(initScrollNav, 100);

  function initScrollNav() {
    // 👉 自訂滑動動畫
    function smoothScrollTo(targetY, duration = 800) {
      const startY = window.scrollY;
      const distance = targetY - startY;
      let startTime = null;

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeOutCubic(progress);

        window.scrollTo(0, startY + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }

    if (navItems.length && sections.length) {
      navItems.forEach((item, index) => {
        item.classList.toggle("active", index === 0);
      });

      navItems.forEach((item, index) => {
        item.addEventListener("click", () => {
          const section = sections[index];
          if (!section) return;

          const h2 = section.querySelector("h2");

          if (h2) {
            const rect = h2.getBoundingClientRect();
            const scrollTop = window.scrollY;

            const targetY =
              scrollTop +
              rect.top -
              window.innerHeight / 2 +
              rect.height / 2;

            smoothScrollTo(targetY, 800);
          }

          navItems.forEach((el) => el.classList.remove("active"));
          item.classList.add("active");
        });
      });

      // 👉 scroll 監聽（加 requestAnimationFrame 防卡）
      let ticking = false;

      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollMiddle = window.scrollY + window.innerHeight / 2;

            sections.forEach((section, index) => {
              const top = section.offsetTop;
              const bottom = top + section.offsetHeight;

              if (scrollMiddle >= top && scrollMiddle < bottom) {
                navItems.forEach((el) => el.classList.remove("active"));
                if (navItems[index]) navItems[index].classList.add("active");
              }
            });

            ticking = false;
          });

          ticking = true;
        }
      });
    }
  }
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
