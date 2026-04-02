/**
 * Called after demo payment succeeds — saves pending booking to localStorage.
 */
(() => {
  window.YClinicBookingCommit = () => {
    const C = window.YCatalog;
    const S = window.YClinicStorage;
    if (!C || !S) return false;
    const pending = S.getPendingBooking();
    if (!pending) return false;

    const name = document.querySelector("#name")?.value?.trim() || "";
    const phone = document.querySelector("#phone")?.value?.trim() || "";
    const email = document.querySelector("#email")?.value?.trim() || "";

    const record = {
      type: pending.type,
      entityId: pending.entityId,
      slotLabelAr: pending.slotLabelAr,
      slotStart: pending.slotStart,
      titleName: pending.titleName,
      titleLine: pending.titleLine,
      clinicLine: pending.clinicLine,
      image: pending.image,
      patientName: name,
      patientPhone: phone,
      patientEmail: email,
    };

    S.addBooking(record);
    S.clearPendingBooking();
    return true;
  };
})();
