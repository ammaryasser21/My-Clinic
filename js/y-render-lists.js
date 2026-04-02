/**
 * Fills #y-doctors-list and #y-clinics-list from YCatalog.
 */
(() => {
  const C = window.YCatalog;
  if (!C) return;

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");

  const doctorCard = (d) => {
    const slot0 = d.slots[0];
    const label = slot0
      ? C.formatBookCta(slot0.start, slot0.end)
      : "احجز موعدًا";
    const range = slot0 ? C.formatSlotRangeAr(slot0.start, slot0.end) : "";
    return `
<div class="box main-box">
  <div class="top">
    <img src="${esc(d.image)}" alt="صورة الطبيب">
    <div class="content">
      <a href="../doctor-page/doctor-page.html?id=${esc(d.id)}"><h3>${esc(d.name)}</h3></a>
      <p>${esc(d.title)}</p>
    </div>
  </div>
  <div class="icons">
    <div class="rating"><strong>${esc(d.rating)}</strong><i class="fa-solid fa-star"></i></div>
    <div class="views"><p>${esc(d.views)}</p><img src="../../assets/eye.svg" alt="عدد المشاهدات"></div>
  </div>
  <p>${esc(d.title)}</p>
  <p class="address"><img src="../../assets/address.svg" alt="العنوان"> ${esc(d.address)}</p>
  <div class="infos">
    <div class="info">
      <img src="../../assets/clock.svg" alt="مواعيد العمل">
      <p>مدة الانتظار</p>
      <p>${esc(d.waitMinutes)} دقيقه</p>
    </div>
    <div class="info">
      <img src="../../assets/ryal-primary.svg" alt="سعر الكشف">
      <p>سعر الكشف</p>
      <p>${esc(d.priceSar)} ريال</p>
    </div>
    <div class="info">
      <img src="../../assets/phone-primary.svg" alt="رقم الهاتف">
      <p>اتصل احجز</p>
      <p>${esc(d.phone)}</p>
    </div>
  </div>
  <p class="grey">${esc(d.note)}</p>
  <a href="../booking/booking-doctor.html?id=${esc(d.id)}&slot=0" class="btn main-button fw">${esc(label)}</a>
</div>`;
  };

  const clinicCard = (c) => {
    const slot0 = c.slots[0];
    const label = slot0
      ? C.formatBookCta(slot0.start, slot0.end)
      : "احجز موعدًا";
    return `
<div class="box main-box clinic-box">
  <div class="top">
    <img src="${esc(c.image)}" alt="صورة العيادة">
    <div class="content">
      <a href="../clinic-page/clinic-page.html?id=${esc(c.id)}"><h3>${esc(c.name)}</h3></a>
      <p class="address"><img src="../../assets/address.svg" alt="العنوان"> ${esc(c.address)}</p>
    </div>
  </div>
  <div class="icons grey">
    <div class="rating"><strong>${esc(c.rating)}</strong><i class="fa-solid fa-star"></i></div>
    <div class="views"><p>${esc(c.views)}</p><img src="../../assets/eye.svg" alt="عدد المشاهدات"></div>
  </div>
  <div class="infos">
    <div class="info">
      <img src="../../assets/clock.svg" alt="مواعيد العمل">
      <p>مدة الانتظار</p>
      <p>${esc(c.waitMinutes)} دقيقه</p>
    </div>
    <div class="info">
      <img src="../../assets/ryal-primary.svg" alt="سعر الكشف">
      <p>سعر الكشف</p>
      <p>${esc(c.priceSar)} ريال</p>
    </div>
    <div class="info">
      <img src="../../assets/phone-primary.svg" alt="رقم الهاتف">
      <p>اتصل احجز</p>
      <p>${esc(c.phone)}</p>
    </div>
  </div>
  <p class="grey">${esc(c.note)}</p>
  <a href="../booking/booking-clinc.html?id=${esc(c.id)}&slot=0" class="btn main-button fw">${esc(label)}</a>
</div>`;
  };

  const renderDoctorCards = (doctors) => doctors.map(doctorCard).join("");
  const renderClinicCards = (clinics) => clinics.map(clinicCard).join("");

  const run = () => {
    const doctorsEl = document.getElementById("y-doctors-list");
    if (doctorsEl) {
      doctorsEl.innerHTML = renderDoctorCards(C.DOCTORS);
    }
    const clinicsEl = document.getElementById("y-clinics-list");
    if (clinicsEl) {
      clinicsEl.innerHTML = renderClinicCards(C.CLINICS);
    }
  };

  window.YRenderLists = {
    renderDoctorCards,
    renderClinicCards,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else run();
})();
