(function () {
  // Gate for CSS that must only apply when JS is running (reveal states)
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var syncMobileCta = function () {};

  // Mobile navigation toggle
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      syncMobileCta();
    });

    // Close menu when clicking a link
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        syncMobileCta();
      });
    });
  }

  // --page-progress 0–1 drives the nav hairline (and any other scrub)
  // when scroll-driven animations are missing. Dumb write; CSS decides.
  var progressTick = 0;
  var flagship = document.getElementById("flagship");
  var hero = document.getElementById("top");
  function writeProgress() {
    progressTick = 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    document.documentElement.style.setProperty("--page-progress", p.toFixed(4));
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);

    if (hero) {
      var heroRect = hero.getBoundingClientRect();
      var heroTravel = Math.max(1, hero.offsetHeight);
      var hp = Math.max(0, Math.min(1, -heroRect.top / heroTravel));
      document.documentElement.style.setProperty("--hero-progress", hp.toFixed(4));
    }

    if (flagship) {
      var rect = flagship.getBoundingClientRect();
      var travel = Math.max(1, flagship.offsetHeight - window.innerHeight);
      var fp = Math.max(0, Math.min(1, -rect.top / travel));
      document.documentElement.style.setProperty("--flagship-progress", fp.toFixed(4));
    }
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
  window.addEventListener("resize", writeProgress);
  writeProgress();

  function railOffset() {
    const stacked = window.matchMedia("(max-width: 1024px)").matches;
    if (!stacked) return 0;
    const rail = document.getElementById("flagshipChapters");
    return rail && window.getComputedStyle(rail).position === "sticky"
      ? rail.offsetHeight
      : 0;
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

  // Flagship chapter scroll spy.
  // Threshold sync, not an IntersectionObserver band: the active chapter
  // is the last one whose top has crossed the reading line, recomputed
  // every scroll frame. An observer band only fires on edge events, so
  // the rail could lag a chapter behind (Method lit while Numbers was
  // on screen). This can never be stale.
  const chapterLinks = document.querySelectorAll(".chapter-link");
  const chapters = document.querySelectorAll(".flagship-chapter");

  if (chapterLinks.length > 0 && chapters.length > 0) {
    const rail = document.getElementById("flagshipChapters");
    let markedId = null;

    function markChapter(id) {
      if (id === markedId) return;
      markedId = id;
      var activeIndex = -1;
      chapterLinks.forEach(function (link, i) {
        var on = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-active", on);
        if (on) {
          activeIndex = i;
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
      chapterLinks.forEach(function (link, i) {
        link.classList.toggle("is-past", activeIndex >= 0 && i < activeIndex);
      });
      if (rail) {
        rail.style.setProperty("--chapter-i", String(Math.max(0, activeIndex)));
      }
      if (activeIndex >= 0 && rail && rail.scrollWidth > rail.clientWidth) {
        var activeLink = chapterLinks[activeIndex];
        rail.scrollTo({
          left: Math.max(0, activeLink.offsetLeft - 24),
          behavior: reduceMotion.matches ? "auto" : "smooth",
        });
      }
    }

    let spyTick = 0;
    function syncChapter() {
      spyTick = 0;
      // Reading line: below the site nav and the latched rail, about a
      // third of the way down the viewport. The chapter that CONTAINS
      // the line is active; when the line sits in a gap between
      // chapters, the last chapter that crossed it stays lit.
      var line =
        (nav ? nav.offsetHeight : 0) +
        railOffset() +
        window.innerHeight * 0.35;
      var active = chapters[0];
      var container = null;
      chapters.forEach(function (chapter) {
        var r = chapter.getBoundingClientRect();
        if (r.top <= line) {
          active = chapter;
          if (r.bottom > line) {
            container = chapter;
          }
        }
      });
      markChapter((container || active).id);
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!spyTick) {
          spyTick = window.requestAnimationFrame(syncChapter);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", syncChapter);
    syncChapter();
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
      const menuOpen = links && links.classList.contains("is-open");
      const show =
        !dismissed &&
        smallScreen.matches &&
        window.scrollY > 300 &&
        !nearContact &&
        !menuOpen;
      mobileCta.classList.toggle("is-shown", show);
      mobileCta.setAttribute("aria-hidden", show ? "false" : "true");
      mobileCta.toggleAttribute("inert", !show);
    };
    syncMobileCta = update;

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
