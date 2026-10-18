// Wait until the HTML has been parsed before using its elements.

// FEATURE 1: Mobile navigation menu
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const navLinkItems = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the mobile menu after someone chooses a navigation link.
navLinkItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// FEATURE 2: Dark/light theme toggle
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
});

// FEATURE 3: Highlight the navigation link for the section in view
const pageSections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const currentId = entry.target.id;

      navLinkItems.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${currentId}`;

        link.classList.toggle("active", isCurrent);

        if (isCurrent) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }
  });
}, {
  // Treat the middle portion of the screen as the active section.
  rootMargin: "-35% 0px -55% 0px"
});

pageSections.forEach((section) => sectionObserver.observe(section));

// FEATURE 4: Filter project cards by category
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const filterStatus = document.querySelector("#filter-status");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    projectCards.forEach((card) => {
      const shouldShow =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    const categoryName =
      selectedCategory === "all" ? "all" : selectedCategory;

    filterStatus.textContent =
      `Showing ${visibleCount} ${categoryName} project${visibleCount === 1 ? "" : "s"}.`;
  });
});

// FEATURE 5: Back-to-top button
const backToTopButton = document.querySelector("#back-to-top");

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth"
  });
});

// FEATURE 6: Contact form validation (demo only; no message is sent)
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    formStatus.textContent = "Please fill in all fields with valid information.";
    return;
  }

  const visitorName = document.querySelector("#visitor-name").value.trim();

  if (visitorName.length === 0) {
    formStatus.textContent = "Please enter your name.";
    document.querySelector("#visitor-name").focus();
    return;
  }

  formStatus.textContent =
    "Thanks, " + visitorName + "! The demo form passed validation, but no message was sent.";
  contactForm.reset();
});

// Small finishing detail: update the copyright year automatically.
document.querySelector("#current-year").textContent = new Date().getFullYear();
