const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const year = document.querySelector("[data-year]");
const quoteForms = document.querySelectorAll(".quote-card, .quote-form");

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
