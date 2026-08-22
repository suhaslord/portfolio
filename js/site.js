(function () {
  // Gate for CSS that must only apply when JS is running (reveal states)
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  // Smooth scroll for anchor links (instant when reduced motion is preferred)
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
          behavior: reduceMotion.matches ? "auto" : "smooth",
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

  // Shared reveal language: mark [data-reveal] elements once they enter.
  // CSS decides whether a hidden initial state exists (JS + motion allowed),
  // so this observer is inert for reduced-motion users and no-JS visitors.
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (revealEls.length > 0) {
    if ("IntersectionObserver" in window && !reduceMotion.matches) {
      const revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
      );

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-inview");
      });
    }
  }

  // Sticky mobile Email CTA: appears after ~300px of scroll on small screens,
  // hides near the contact section, dismissible for the session.
  const mobileCta = document.getElementById("mobileCta");

  if (mobileCta) {
    const DISMISS_KEY = "mobileCtaDismissed";
    const smallScreen = window.matchMedia("(max-width: 700px)");
    const contactSection = document.getElementById("contact");
    let dismissed = false;
    let nearContact = false;

    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch (err) {
      /* storage unavailable: bar stays dismissible per page load */
    }

    mobileCta.hidden = false;

    const update = function () {
      const show =
        !dismissed && smallScreen.matches && window.scrollY > 300 && !nearContact;
      mobileCta.classList.toggle("is-shown", show);
    };

    if (contactSection && "IntersectionObserver" in window) {
      const contactObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            nearContact = entry.isIntersecting;
          });
          update();
        },
        { rootMargin: "0px 0px 10% 0px", threshold: 0 }
      );
      contactObserver.observe(contactSection);
    }

    const dismissBtn = mobileCta.querySelector(".mobile-cta-dismiss");
    if (dismissBtn) {
      dismissBtn.addEventListener("click", function () {
        dismissed = true;
        try {
          sessionStorage.setItem(DISMISS_KEY, "1");
        } catch (err) {
          /* ignore */
        }
        update();
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    if (typeof smallScreen.addEventListener === "function") {
      smallScreen.addEventListener("change", update);
    }
    update();
  }
})();
