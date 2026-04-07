(function () {
  "use strict";

  // Mobile navigation
  const toggle = document.querySelector(".nav-toggle");
  const navWrap = document.querySelector(".nav-wrap");

  if (toggle && navWrap) {
    toggle.addEventListener("click", function () {
      const open = navWrap.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    navWrap.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navWrap.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // Scroll reveal
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    var revealEls = document.querySelectorAll(".reveal, .stagger-children");
    if (revealEls.length && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  } else {
    document.querySelectorAll(".reveal, .stagger-children").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Portfolio category filter
  var filterRoot = document.querySelector("[data-portfolio-filter]");
  if (filterRoot) {
    var buttons = filterRoot.querySelectorAll(".filter-btn");
    var items = filterRoot.querySelectorAll(".portfolio-item");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");
        buttons.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        items.forEach(function (item) {
          var itemCat = item.getAttribute("data-category");
          var show = cat === "all" || itemCat === cat;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  // Contact form (client-side acknowledgment)
  var form = document.getElementById("contact-form");
  if (form) {
    var statusEl = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (statusEl) {
        statusEl.textContent = "Thanks — we’ll get back to you shortly.";
        statusEl.classList.add("success");
      }
      form.reset();
    });
  }
})();
