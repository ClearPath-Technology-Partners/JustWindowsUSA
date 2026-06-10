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

quoteForms.forEach((quoteForm) => {
  quoteForm.addEventListener("submit", async (event) => {
    const formNote = quoteForm.querySelector("[data-form-note]");
    const submitBtn = quoteForm.querySelector("button[type=submit]");

    event.preventDefault();

    if (submitBtn) submitBtn.disabled = true;
    if (formNote) {
      formNote.textContent = "Sending your request…";
      formNote.setAttribute("role", "status");
    }

    const data = {
      name: quoteForm.querySelector("[name=name]")?.value || "",
      phone: quoteForm.querySelector("[name=phone]")?.value || "",
      email: quoteForm.querySelector("[name=email]")?.value || "",
      project: Array.from(quoteForm.querySelectorAll("[name=services]:checked")).map(cb => cb.value).join(", ") || "",
      message: quoteForm.querySelector("[name=message]")?.value || "",
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
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});

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
