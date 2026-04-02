(() => {
  const S = window.YClinicStorage;
  if (!S) return;

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");

  const renderCard = (b) => {
    const isClinic = b.type === "clinic";
    const href = isClinic
      ? `../clinic-page/clinic-page.html?id=${encodeURIComponent(b.entityId)}`
      : `../doctor-page/doctor-page.html?id=${encodeURIComponent(b.entityId)}`;
    const line2 = isClinic
      ? `<p class="address"><img src="../../assets/address.svg" alt="العنوان"> ${esc(b.titleLine || "")}</p>`
      : `<p>${esc(b.titleLine || "")}</p>`;
    const line3 = isClinic ? "" : `<p>${esc(b.clinicLine || "")}</p>`;
    return `<div class="box" data-booking-id="${esc(b.id)}">
  <div class="top">
    <img src="${esc(b.image)}" alt="${esc(b.titleName)}">
    <div class="content">
      <a href="${href}"><h3>${esc(b.titleName)}</h3></a>
      ${line2}
    </div>
  </div>
  ${line3}
  <p>${esc(b.slotLabelAr || "")}</p>
  <div class="actions">
    <button type="button" class="y-booking-remove" data-booking-id="${esc(b.id)}"><img src="../../assets/delete.svg" alt="إلغاء">إلغاء</button>
  </div>
</div>`;
  };

  const run = () => {
    const listEl = document.getElementById("y-account-bookings-list");
    const emptyEl = document.getElementById("y-account-bookings-empty");
    if (!listEl) return;

    const bookings = S.getBookings();
    if (!bookings.length) {
      listEl.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    listEl.innerHTML = bookings.map(renderCard).join("");

    listEl.querySelectorAll(".y-booking-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-booking-id");
        if (id) S.removeBooking(id);
        run();
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else run();
})();
