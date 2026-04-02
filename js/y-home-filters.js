/**
 * Home (layout/index): hero filter accordions + category links navigate to
 * doctors listing with ?specialty=&city=&q= query params.
 */
(() => {
  const doctorsUrl = () => new URL("../doctors/doctors.html", window.location.href);

  const goDoctors = (specialty, city, q) => {
    const u = doctorsUrl();
    if (specialty) u.searchParams.set("specialty", specialty);
    if (city) u.searchParams.set("city", city);
    if (q) u.searchParams.set("q", q);
    window.location.assign(u.href);
  };

  const init = () => {
    const root = document.querySelector(".hero-section .lists.y-home-hero");
    if (!root) return;

    const state = { specialty: null, city: null };

    root.querySelectorAll("[data-y-filter]").forEach((listEl) => {
      const kind = listEl.dataset.yFilter;
      const checkbox = listEl.querySelector('input[type="checkbox"]');
      const labelText = listEl.querySelector(".list-label-text");
      const items = listEl.querySelector(".items");
      if (!checkbox || !labelText || !items) return;

      items.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const text = btn.textContent.trim();
          labelText.textContent = text;
          items.querySelectorAll("button").forEach((b) =>
            b.classList.toggle("selected", b === btn)
          );
          checkbox.checked = false;
          if (kind === "specialty") state.specialty = text;
          if (kind === "city") state.city = text;
        });
      });
    });

    const input = root.querySelector("#doctor");
    const searchBtn = root.querySelector(".y-filter-search");

    const runSearch = () => {
      const q = input?.value?.trim() || "";
      goDoctors(state.specialty, state.city, q || null);
    };

    if (searchBtn) searchBtn.addEventListener("click", runSearch);
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          runSearch();
        }
      });
    }

    document.querySelectorAll(".categories-section a.y-category-link").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const fromData = (a.dataset.ySpecialty || "").trim();
        const fromText = a.querySelector("p")?.textContent?.trim() || "";
        const specialty = fromData || fromText;
        if (specialty) goDoctors(specialty, null, null);
        else goDoctors(null, null, null);
      });

      a.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          a.click();
        }
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
