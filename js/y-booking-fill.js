(() => {
  const C = window.YCatalog;
  const S = window.YClinicStorage;
  if (!C || !S) return;

  const section = document.querySelector("section.booking-doctor, section.booking-clinc");
  if (!section) return;

  const isClinic = section.classList.contains("booking-clinc");
  const params = new URLSearchParams(window.location.search);
  let entityId =
    params.get("id") || (isClinic ? "clinic-pro" : "dr-youssef");
  const slotIndex = Math.max(0, parseInt(params.get("slot") || "0", 10) || 0);

  let slot;
  let titleName;
  let titleLine;
  let clinicLine;
  let image;
  let detailHref;

  if (isClinic) {
    let c = C.getClinic(entityId);
    if (!c) {
      c = C.getClinic("clinic-pro");
      entityId = "clinic-pro";
    }
    if (!c) return;
    slot = C.getClinicSlot(entityId, slotIndex);
    titleName = c.name;
    titleLine = c.address;
    clinicLine = "";
    image = c.image;
    detailHref = `../clinic-page/clinic-page.html?id=${encodeURIComponent(entityId)}`;
  } else {
    let d = C.getDoctor(entityId);
    if (!d) {
      d = C.getDoctor("dr-youssef");
      entityId = "dr-youssef";
    }
    if (!d) return;
    slot = C.getDoctorSlot(entityId, slotIndex);
    titleName = d.name;
    titleLine = d.title;
    clinicLine = d.clinicName;
    image = d.image;
    detailHref = `../doctor-page/doctor-page.html?id=${encodeURIComponent(entityId)}`;
  }

  const slotLabelAr = slot
    ? C.formatSlotRangeAr(slot.start, slot.end)
    : "موعد غير محدد";

  S.setPendingBooking({
    type: isClinic ? "clinic" : "doctor",
    entityId,
    slotIndex,
    slotStart: slot?.start ?? null,
    slotEnd: slot?.end ?? null,
    slotLabelAr,
    titleName,
    titleLine,
    clinicLine,
    image,
  });

  const box = section.querySelector(".right .box");
  if (box) {
    const img = box.querySelector("img");
    if (img) {
      img.src = image;
      img.alt = titleName;
    }
    const link = box.querySelector("a");
    if (link) link.href = detailHref;
    const h3 = box.querySelector("h3");
    if (h3) h3.textContent = titleName;
    const midP = box.querySelector("a ~ p:not(.small-text)");
    if (midP) midP.textContent = titleLine;
    const smalls = box.querySelectorAll("p.small-text");
    if (isClinic) {
      if (smalls[0]) smalls[0].textContent = slotLabelAr;
    } else {
      if (smalls[0]) smalls[0].textContent = clinicLine;
      if (smalls[1]) smalls[1].textContent = slotLabelAr;
    }
  }

  const cancel = section.querySelector(".buttons a.btn.white-button");
  if (cancel) cancel.setAttribute("href", detailHref);

  const session = S.getSession?.();
  if (session && String(session.email || "").trim()) {
    const nameEl = section.querySelector("#name");
    const phoneEl = section.querySelector("#phone");
    const emailEl = section.querySelector("#email");
    const emailPopup = document.querySelector("#email-popup");
    const cardHolder = document.querySelector("#card-holder");
    if (nameEl && !nameEl.value) {
      nameEl.value =
        String(session.fullName || session.firstName || "").trim() || nameEl.value;
    }
    if (phoneEl && !phoneEl.value) {
      phoneEl.value = String(session.phone || "").trim() || phoneEl.value;
    }
    if (emailEl && !emailEl.value) {
      emailEl.value = String(session.email || "").trim() || emailEl.value;
    }
    if (emailPopup && !emailPopup.value) {
      emailPopup.value = String(session.email || "").trim() || emailPopup.value;
    }
    if (cardHolder && !cardHolder.value) {
      const holder =
        String(session.fullName || session.firstName || "").trim();
      if (holder) cardHolder.value = holder;
    }
  }
})();
