function initializeCalendar(buttonId, popoverId, reservationLinkId) {
  const openButton = document.getElementById(buttonId);
  const calendarPopover = document.getElementById(popoverId);
  const reservationLink = document.getElementById(reservationLinkId);

  if (!openButton || !calendarPopover) {
    return;
  }

  const monthYearElement = calendarPopover.querySelector(".month-year");
  const daysGrid = calendarPopover.querySelector(".days-grid");
  const prevMonthButton = calendarPopover.querySelector(".prev-month");
  const nextMonthButton = calendarPopover.querySelector(".next-month");

  let currentDate = new Date();
  let selectedDate = new Date();

  const disabledDates = [2, 3, 4, 5, 6, 7, 14, 21, 28];

  function renderCalendar() {
    daysGrid.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const monthNames = [
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
    monthYearElement.textContent = `${monthNames[month]} ${year}`;

    const startDay = firstDayOfMonth.getDay();

    for (let i = 0; i < startDay; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.classList.add("day", "empty");
      daysGrid.appendChild(emptyDay);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.textContent = i;

      if (disabledDates.includes(i)) {
        dayElement.classList.add("disabled");
      } else {
        dayElement.addEventListener("click", () => {
          selectedDate = new Date(year, month, i);
          document
            .querySelectorAll(`#${popoverId} .day`)
            .forEach((d) => d.classList.remove("selected"));
          dayElement.classList.add("selected");
          updateReservationLink();
        });
      }

      if (
        i === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear()
      ) {
        dayElement.classList.add("selected");
      }

      daysGrid.appendChild(dayElement);
    }
  }

  function updateReservationLink() {
    if (reservationLink) {
      const formattedDate = `${selectedDate.getDate()}/${
        selectedDate.getMonth() + 1
      }/${selectedDate.getFullYear()}`;
      reservationLink.textContent = `احجز في ${formattedDate} (04:00 مساءً - 07:00 مساءً)`;
      const baseUrl = reservationLink.href.split("?")[0];
      reservationLink.href = `${baseUrl}?date=${formattedDate}`;
    }
  }

  openButton.addEventListener("click", () => {
    calendarPopover.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    if (
      !calendarPopover.contains(event.target) &&
      !openButton.contains(event.target)
    ) {
      calendarPopover.classList.remove("show");
    }
  });

  prevMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
  updateReservationLink();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeCalendar(
    "open-calendar-btn",
    "calendar-popover",
    "reservation-link"
  );
  initializeCalendar(
    "open-calendar-btn-clinic",
    "calendar-popover-clinic",
    "reservation-link-clinic"
  );

  for (let i = 1; i <= 6; i++) {
    initializeCalendar(
      `open-calendar-btn-clinic-${i}`,
      `calendar-popover-clinic-${i}`,
      `reservation-link-clinic-${i}`
    );
  }

  for (let i = 1; i <= 6; i++) {
    initializeCalendar(
      `open-calendar-btn-doctor-${i}`,
      `calendar-popover-doctor-${i}`,
      `reservation-link-doctor-${i}`
    );
  }
});
