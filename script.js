const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const siteHeader = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const quoteForms = document.querySelectorAll(".quote-card, .quote-form");
const videoLoads = document.querySelectorAll(".video-load");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (siteHeader) {
  const setHeaderHeight = () => {
    document.documentElement.style.setProperty("--header-h", siteHeader.offsetHeight + "px");
  };
  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const WEBHOOK_URL = "https://hook.us2.make.com/28cg2mxxubr5tqvuagcyg2nh4aj1sq3j";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Nothing reaches the webhook unless name, phone, email, and at least one service are
// filled in, so downstream automation never receives a half-empty lead.
const markField = (field, isValid) => {
  if (!field) return;
  field.classList.toggle("is-invalid", !isValid);
  field.setAttribute("aria-invalid", isValid ? "false" : "true");
};

const listMissing = (items) =>
  items.length < 3
    ? items.join(" and ")
    : items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];

const validateQuoteForm = (quoteForm) => {
  const missing = [];

  const nameField = quoteForm.querySelector("[name=name]");
  const nameOk = Boolean(nameField && nameField.value.trim());
  markField(nameField, nameOk);
  if (!nameOk) missing.push("your name");

  const phoneField = quoteForm.querySelector("[name=phone]");
  const phoneOk = Boolean(phoneField && phoneField.value.replace(/\D/g, "").length >= 10);
  markField(phoneField, phoneOk);
  if (!phoneOk) missing.push("a phone number with at least 10 digits");

  const emailField = quoteForm.querySelector("[name=email]");
  const emailOk = Boolean(emailField && EMAIL_PATTERN.test(emailField.value.trim()));
  markField(emailField, emailOk);
  if (!emailOk) missing.push("a valid email address");

  const servicePills = quoteForm.querySelector(".service-pills");
  const services = Array.from(quoteForm.querySelectorAll("[name=services]"));
  const servicesOk = services.some((cb) => cb.checked);
  if (servicePills) servicePills.classList.toggle("is-invalid", !servicesOk);
  services.forEach((cb) => cb.setAttribute("aria-invalid", servicesOk ? "false" : "true"));
  if (!servicesOk) missing.push("at least one service (Windows, Doors, or Siding)");

  const firstInvalid =
    (!nameOk && nameField) ||
    (!phoneOk && phoneField) ||
    (!emailOk && emailField) ||
    (!servicesOk && (servicePills || services[0])) ||
    null;

  return { missing, firstInvalid };
};

quoteForms.forEach((quoteForm) => {
  // Turn off the browser's own bubbles so every problem, including the service
  // checkboxes the browser cannot group-validate, is reported together.
  quoteForm.setAttribute("novalidate", "");

  const formNote = quoteForm.querySelector("[data-form-note]");
  const submitBtn = quoteForm.querySelector("button[type=submit]");

  const clearFieldError = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("[name=services]")) {
      const pills = quoteForm.querySelector(".service-pills");
      if (pills) pills.classList.remove("is-invalid");
      quoteForm
        .querySelectorAll("[name=services]")
        .forEach((cb) => cb.setAttribute("aria-invalid", "false"));
      return;
    }
    target.classList.remove("is-invalid");
    target.setAttribute("aria-invalid", "false");
  };

  quoteForm.addEventListener("input", clearFieldError);
  quoteForm.addEventListener("change", clearFieldError);

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { missing, firstInvalid } = validateQuoteForm(quoteForm);

    if (missing.length) {
      if (formNote) {
        formNote.textContent = "Please add " + listMissing(missing) + " before sending your request.";
        formNote.setAttribute("role", "alert");
        formNote.classList.add("is-error");
      }
      if (firstInvalid && typeof firstInvalid.focus === "function") {
        firstInvalid.focus({ preventScroll: true });
        firstInvalid.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (formNote) {
      formNote.textContent = "Sending your request…";
      formNote.setAttribute("role", "status");
      formNote.classList.remove("is-error");
    }

    const data = {
      name: quoteForm.querySelector("[name=name]").value.trim(),
      phone: quoteForm.querySelector("[name=phone]").value.trim(),
      email: quoteForm.querySelector("[name=email]").value.trim(),
      project: Array.from(quoteForm.querySelectorAll("[name=services]:checked")).map(cb => cb.value).join(", "),
      message: quoteForm.querySelector("[name=message]")?.value.trim() || "",
      submittedAt: new Date().toISOString(),
      source: window.location.href,
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      if (formNote) {
        formNote.textContent =
          "Thanks! We received your request and you'll hear from us shortly. For urgent questions call (440) 668-4065.";
      }
      quoteForm.reset();
    } catch {
      if (formNote) {
        formNote.textContent =
          "Something went wrong. Please call us at (440) 668-4065 and we'll get you a quote right away.";
        formNote.classList.add("is-error");
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});

// Scroll reveal. Grid children stagger by position; standalone blocks fade in on their own.
// The .anim-ready class that arms the hidden CSS state is set inline in each page head.
const REVEAL_GROUPS =
  ".split, .content-grid, .details-grid, .card-grid, .service-grid, .reviews-grid, .reviews-list, .contact-grid, .why-grid, .trust-grid, .contact-methods, .gallery-page-grid, .process";
const REVEAL_SINGLES = ".section-heading, .feature-panel, .rating-summary, .fb-embed";

if (document.documentElement.classList.contains("anim-ready")) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );

  const observeReveal = (el, delay) => {
    el.classList.add("reveal");
    if (delay) el.style.transitionDelay = delay + "ms";
    revealObserver.observe(el);
  };

  document.querySelectorAll(REVEAL_GROUPS).forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      observeReveal(child, Math.min(index, 5) * 70);
    });
  });

  document.querySelectorAll(REVEAL_SINGLES).forEach((el) => observeReveal(el, 0));
}

// Facebook plugins render at a fixed 500px width, so scale each to fit its container.
const fbEmbeds = document.querySelectorAll(".fb-embed");

if (fbEmbeds.length) {
  const setFbScale = () => {
    fbEmbeds.forEach((embed) => {
      const available = embed.parentElement.clientWidth;
      // Layout is not always resolved when this deferred script runs; a 0 here
      // would scale the embed to nothing, so leave the CSS default of 1 in place.
      if (!available) return;
      embed.style.setProperty("--fb-scale", String(Math.min(1, available / 500)));
    });
  };
  setFbScale();
  window.addEventListener("resize", setFbScale);
  window.addEventListener("load", setFbScale);
}

videoLoads.forEach((videoLoad) => {
  videoLoad.addEventListener("click", () => {
    const videoSrc = videoLoad.getAttribute("data-video-src");
    const videoPoster = videoLoad.getAttribute("data-video-poster");

    if (!videoSrc) return;

    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.preload = "metadata";
    if (videoPoster) video.poster = videoPoster;
    video.innerHTML = `<source src="${videoSrc}" type="video/mp4">Your browser does not support the video tag.`;
    videoLoad.replaceWith(video);
  });
});
