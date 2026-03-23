// ----------------- 滑動導航（不卡優化版） -----------------
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".scroll-tag .section");
  const sections = document.querySelectorAll("section");

  if (!navItems.length || !sections.length) return;

  // 初始化 active
  navItems.forEach((item, index) => {
    item.classList.toggle("active", index === 0);
  });

  let firstClickDone = false;

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
        section.scrollIntoView({ behavior: "smooth", block: "center" });
        firstClickDone = true;
      } else {
        smoothScrollTo(targetY, 1000);
      }

      // 更新 active
      navItems.forEach(el => el.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // 滾動監聽，切換 active
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach((section, index) => {
      if (!section) return;
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navItems.forEach(el => el.classList.remove("active"));
        navItems[index].classList.add("active");
      }
    });
  });
});

// ----------------- 自訂下拉選單 + 表單必填檢查 -----------------
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("miceForm");
  if (!form) {
    console.warn("找不到 #miceForm 表單，表單功能未啟用");
    return;
  }

  // ===== tooltip 函式 =====
  function showTooltip(el, msg) {
    removeTooltip(el);
    const tip = document.createElement("div");
    tip.className = "form-tooltip";
    tip.textContent = msg;
    el.parentElement.appendChild(tip);
    setTimeout(() => tip.classList.add("show"), 10);
  }

  function removeTooltip(el) {
    const old = el.parentElement.querySelector(".form-tooltip");
    if (old) old.remove();
  }

  // ===== 自訂下拉選單 =====
  document.querySelectorAll(".custom-select").forEach(select => {
    const selected = select.querySelector(".selected");
    const options = select.querySelector(".options");
    const input = select.parentElement.querySelector("input[type='hidden']");

    if (!selected || !options || !input) return;

    // 點擊選單
    selected.addEventListener("click", e => {
      e.stopPropagation();
      const isOpen = options.style.display === "block";

      // 先關閉其他選單
      document.querySelectorAll(".custom-select .options").forEach(o => {
        o.style.display = "none";
        o.parentElement.classList.remove("open");
      });

      options.style.display = isOpen ? "none" : "block";
      if (!isOpen) select.classList.add("open");
    });

    // 點擊選項
    options.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", e => {
        e.stopPropagation();
        selected.textContent = li.textContent;
        input.value = li.dataset.value;
        options.style.display = "none";
        select.classList.remove("open");
        select.classList.remove("error");
        removeTooltip(selected);
      });
    });
  });

  // 點擊空白關閉下拉選單
  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select .options").forEach(o => o.style.display = "none");
    document.querySelectorAll(".custom-select").forEach(select => select.classList.remove("open"));
  });

  // ===== 表單驗證 =====
  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    // 清除舊錯誤
    document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
    document.querySelectorAll(".form-tooltip").forEach(el => el.remove());

    // 驗證下拉選單
    const dropdowns = [
      { name: "theme", msg: "請選擇旅遊主題" },
      { name: "needs", msg: "請選擇需求項目" },
      { name: "days", msg: "請選擇預計天數" }
    ];

    dropdowns.forEach(d => {
      const input = form.querySelector(`input[name="${d.name}"]`);
      if (!input || !input.value) {
        const sel = input?.parentElement.querySelector(".custom-select");
        if (sel) sel.classList.add("error");
        if (sel) showTooltip(sel.querySelector(".selected"), d.msg);
        valid = false;
      }
    });

    // 驗證電話
    const phone = form.querySelector('input[name="phone"]');
    if (!phone || !phone.value.trim()) {
      phone?.classList.add("error");
      phone && showTooltip(phone, "請填寫有效的電話或手機號碼至少10位數");
      valid = false;
    } else if (!/^\d{10,}$/.test(phone.value)) {
      phone.classList.add("error");
      showTooltip(phone, "至少10位數");
      valid = false;
    }

    // 驗證姓名
    const name = form.querySelector('input[name="name"]');
    if (!name || !name.value.trim()) {
      name?.classList.add("error");
      name && showTooltip(name, "請填寫真實姓名");
      valid = false;
    }

    if (valid) {
      alert("送出成功！");
      form.submit();
    }
  });

  // ===== 輸入框輸入時清除紅框和 tooltip =====
  form.querySelectorAll("input, textarea").forEach(el => {
    el.addEventListener("input", () => {
      el.classList.remove("error");
      removeTooltip(el);
    });
  });
});
