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
  const form = document.getElementById("miceForm");

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

    selected.addEventListener("click", e => {
      e.stopPropagation(); // 停止冒泡，避免全局 click 立即收起
      const isOpen = options.style.display === "block";

      // 先收起其他選單
      document.querySelectorAll(".custom-select .options").forEach(o => {
        o.style.display = "none";
        o.parentElement.classList.remove("open");
      });

      // 切換自己
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

  // 點擊其他地方收起所有選單
  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select .options").forEach(o => o.style.display = "none");
    document.querySelectorAll(".custom-select").forEach(select => select.classList.remove("open"));
  });

  // ===== 表單驗證 =====
  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;
    document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
    document.querySelectorAll(".form-tooltip").forEach(el => el.remove());

    const dropdowns = [
      { name: "theme", msg: "請選擇項目" },
      { name: "needs", msg: "請選擇需求" },
      { name: "days", msg: "請選擇天數" }
    ];

    dropdowns.forEach(d => {
      const input = document.querySelector(`input[name="${d.name}"]`);
      if (!input.value) {
        const sel = input.parentElement.querySelector(".custom-select");
        if (!["theme","needs","days"].includes(d.name)) sel.classList.add("error");
        showTooltip(sel.querySelector(".selected"), d.msg);
        valid = false;
      }
    });

    const phone = document.querySelector('input[name="phone"]');
    if (!phone.value.trim()) {
      phone.classList.add("error");
      showTooltip(phone, "請填寫有效的電話or手機號碼至少10位數");
      valid = false;
    } else if (!/^\d{8,}$/.test(phone.value)) {
      phone.classList.add("error");
      showTooltip(phone, "至少10位數");
      valid = false;
    }

    const name = document.querySelector('input[name="name"]');
    if (!name.value.trim()) {
      name.classList.add("error");
      showTooltip(name, "請填寫姓名");
      valid = false;
    }

    if (valid) {
      alert("送出成功！");
      form.submit();
    }
  });

  // ===== 輸入框輸入時清除紅框和 tooltip =====
  document.querySelectorAll("input, textarea").forEach(el => {
    el.addEventListener("input", () => {
      el.classList.remove("error");
      removeTooltip(el);
    });
  });
});
