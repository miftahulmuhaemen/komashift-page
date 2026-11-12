(function () {
  "use strict";

  // ---- Desktop nav dropdowns (open on click, close on outside click / Escape) ----
  var triggers = document.querySelectorAll("[data-menu]");
  triggers.forEach(function (trigger) {
    var menu = document.getElementById("menu-" + trigger.getAttribute("data-menu"));
    if (!menu) return;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.contains("open");
      closeAllMenus();
      if (!isOpen) {
        menu.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    menu.addEventListener("click", function (e) { e.stopPropagation(); });
  });

  function closeAllMenus() {
    document.querySelectorAll(".menu.open").forEach(function (m) { m.classList.remove("open"); });
    triggers.forEach(function (t) { t.setAttribute("aria-expanded", "false"); });
  }

  document.addEventListener("click", closeAllMenus);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeAllMenus(); closeMobile(); }
  });

  // ---- Mobile panel ----
  var toggle = document.querySelector("[data-menu-toggle]");
  var panel = document.querySelector("[data-mobile-panel]");

  function closeMobile() {
    if (!panel || !toggle) return;
    panel.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMobile);
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1000) closeMobile();
  });

  // ---- Placeholder links ----
  document.querySelectorAll("[data-placeholder]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      link.setAttribute("aria-label", "Placeholder link — not yet available");
    });
  });

  // ---- FAQ: one open at a time ----
  var faqItems = document.querySelectorAll(".faq-item details");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  // ---- Scroll reveal (reduced-motion safe) ----
  var revealEls = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
