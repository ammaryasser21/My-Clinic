/**
 * Custom date & time pickers aligned with doctors-page calendar (calendar.css).
 */
(() => {
  const MONTH_NAMES = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const pad2 = (n) => String(n).padStart(2, "0");

  const parseISODate = (s) => {
    if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const [y, m, d] = s.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    if (
      dt.getFullYear() !== y ||
      dt.getMonth() !== m - 1 ||
      dt.getDate() !== d
    )
      return null;
    return dt;
  };

  const toISODate = (d) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

  const formatArabicDate = (d) =>
    `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const closeFormPicker = (popover) => {
    popover.classList.remove("show");
    const container = popover.closest(".y-field-picker");
    const trigger = container?.querySelector(".y-field-picker-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  };

  const openFormPicker = (popover) => {
    document.querySelectorAll(".y-form-picker-popover.show").forEach((p) => {
      if (p !== popover) closeFormPicker(p);
    });
    popover.classList.add("show");
    const container = popover.closest(".y-field-picker");
    const trigger = container?.querySelector(".y-field-picker-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
  };

  const parseMaxDate = (raw) => {
    if (!raw || raw === "today") return startOfDay(new Date());
    return parseISODate(raw) || startOfDay(new Date());
  };

  const parseMinDate = (raw) => {
    if (!raw) return new Date(1900, 0, 1);
    return parseISODate(raw) || new Date(1900, 0, 1);
  };

  /** True when the calendar cannot advance to the next month (all days would be after today). */
  const isAtOrBeyondCurrentMonth = (year, month) => {
    const now = new Date();
    return (
      year > now.getFullYear() ||
      (year === now.getFullYear() && month >= now.getMonth())
    );
  };

  const initDatePicker = (container) => {
    const hidden = container.querySelector('input[type="hidden"][data-y-date-value]');
    const trigger = container.querySelector(".y-field-picker-trigger");
    const popover = container.querySelector(".y-form-picker-popover");
    const valueEl = container.querySelector(".y-field-picker-value");
    const confirmBtn = popover?.querySelector("[data-y-date-confirm]");
    const monthYearEl = popover?.querySelector(".month-year");
    const daysGrid = popover?.querySelector(".days-grid");
    const prevBtn = popover?.querySelector(".prev-month");
    const nextBtn = popover?.querySelector(".next-month");

    if (
      !hidden ||
      !trigger ||
      !popover ||
      !valueEl ||
      !confirmBtn ||
      !monthYearEl ||
      !daysGrid ||
      !prevBtn ||
      !nextBtn
    )
      return;

    const maxDate = parseMaxDate(container.dataset.yMaxDate);
    const minDate = startOfDay(parseMinDate(container.dataset.yMinDate));
    const placeholder = valueEl.dataset.placeholder || "";

    let viewDate = new Date();
    let pendingDate = parseISODate(hidden.value) || null;

    if (pendingDate) viewDate = new Date(pendingDate);

    const syncDisplay = () => {
      if (hidden.value && pendingDate) {
        valueEl.textContent = formatArabicDate(pendingDate);
        valueEl.classList.remove("y-field-picker-value--placeholder");
      } else {
        valueEl.textContent = placeholder;
        valueEl.classList.add("y-field-picker-value--placeholder");
      }
    };

    const updateNavButtons = () => {
      const y = viewDate.getFullYear();
      const m = viewDate.getMonth();
      prevBtn.disabled =
        y < minDate.getFullYear() ||
        (y === minDate.getFullYear() && m <= minDate.getMonth());
      nextBtn.disabled = isAtOrBeyondCurrentMonth(y, m);
    };

    const dayDisabled = (year, month, day) => {
      const d = new Date(year, month, day);
      const s = startOfDay(d);
      return s > maxDate || s < minDate;
    };

    const renderCalendar = () => {
      daysGrid.innerHTML = "";
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();

      monthYearEl.textContent = `${MONTH_NAMES[month]} ${year}`;

      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const startDay = firstDayOfMonth.getDay();

      for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.classList.add("day", "empty");
        daysGrid.appendChild(emptyDay);
      }

      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.textContent = String(day);

        const disabled = dayDisabled(year, month, day);
        if (disabled) {
          dayElement.classList.add("disabled");
        } else {
          dayElement.addEventListener("click", () => {
            pendingDate = new Date(year, month, day);
            popover
              .querySelectorAll(".days-grid .day")
              .forEach((d) => d.classList.remove("selected"));
            dayElement.classList.add("selected");
          });
        }

        if (
          pendingDate &&
          pendingDate.getDate() === day &&
          pendingDate.getMonth() === month &&
          pendingDate.getFullYear() === year
        ) {
          dayElement.classList.add("selected");
        }

        daysGrid.appendChild(dayElement);
      }

      updateNavButtons();
    };

    prevBtn.addEventListener("click", () => {
      viewDate.setMonth(viewDate.getMonth() - 1);
      renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
      viewDate.setMonth(viewDate.getMonth() + 1);
      renderCalendar();
    });

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (popover.classList.contains("show")) {
        closeFormPicker(popover);
      } else {
        viewDate = pendingDate ? new Date(pendingDate) : new Date();
        if (startOfDay(viewDate) > maxDate) viewDate = new Date(maxDate);
        if (startOfDay(viewDate) < minDate) viewDate = new Date(minDate);
        renderCalendar();
        openFormPicker(popover);
      }
    });

    confirmBtn.addEventListener("click", () => {
      if (!pendingDate) {
        closeFormPicker(popover);
        return;
      }
      hidden.value = toISODate(pendingDate);
      hidden.dispatchEvent(new Event("input", { bubbles: true }));
      syncDisplay();
      closeFormPicker(popover);
    });

    document.addEventListener("click", (event) => {
      if (
        popover.classList.contains("show") &&
        !popover.contains(event.target) &&
        !trigger.contains(event.target)
      ) {
        closeFormPicker(popover);
      }
    });

    syncDisplay();
  };

  const formatTimeAr = (h, m) => {
    const d = new Date();
    d.setHours(h, m, 0, 0);
    try {
      return d.toLocaleTimeString("ar-SA", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return `${pad2(h)}:${pad2(m)}`;
    }
  };

  const initTimePicker = (container) => {
    const hidden = container.querySelector('input[type="hidden"][data-y-time-value]');
    const trigger = container.querySelector(".y-field-picker-trigger");
    const popover = container.querySelector(".y-form-picker-popover");
    const valueEl = container.querySelector(".y-field-picker-value");
    const confirmBtn = popover?.querySelector("[data-y-time-confirm]");
    const clearBtn = popover?.querySelector("[data-y-time-clear]");
    const hourHost = popover?.querySelector("[data-hour-options]");
    const minuteHost = popover?.querySelector("[data-minute-options]");

    if (
      !hidden ||
      !trigger ||
      !popover ||
      !valueEl ||
      !confirmBtn ||
      !hourHost ||
      !minuteHost
    )
      return;

    const placeholder = valueEl.dataset.placeholder || "";
    const optional = container.dataset.yTimeOptional === "true";
    let hour = 9;
    let minute = 0;
    let timeTouched = false;

    const parseHidden = () => {
      const v = hidden.value;
      if (!v || !/^\d{1,2}:\d{2}$/.test(v)) return;
      const [hh, mm] = v.split(":").map(Number);
      if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
        hour = hh;
        minute = Math.round(mm / 5) * 5;
        if (minute === 60) {
          minute = 0;
          hour = Math.min(23, hour + 1);
        }
      }
    };

    const syncDisplay = () => {
      if (hidden.value) {
        valueEl.textContent = formatTimeAr(hour, minute);
        valueEl.classList.remove("y-field-picker-value--placeholder");
      } else {
        valueEl.textContent = placeholder;
        valueEl.classList.add("y-field-picker-value--placeholder");
      }
    };

    const renderOptions = () => {
      hourHost.innerHTML = "";
      minuteHost.innerHTML = "";

      for (let h = 0; h <= 23; h++) {
        const b = document.createElement("button");
        b.type = "button";
        b.classList.add("time-option");
        b.textContent = pad2(h);
        if (h === hour) b.classList.add("selected");
        b.addEventListener("click", () => {
          timeTouched = true;
          hour = h;
          hourHost.querySelectorAll(".time-option").forEach((x) =>
            x.classList.remove("selected")
          );
          b.classList.add("selected");
        });
        hourHost.appendChild(b);
      }

      for (let m = 0; m < 60; m += 5) {
        const b = document.createElement("button");
        b.type = "button";
        b.classList.add("time-option");
        b.textContent = pad2(m);
        if (m === minute) b.classList.add("selected");
        b.addEventListener("click", () => {
          timeTouched = true;
          minute = m;
          minuteHost.querySelectorAll(".time-option").forEach((x) =>
            x.classList.remove("selected")
          );
          b.classList.add("selected");
        });
        minuteHost.appendChild(b);
      }
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (popover.classList.contains("show")) {
        closeFormPicker(popover);
      } else {
        timeTouched = false;
        if (hidden.value) parseHidden();
        else {
          hour = 9;
          minute = 0;
        }
        renderOptions();
        if (clearBtn) clearBtn.disabled = !hidden.value;
        openFormPicker(popover);
      }
    });

    confirmBtn.addEventListener("click", () => {
      if (optional && !timeTouched && !hidden.value) {
        closeFormPicker(popover);
        return;
      }
      hidden.value = `${pad2(hour)}:${pad2(minute)}`;
      syncDisplay();
      closeFormPicker(popover);
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        hidden.value = "";
        timeTouched = false;
        syncDisplay();
        closeFormPicker(popover);
      });
    }

    document.addEventListener("click", (event) => {
      if (
        popover.classList.contains("show") &&
        !popover.contains(event.target) &&
        !trigger.contains(event.target)
      ) {
        closeFormPicker(popover);
      }
    });

    parseHidden();
    syncDisplay();
  };

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".y-form-picker-popover.show").forEach((p) =>
      closeFormPicker(p)
    );
  });

  const init = () => {
    document.querySelectorAll("[data-y-date-picker]").forEach(initDatePicker);
    document.querySelectorAll("[data-y-time-picker]").forEach(initTimePicker);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
