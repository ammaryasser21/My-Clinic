(() => {
  const C = window.YCatalog;
  if (!C) return;

  const DEFAULT_ID = "dr-youssef";

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");

  const relatedCard = (d) => {
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
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || DEFAULT_ID;
    const d = C.getDoctor(id);
    const section = document.querySelector("section.doctor-page:not(.clinic-page)");
    if (!section) return;

    if (!d) {
      section.style.display = "none";
      const warn = document.createElement("p");
      warn.className = "y-u-p-16";
      warn.setAttribute("dir", "rtl");
      warn.textContent = "لم يتم العثور على هذا الطبيب.";
      const main = document.querySelector("main");
      if (main) main.insertBefore(warn, main.firstChild);
      document.title = "طبيب غير موجود | My Clinic";
      return;
    }

    document.title = `${d.name} | My Clinic`;

    const top = section.querySelector(".top");
    if (top) {
      const img = top.querySelector("img");
      if (img) {
        img.src = d.image;
        img.alt = `صورة ${d.name}`;
      }
      const h3 = top.querySelector(".content h3");
      if (h3) h3.textContent = d.name;
      const sub = top.querySelector(".content > p");
      if (sub) sub.textContent = d.title;
      const rs = top.querySelector(".rating strong");
      if (rs) rs.textContent = String(d.rating);
      const vp = top.querySelector(".views p");
      if (vp) vp.textContent = String(d.views);
    }

    const mainBox = section.querySelector(".right .box.main-box");
    if (mainBox) {
      const h3 = mainBox.querySelector("h3");
      if (h3) h3.textContent = d.clinicName;
      const children = [...mainBox.children];
      const addrP = children.find(
        (el) => el.tagName === "P" && !el.classList.contains("grey")
      );
      if (addrP) addrP.textContent = d.address;

      const infos = mainBox.querySelectorAll(".info");
      const vals = [
        `${d.waitMinutes} دقيقه`,
        `${d.priceSar} ريال`,
        d.phone,
      ];
      infos.forEach((info, i) => {
        const ps = info.querySelectorAll("p");
        if (ps[1] && vals[i]) ps[1].textContent = vals[i];
      });

      const grey = mainBox.querySelector("p.grey");
      if (grey) grey.textContent = d.note;

      const slot0 = d.slots[0];
      const bookHref = `../booking/booking-doctor.html?id=${encodeURIComponent(d.id)}&slot=0`;
      const bookText = slot0
        ? C.formatBookCta(slot0.start, slot0.end)
        : "احجز موعدًا";

      const mainA = mainBox.querySelector("a.btn.main-button");
      if (mainA) {
        mainA.href = bookHref;
        mainA.textContent = bookText;
      }
      const resA = mainBox.querySelector("#reservation-link");
      if (resA) {
        resA.setAttribute("href", bookHref);
        resA.textContent = bookText;
      }
    }

    const aboutBoxes = section.querySelectorAll(".about-box > .box");
    const texts = [d.about.intro, d.about.specializes, d.about.education];
    for (let i = 0; i < texts.length; i++) {
      const body = aboutBoxes[i]?.querySelector("p:not(.title)");
      if (body) body.textContent = texts[i];
    }

    const rel = document.getElementById("y-doctor-related");
    if (rel) {
      rel.innerHTML = C.DOCTORS.filter((x) => x.id !== d.id)
        .map(relatedCard)
        .join("");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else run();
})();
