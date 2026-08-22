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

  // --page-progress 0–1 drives the nav hairline (and any other scrub)
  // when scroll-driven animations are missing. Dumb write; CSS decides.
  var progressTick = 0;
  function writeProgress() {
    progressTick = 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    document.documentElement.style.setProperty("--page-progress", p.toFixed(4));
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!progressTick) {
        progressTick = window.requestAnimationFrame(writeProgress);
      }
    },
    { passive: true }
  );
  writeProgress();

  // Sticky chapter rail height on stacked layouts (0 on desktop sidebar).
  // ≤640px: .chapters-nav is the sticky box. 641–1024: the aside is.
  function railOffset() {
    const stacked = window.matchMedia("(max-width: 1024px)").matches;
    if (!stacked) return 0;
    const navRail = document.querySelector("#flagship .chapters-nav");
    const aside = document.getElementById("flagshipChapters");
    const navSticky = navRail && window.getComputedStyle(navRail).position === "sticky";
    const asideSticky = aside && window.getComputedStyle(aside).position === "sticky";
    const el = navSticky ? navRail : asideSticky ? aside : null;
    return el ? el.offsetHeight : 0;
  }

  // Smooth scroll for anchor links (instant when reduced motion is preferred)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.offsetTop - navHeight - railOffset() - 12;

        window.scrollTo({
          top: targetPosition,
          behavior: reduceMotion.matches ? "auto" : "smooth",
        });
      }
    });
  });

  // Set current page indicator (skip same-page hash links: they are section
  // anchors, not pages, and would all light up at once)
  const currentPath = window.location.pathname;
  if (links) {
    links.querySelectorAll("a").forEach(function (link) {
      const url = new URL(link.href);
      if (url.pathname === currentPath && !url.hash) {
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

              // Keep the active chip latched in view when the rail is a
              // horizontal scroller (stacked layouts)
              const rail = link.closest(".chapters-nav");
              if (rail && rail.scrollWidth > rail.clientWidth) {
                rail.scrollTo({
                  left: Math.max(0, link.offsetLeft - 24),
                  behavior: reduceMotion.matches ? "auto" : "smooth",
                });
              }
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
