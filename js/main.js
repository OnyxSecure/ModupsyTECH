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

  // Contact form → Formspree (AJAX, stays on page)
  var form = document.getElementById("contact-form");
  if (form) {
    var statusEl = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var action = form.getAttribute("action") || "";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!action || action.indexOf("formspree.io") === -1 || action.indexOf("xjgpzkea") !== -1) {
        if (statusEl) {
          statusEl.textContent =
            "Set your Formspree URL: in contact.html, replace YOUR_FORM_ID in the form’s action with your form ID from Formspree.";
          statusEl.classList.remove("success");
          statusEl.classList.add("form-error");
        }
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var defaultLabel = submitBtn ? submitBtn.getAttribute("data-default-label") || submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      if (statusEl) {
        statusEl.textContent = "";
        statusEl.classList.remove("success", "form-error");
      }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          return res
            .json()
            .catch(function () {
              return {};
            })
            .then(function (data) {
              return { res: res, data: data };
            });
        })
        .then(function (result) {
          if (result.res.ok) {
            if (statusEl) {
              statusEl.textContent = "Thanks — we’ll get back to you shortly.";
              statusEl.classList.add("success");
              statusEl.classList.remove("form-error");
            }
            form.reset();
          } else {
            var err0 = result.data.errors && result.data.errors[0];
            var msg =
              (result.data && result.data.error) ||
              (typeof err0 === "string" ? err0 : err0 && err0.message) ||
              "Something went wrong. Try again or email us directly.";
            if (statusEl) {
              statusEl.textContent = typeof msg === "string" ? msg : "Please check the form and try again.";
              statusEl.classList.add("form-error");
            }
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent = "Network error. Check your connection and try again.";
            statusEl.classList.add("form-error");
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = defaultLabel;
          }
        });
    });
  }
})();
