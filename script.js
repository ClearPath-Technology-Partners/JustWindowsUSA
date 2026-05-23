const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const year = document.querySelector("[data-year]");
const quoteForms = document.querySelectorAll(".quote-card, .quote-form");
const videoLoads = document.querySelectorAll(".video-load");

if (year) {
  year.textContent = new Date().getFullYear();
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

quoteForms.forEach((quoteForm) => {
  quoteForm.addEventListener("submit", (event) => {
    const formNote = quoteForm.querySelector("[data-form-note]");

    event.preventDefault();
    if (formNote) {
      formNote.textContent =
        "Thanks. Please call (440) 668-4065 to confirm your appointment while this static form is connected to Azure.";
      formNote.setAttribute("role", "status");
    }
    quoteForm.reset();
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
