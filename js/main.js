// Angaza Africa — shared site behaviour (vanilla JS, no dependencies)

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initReveal();
  initGallery();
  initContactForm();
  initYear();
});

/* Mobile navigation toggle */
function initMobileNav() {
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.querySelector(".mobile-panel");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", function () {
    var isOpen = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  panel.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Scroll reveal for elements marked [data-reveal] */
function initReveal() {
  var items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach(function (el) { observer.observe(el); });
}

/* Lightweight gallery lightbox */
function initGallery() {
  var triggers = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.querySelector(".lightbox");
  if (!triggers.length || !lightbox) return;

  var lightboxImg = lightbox.querySelector("img");
  var closeBtn = lightbox.querySelector(".lightbox-close");
  var prevBtn = lightbox.querySelector(".lightbox-prev");
  var nextBtn = lightbox.querySelector(".lightbox-next");
  var currentIndex = 0;

  function openAt(index) {
    currentIndex = (index + triggers.length) % triggers.length;
    var img = triggers[currentIndex].querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("is-open");
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightboxImg.src = "";
  }

  triggers.forEach(function (trigger, index) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      openAt(index);
    });
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
  prevBtn.addEventListener("click", function () { openAt(currentIndex - 1); });
  nextBtn.addEventListener("click", function () { openAt(currentIndex + 1); });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") openAt(currentIndex - 1);
    if (e.key === "ArrowRight") openAt(currentIndex + 1);
  });
}

/* Contact form — no backend on static hosting, so we validate then open a
   pre-filled Gmail compose window with the visitor's message carried over. */
function initContactForm() {
  var form = document.querySelector("#contact-form");
  if (!form) return;

  var status = form.querySelector(".form-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.querySelector("#name").value.trim();
    var email = form.querySelector("#email").value.trim();
    var subject = form.querySelector("#subject").value.trim();
    var message = form.querySelector("#message").value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      setStatus("Please fill in your name, email, and message.", "error");
      return;
    }
    if (!emailPattern.test(email)) {
      setStatus("Please enter a valid email address.", "error");
      return;
    }

    var body = message + "\n\n— " + name + " (" + email + ")";
    var gmailCompose =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      "&to=" + encodeURIComponent("hello@angazafrica.org") +
      "&su=" + encodeURIComponent(subject || "Message from angazafrica.org") +
      "&body=" + encodeURIComponent(body);

    window.open(gmailCompose, "_blank", "noopener,noreferrer");
    setStatus("Your message has been transferred to Gmail in a new tab — press send there to reach hello@angazafrica.org.", "success");
  });

  function setStatus(text, state) {
    status.textContent = text;
    status.setAttribute("data-state", state);
  }
}

function initYear() {
  var el = document.querySelector("#current-year");
  if (el) el.textContent = new Date().getFullYear();
}
