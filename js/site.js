(function () {
  // Mobile navigation toggle
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close menu when clicking a link
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // Add scrolled class to nav
  window.addEventListener(
    "scroll",
    function () {
      if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Set current page indicator
  const currentPath = window.location.pathname;
  if (links) {
    links.querySelectorAll("a").forEach(function (link) {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  // Flagship chapter scroll spy
  const chapterLinks = document.querySelectorAll(".chapter-link");
  const chapters = document.querySelectorAll(".flagship-chapter");

  if (chapterLinks.length > 0 && chapters.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          chapterLinks.forEach(function (link) {
            link.classList.remove("is-active");
            if (link.getAttribute("href") === "#" + id) {
              link.classList.add("is-active");
            }
          });
        }
      });
    }, observerOptions);

    chapters.forEach(function (chapter) {
      observer.observe(chapter);
    });
  }
})();
