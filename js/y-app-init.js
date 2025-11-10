(() => {
  const wireMobileMenu = (root = document) => {
    const mobileMenuBtn = root.querySelector(".mobile-menu-btn");
    const mobileMenuOverlay = root.querySelector(".mobile-menu-overlay");
    if (!mobileMenuBtn || !mobileMenuOverlay) return;

    const openMobileMenu = () => {
      mobileMenuBtn.classList.add("active");
      mobileMenuOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const closeMobileMenu = () => {
      mobileMenuBtn.classList.remove("active");
      mobileMenuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    };

    const toggleMobileMenu = () => {
      if (mobileMenuOverlay.classList.contains("active")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    };

    mobileMenuBtn.addEventListener("click", toggleMobileMenu);

    mobileMenuOverlay.addEventListener("click", (event) => {
      if (event.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });

    const mobileMenuLinks =
      mobileMenuOverlay.querySelectorAll(".mobile-menu a");
    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        mobileMenuOverlay.classList.contains("active")
      ) {
        closeMobileMenu();
      }
    });
  };

  const loadFragment = async (selector, href) => {
    const host = document.querySelector(selector);
    if (!host) return null;
    try {
      const res = await fetch(href, { cache: "no-cache" });
      const html = await res.text();
      host.innerHTML = html;
      return host;
    } catch (err) {
      console.error(`Error loading ${selector} from ${href}:`, err);
      return null;
    }
  };

  const wireActiveLinks = (root = document) => {
    const getCurrentMatchPath = () => {
      let path = window.location.pathname;
      if (!/\.html$/i.test(path)) {
        if (!path.endsWith("/")) path += "/";
        path += "index.html";
      }
      return path.toLowerCase();
    };

    const getLinkEnd = (anchor) => {
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return null;
      try {
        const url = new URL(href, window.location.href);
        const last = url.pathname.split("/").pop() || "index.html";
        return last.toLowerCase();
      } catch (_) {
        return null;
      }
    };

    const anchors = root.querySelectorAll("header a, .mobile-menu a");
    anchors.forEach((a) => a.classList.remove("active"));

    const currentPath = getCurrentMatchPath();
    const currentEnd = (() => {
      const parts = currentPath.split("/");
      return (parts[parts.length - 1] || "index.html").toLowerCase();
    })();
    const exactMatches = [];
    anchors.forEach((a) => {
      const end = getLinkEnd(a);
      if (end && currentPath.endsWith(end)) exactMatches.push(a);
    });

    if (currentEnd === "login.html" || currentEnd === "forget-password.html") {
      anchors.forEach((a) => {
        const end = getLinkEnd(a);
        if (end === "signup.html") exactMatches.push(a);
      });
    }

    const toActivate = exactMatches.length
      ? exactMatches
      : Array.from(anchors).filter((a) => getLinkEnd(a) === "index.html");
    toActivate.forEach((a) => a.classList.add("active"));
  };

  const init = async () => {
    const headerHost = await loadFragment(
      "y-navbar",
      "../../components/header.html"
    );
    await loadFragment("y-footer", "../../components/footer.html");

    if (headerHost) wireMobileMenu(headerHost);
    wireActiveLinks(document);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const boxGrid = document.querySelector(".categories-section .box-grid");
    if (boxGrid) {
      const categoriesGrid = boxGrid.querySelector(".categories-grid");
      const scrollBtns = boxGrid.querySelectorAll(".btn");
      const scrollLeftBtn = scrollBtns[0];
      const scrollRightBtn = scrollBtns[1];

      if (categoriesGrid && scrollLeftBtn && scrollRightBtn) {
        const scrollAmount = 300;

        scrollRightBtn.addEventListener("click", () => {
          categoriesGrid.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });

        scrollLeftBtn.addEventListener("click", () => {
          categoriesGrid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });
      }
    }
  });
})();
