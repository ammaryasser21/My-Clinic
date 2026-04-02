/**
 * Wires doctors/clinics catalog filters: header accordions, sidebar toggles,
 * sort dropdown, search, and price range. Requires YCatalog + YRenderLists.
 */
(() => {
  const SORT_BY_VALUE = {
    option1: "rating-desc",
    option2: "price-desc",
    option3: "price-asc",
    option4: "recent",
  };

  const dayBounds = (offsetDays) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + offsetDays);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const hasSlotInRange = (entity, start, end) =>
    (entity.slots || []).some((slot) => {
      const t = new Date(slot.start).getTime();
      return t >= start.getTime() && t <= end.getTime();
    });

  const latestSlotTime = (entity) => {
    const slots = entity.slots || [];
    if (!slots.length) return 0;
    return Math.max(...slots.map((s) => new Date(s.start).getTime()));
  };

  const sortList = (arr, mode, priceKey = "priceSar") => {
    const out = [...arr];
    if (mode === "rating-desc") {
      out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (mode === "price-desc") {
      out.sort((a, b) => (b[priceKey] || 0) - (a[priceKey] || 0));
    } else if (mode === "price-asc") {
      out.sort((a, b) => (a[priceKey] || 0) - (b[priceKey] || 0));
    } else if (mode === "recent") {
      out.sort((a, b) => latestSlotTime(b) - latestSlotTime(a));
    }
    return out;
  };

  const isFemaleDoctor = (d) => d.name.includes("دكتورة");

  const init = () => {
    const C = window.YCatalog;
    const R = window.YRenderLists;
    const doctorsEl = document.getElementById("y-doctors-list");
    const clinicsEl = document.getElementById("y-clinics-list");
    const mode = doctorsEl ? "doctors" : clinicsEl ? "clinics" : null;
    if (!mode || !C || !R) return;

    const state = {
      specialty: null,
      city: null,
      search: "",
      gender: "all",
      slot: "all",
      maxPrice: 500,
      sort: "rating-desc",
    };

    const crumb = document.querySelector(".y-breadcrumb-filter");
    const searchInput = document.getElementById("doctor");
    const rangeInput = document.getElementById("range");
    const searchBtn = document.querySelector(".y-filter-search");

    const params = new URLSearchParams(window.location.search);
    const decodeParam = (key) => {
      const raw = params.get(key);
      if (raw == null || raw === "") return null;
      return decodeURIComponent(raw.replace(/\+/g, " "));
    };

    const syncAccordionList = (kind, value) => {
      if (!value) return;
      const listEl = document.querySelector(`[data-y-filter="${kind}"]`);
      if (!listEl) return;
      const labelText = listEl.querySelector(".list-label-text");
      const items = listEl.querySelector(".items");
      if (!labelText || !items) return;
      labelText.textContent = value;
      items.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("selected", b.textContent.trim() === value);
      });
    };

    if (mode === "doctors" || mode === "clinics") {
      const urlSpec = decodeParam("specialty");
      const urlCity = decodeParam("city");
      const urlQ = decodeParam("q");
      if (urlSpec) {
        state.specialty = urlSpec;
        syncAccordionList("specialty", urlSpec);
      }
      if (urlCity) {
        state.city = urlCity;
        syncAccordionList("city", urlCity);
      }
      if (urlQ && searchInput) {
        state.search = urlQ;
        searchInput.value = urlQ;
      }
    }

    const readSidebar = () => {
      const g = document.querySelector('[data-y-sidebar="gender"]');
      const s = document.querySelector('[data-y-sidebar="slot"]');
      const gBtn = g?.querySelector("button.active");
      const sBtn = s?.querySelector("button.active");
      state.gender = gBtn?.dataset.yValue || "all";
      state.slot = sBtn?.dataset.yValue || "all";
    };

    const updateBreadcrumb = () => {
      if (!crumb) return;
      if (mode === "doctors") {
        const parts = [];
        if (state.specialty) parts.push(state.specialty);
        if (state.city) parts.push(state.city);
        crumb.textContent = parts.length ? parts.join(" · ") : "الأطباء";
      } else {
        const parts = [];
        if (state.specialty) parts.push(state.specialty);
        if (state.city) parts.push(state.city);
        crumb.textContent = parts.length ? parts.join(" · ") : "العيادات";
      }
    };

    const filterDoctors = () => {
      readSidebar();
      let list = [...C.DOCTORS];
      if (state.specialty) {
        list = list.filter((d) => d.specialty === state.specialty);
      }
      if (state.city) {
        list = list.filter((d) => d.city === state.city);
      }
      if (state.search.trim()) {
        const q = state.search.trim();
        list = list.filter(
          (d) => d.name.includes(q) || (d.title && d.title.includes(q))
        );
      }
      if (state.maxPrice < 500) {
        list = list.filter((d) => (d.priceSar || 0) <= state.maxPrice);
      }
      if (state.gender === "male") {
        list = list.filter((d) => !isFemaleDoctor(d));
      } else if (state.gender === "female") {
        list = list.filter((d) => isFemaleDoctor(d));
      }
      if (state.slot === "today") {
        const { start, end } = dayBounds(0);
        list = list.filter((d) => hasSlotInRange(d, start, end));
      } else if (state.slot === "tomorrow") {
        const { start, end } = dayBounds(1);
        list = list.filter((d) => hasSlotInRange(d, start, end));
      }
      list = sortList(list, state.sort);
      doctorsEl.innerHTML = R.renderDoctorCards(list);
      updateBreadcrumb();
    };

    const filterClinics = () => {
      readSidebar();
      let list = [...C.CLINICS];
      if (state.specialty) {
        list = list.filter((c) => {
          const docs = C.getDoctorsForClinic(c.id);
          return docs.some((d) => d.specialty === state.specialty);
        });
      }
      if (state.city) {
        list = list.filter(
          (c) => c.address && c.address.includes(state.city)
        );
      }
      if (state.search.trim()) {
        const q = state.search.trim();
        list = list.filter((c) => c.name.includes(q));
      }
      if (state.maxPrice < 500) {
        list = list.filter((c) => (c.priceSar || 0) <= state.maxPrice);
      }
      if (state.slot === "today") {
        const { start, end } = dayBounds(0);
        list = list.filter((c) => hasSlotInRange(c, start, end));
      } else if (state.slot === "tomorrow") {
        const { start, end } = dayBounds(1);
        list = list.filter((c) => hasSlotInRange(c, start, end));
      }
      list = sortList(list, state.sort);
      clinicsEl.innerHTML = R.renderClinicCards(list);
      updateBreadcrumb();
    };

    const apply = () => {
      if (mode === "doctors") filterDoctors();
      else filterClinics();
    };

    document.querySelectorAll("[data-y-filter]").forEach((listEl) => {
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
          apply();
        });
      });
    });

    document.querySelectorAll("[data-y-sidebar]").forEach((group) => {
      group.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          group.querySelectorAll("button").forEach((b) =>
            b.classList.remove("active")
          );
          btn.classList.add("active");
          apply();
        });
      });
    });

    const onSearch = () => {
      if (searchInput) state.search = searchInput.value;
      apply();
    };

    if (searchBtn) searchBtn.addEventListener("click", onSearch);
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onSearch();
        }
      });
    }

    if (rangeInput) {
      rangeInput.addEventListener("input", () => {
        state.maxPrice = Number(rangeInput.value) || 500;
        apply();
      });
    }

    document.addEventListener("dropdown-select", (e) => {
      const dd = e.detail?.dropdown;
      if (!dd || !dd.classList.contains("sort-dropdown")) return;
      const v = e.detail?.data?.value;
      if (v && SORT_BY_VALUE[v]) {
        state.sort = SORT_BY_VALUE[v];
        apply();
      }
    });

    updateBreadcrumb();
    apply();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
