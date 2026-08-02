document.addEventListener("DOMContentLoaded", function () {
  var root = document.documentElement;

  var savedTheme = localStorage.getItem("pf-theme");
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else {
    root.setAttribute("data-theme", "dark");
  }

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("pf-theme", next);
    });
  }

  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });

    var current = location.pathname.split("/").pop() || "index.html";
    nav.querySelectorAll("a").forEach(function (link) {
      var href = link.getAttribute("href").split("/").pop();
      if (href === current) {
        link.classList.add("active");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".hero, .section, .project-hero, .card");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    targets.forEach(function (el) {
      el.classList.add("will-reveal");
      observer.observe(el);
    });
  }

  document.querySelectorAll(".card").forEach(function (card, i) {
    if (!card.querySelector("img")) return;
    var num = document.createElement("span");
    num.className = "card-num";
    num.textContent = String(i + 1).padStart(2, "0");
    card.prepend(num);
  });

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var progress = document.createElement("div");
  progress.className = "progress";
  document.body.appendChild(progress);

  var toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Наверх");
  toTop.textContent = "↑";
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.appendChild(toTop);

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = pct + "%";
      toTop.classList.toggle("show", window.scrollY > 420);
      ticking = false;
    });
  }, { passive: true });

  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          cObs.unobserve(el);
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          var dur = 900;
          var start = null;
          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cObs.observe(el); });
  }

  var filterBtns = document.querySelectorAll("[data-filter]");
  var filterCards = document.querySelectorAll("[data-tags]");
  if (filterBtns.length && filterCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        var f = btn.getAttribute("data-filter");
        filterCards.forEach(function (card) {
          var tags = (card.getAttribute("data-tags") || "").split(",");
          var show = f === "all" || tags.indexOf(f) !== -1;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("cfName").value.trim();
      var msg = document.getElementById("cfMsg").value.trim();
      if (!msg) return;
      var text = (name ? "Имя: " + name + "\n" : "") + "Сообщение: " + msg;
      window.open("https://t.me/juzoxll44?text=" + encodeURIComponent(text), "_blank");
    });
  }
});
