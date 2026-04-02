/**
 * Demo catalog: doctors & clinics. Asset paths are relative to templates pages.
 */
(() => {
  const asset = (name) => `../../assets/${name}`;

  const DOCTORS = [
    {
      id: "dr-youssef",
      clinicIds: ["clinic-pro"],
      name: "دكتور يوسف منصور",
      title: "استاذ جامعي تخصص عظام",
      bio: "استاذ جراحة العظام والعمود الفقري وخبرة واسعة في الجراحات التقويمية واستبدال مفاصل الحوض والركبة",
      specialty: "عظام",
      city: "الرياض",
      image: asset("doctor-img.jpg"),
      rating: 5,
      views: 5000,
      address: "حي العليا، شارع الملك فهد، الرياض",
      clinicName: "عيادة دكتور يوسف منصور",
      waitMinutes: 30,
      priceSar: 100,
      phone: "+966123456789",
      note: "الكشف بأسبقية الحضور للعيادة",
      priceCard: 300,
      slots: [
        { start: "2026-04-02T16:00:00+03:00", end: "2026-04-02T19:00:00+03:00" },
        { start: "2026-04-05T16:00:00+03:00", end: "2026-04-05T19:00:00+03:00" },
        { start: "2026-04-12T19:00:00+03:00", end: "2026-04-12T23:00:00+03:00" },
      ],
      about: {
        intro:
          "استاذ جراحة العظام والعمود الفقري وخبرة واسعة في الجراحات التقويمية واستبدال مفاصل الحوض والركبة",
        specializes:
          "علاج الرباط الصليبى - عملية مفصل الكوع - عملية الغضروف - عملية تبديل مفصل الحوض - إعادة تسوية سطح مفصل الحوض - قطع عظمي في الركبة - استبدال مفصل الكتف - عملية تغيير مفصل الركبة",
        education:
          "ماجستير ودكتوراه جراحة عظام وعمود فقري وعضوية عدة جمعيات عالميه للعظام والعمود الفقري",
      },
    },
    {
      id: "dr-sara",
      clinicIds: ["clinic-care"],
      name: "دكتورة سارة العتيبي",
      title: "استشارية جلدية وتجميل",
      bio: "خبرة في أمراض الجلد التحسسية والعلاجات التجميلية غير الجراحية",
      specialty: "جلدية",
      city: "جدة",
      image: asset("doctor-img.jpg"),
      rating: 4.8,
      views: 3200,
      address: "حي الزهراء، جدة",
      clinicName: "عيادة الدكتورة سارة العتيبي",
      waitMinutes: 20,
      priceSar: 150,
      phone: "+966501112233",
      note: "الكشف بأسبقية الحضور للعيادة",
      priceCard: 250,
      slots: [
        { start: "2026-04-03T10:00:00+03:00", end: "2026-04-03T13:00:00+03:00" },
        { start: "2026-04-06T10:00:00+03:00", end: "2026-04-06T13:00:00+03:00" },
      ],
      about: {
        intro: "استشارية جلدية مع اهتمام بالأمراض المزمنة والتجميل الدقيق.",
        specializes: "حب الشباب - الإكزيما - الشعر والأظافر - تقنيات الليزر الخفيفة.",
        education: "البورد السعودي للجلدية، زمالة من جمعية أوروبية للأمراض الجلدية.",
      },
    },
    {
      id: "dr-khalid",
      clinicIds: ["clinic-pro"],
      name: "دكتور خالد الشهري",
      title: "أخصائي أنف وأذن وحنجرة",
      bio: "تشخيص وعلاج اضطرابات السمع والتهاب الجيوب الأنفية",
      specialty: "أنف و أذن و حنجرة",
      city: "الرياض",
      image: asset("doctor-img.jpg"),
      rating: 4.9,
      views: 4100,
      address: "طريق الملك عبدالله، الرياض",
      clinicName: "عيادة دكتور خالد الشهري",
      waitMinutes: 25,
      priceSar: 120,
      phone: "+966554443322",
      note: "الكشف بأسبقية الحضور للعيادة",
      priceCard: 280,
      slots: [
        { start: "2026-04-04T14:00:00+03:00", end: "2026-04-04T17:00:00+03:00" },
      ],
      about: {
        intro: "أخصائي أنف وأذن وحنجرة مع خبرة في جراحات اليوم الواحد.",
        specializes: "التهاب الأذن - دوار الأذن - اللوزتين - الجيوب الأنفية.",
        education: "زمالة الكلية السعودية للأنف والأذن والحنجرة.",
      },
    },
  ];

  const CLINICS = [
    {
      id: "clinic-pro",
      name: "عيادة برو كلينيك",
      specialtiesCount: 10,
      doctorsCount: 8,
      address: "حي العليا، شارع الملك فهد، الرياض",
      image: asset("pro-clinic.jpg"),
      rating: 5,
      views: 5000,
      waitMinutes: 30,
      priceSar: 100,
      phone: "+966123456789",
      note: "الكشف بأسبقية الحضور للعيادة",
      slots: [
        { start: "2026-04-02T16:00:00+03:00", end: "2026-04-02T19:00:00+03:00" },
        { start: "2026-04-08T16:00:00+03:00", end: "2026-04-08T19:00:00+03:00" },
      ],
    },
    {
      id: "clinic-care",
      name: "عيادة كير الطبية",
      specialtiesCount: 6,
      doctorsCount: 5,
      address: "حي الصفا، جدة",
      image: asset("pro-clinic.jpg"),
      rating: 4.7,
      views: 2800,
      waitMinutes: 35,
      priceSar: 90,
      phone: "+966507778899",
      note: "الكشف بأسبقية الحضور للعيادة",
      slots: [
        { start: "2026-04-03T09:00:00+03:00", end: "2026-04-03T12:00:00+03:00" },
      ],
    },
  ];

  const slotFmt = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formatSlotRangeAr = (startIso, endIso) => {
    const a = new Date(startIso);
    const b = new Date(endIso);
    const dayPart = slotFmt.formatToParts(a);
    const get = (t) => dayPart.find((p) => p.type === t)?.value ?? "";
    const dateStr = `${get("weekday")} | ${get("day")} ${get("month")} ${get("year")}`;
    const timeFmt = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} (${timeFmt.format(a)} – ${timeFmt.format(b)})`;
  };

  const formatBookCta = (startIso, endIso) => {
    const a = new Date(startIso);
    const b = new Date(endIso);
    const d = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(a);
    const timeFmt = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `احجز في ${d} (${timeFmt.format(a)} – ${timeFmt.format(b)})`;
  };

  const getDoctor = (id) => DOCTORS.find((d) => d.id === id) ?? null;
  const getClinic = (id) => CLINICS.find((c) => c.id === id) ?? null;

  const getDoctorsForClinic = (clinicId) =>
    DOCTORS.filter((d) => (d.clinicIds || []).includes(clinicId));

  const getDoctorSlot = (doctorId, slotIndex) => {
    const d = getDoctor(doctorId);
    if (!d || !d.slots[slotIndex]) return null;
    return d.slots[slotIndex];
  };

  const getClinicSlot = (clinicId, slotIndex) => {
    const c = getClinic(clinicId);
    if (!c || !c.slots[slotIndex]) return null;
    return c.slots[slotIndex];
  };

  window.YCatalog = {
    DOCTORS,
    CLINICS,
    getDoctor,
    getClinic,
    getDoctorsForClinic,
    formatSlotRangeAr,
    formatBookCta,
    getDoctorSlot,
    getClinicSlot,
  };
})();
