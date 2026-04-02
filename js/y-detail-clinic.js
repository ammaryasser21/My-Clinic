(() => {
  const C = window.YCatalog;
  if (!C) return;

  const DEFAULT_ID = "clinic-pro";

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");

  const staffCard = (d) => {
    const slot0 = d.slots[0];
    const href = `../booking/booking-doctor.html?id=${encodeURIComponent(d.id)}&slot=0`;
    const label = slot0 ? C.formatBookCta(slot0.start, slot0.end) : "احجز موعدًا";
    return `<div class="box doctor-info">
  <div class="top">
    <img src="${esc(d.image)}" alt="صورة الطبيب">
    <div class="desc">
      <a href="../doctor-page/doctor-page.html?id=${esc(d.id)}"><p>${esc(d.name)}</p></a>
      <p>${esc(d.title)}</p>
    </div>
  </div>
  <div class="bottom">
    <div class="rating"><strong>${esc(d.rating)}</strong><i class="fa-solid fa-star"></i></div>
    <div class="views"><p>${esc(d.views)}</p><img src="../../assets/eye.svg" alt="عدد المشاهدات"></div>
    <div class="price"><p>${esc(d.priceCard)}</p><img src="../../assets/ryal.svg" alt="سعر الكشف بالريال"></div>
  </div>
  <a href="${href}" class="btn main-button fw">${esc(label)}</a>
</div>`;
  };

  const run = () => {
    const section = document.querySelector("section.doctor-page.clinic-page");
    if (!section) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || DEFAULT_ID;
    const c = C.getClinic(id);

    if (!c) {
      section.style.display = "none";
      const warn = document.createElement("p");
      warn.className = "y-u-p-16";
      warn.setAttribute("dir", "rtl");
      warn.textContent = "لم يتم العثور على هذه العيادة.";
      const main = document.querySelector("main");
      if (main) main.insertBefore(warn, main.firstChild);
      document.title = "عيادة غير موجودة | My Clinic";
      return;
    }

    document.title = `${c.name} | My Clinic`;

    const mainBox = section.querySelector(".right .box.main-box");
    if (mainBox) {
      const topImg = mainBox.querySelector(".top img");
      if (topImg) {
        topImg.src = c.image;
        topImg.alt = `صورة ${c.name}`;
      }
      const h3 = mainBox.querySelector(".top .content h3");
      if (h3) h3.textContent = c.name;
      const addr = mainBox.querySelector(".top .content > p");
      if (addr) addr.textContent = c.address;

      const rs = mainBox.querySelector(".icons .rating strong");
      if (rs) rs.textContent = String(c.rating);
      const vp = mainBox.querySelector(".icons .views p");
      if (vp) vp.textContent = String(c.views);

      const infos = mainBox.querySelectorAll(".info");
      const vals = [
        `${c.specialtiesCount} تخصصات`,
        `${c.doctorsCount} اطباء`,
        c.phone,
      ];
      infos.forEach((info, i) => {
        const ps = info.querySelectorAll("p");
        if (ps[1] && vals[i]) ps[1].textContent = vals[i];
      });

      const grey = mainBox.querySelector("p.grey");
      if (grey) grey.textContent = c.note;

      const slot0 = c.slots[0];
      const bookHref = `../booking/booking-clinc.html?id=${encodeURIComponent(c.id)}&slot=0`;
      const bookText = slot0
        ? C.formatBookCta(slot0.start, slot0.end)
        : "احجز موعدًا";

      const mainA = mainBox.querySelector("a.btn.main-button");
      if (mainA) {
        mainA.href = bookHref;
        mainA.textContent = bookText;
      }
      const resA = mainBox.querySelector("#reservation-link-clinic");
      if (resA) {
        resA.setAttribute("href", bookHref);
        resA.textContent = bookText;
      }
    }

    const staff = document.getElementById("y-clinic-staff");
    if (staff) {
      const list = C.getDoctorsForClinic(c.id);
      staff.innerHTML = list.length
        ? list.map(staffCard).join("")
        : '<p class="grey">لا يوجد أطباء مرتبطون بهذه العيادة في العرض التجريبي.</p>';
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else run();
})();
