/**
 * Demo persistence: bookings + pending booking context (sessionStorage).
 */
(() => {
  const VERSION = 1;
  const K_VER = "y_clinic_storage_version";
  const K_BOOKINGS = "y_clinic_bookings";
  const K_PENDING = "y_clinic_pending_booking";
  const K_SESSION = "y_clinic_session";
  const K_USER_PROFILES = "y_clinic_user_profiles";

  const safeParse = (raw, fallback) => {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const migrate = () => {
    const v = Number(localStorage.getItem(K_VER)) || 0;
    if (v !== VERSION) {
      localStorage.setItem(K_VER, String(VERSION));
    }
  };

  const getBookings = () => {
    migrate();
    const list = safeParse(localStorage.getItem(K_BOOKINGS), []);
    return Array.isArray(list) ? list : [];
  };

  const setBookings = (list) => {
    localStorage.setItem(K_BOOKINGS, JSON.stringify(list));
  };

  const addBooking = (record) => {
    const list = getBookings();
    const id =
      record.id ||
      `b_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    list.unshift({ ...record, id, createdAt: record.createdAt || new Date().toISOString() });
    setBookings(list);
    return id;
  };

  const removeBooking = (id) => {
    setBookings(getBookings().filter((b) => b.id !== id));
  };

  const setPendingBooking = (payload) => {
    sessionStorage.setItem(K_PENDING, JSON.stringify(payload));
  };

  const getPendingBooking = () =>
    safeParse(sessionStorage.getItem(K_PENDING), null);

  const clearPendingBooking = () => sessionStorage.removeItem(K_PENDING);

  const setSession = (payload) => {
    migrate();
    localStorage.setItem(K_SESSION, JSON.stringify(payload));
  };

  const getSession = () => {
    migrate();
    return safeParse(localStorage.getItem(K_SESSION), null);
  };

  const clearSession = () => localStorage.removeItem(K_SESSION);

  const normEmail = (email) => String(email || "").trim().toLowerCase();

  const getUserProfiles = () => {
    const o = safeParse(localStorage.getItem(K_USER_PROFILES), {});
    return o && typeof o === "object" && !Array.isArray(o) ? o : {};
  };

  const getUserProfile = (email) => {
    const key = normEmail(email);
    if (!key) return null;
    const p = getUserProfiles()[key];
    return p && typeof p === "object" ? p : null;
  };

  const saveUserProfile = (email, profile) => {
    const key = normEmail(email);
    if (!key) return;
    const all = getUserProfiles();
    const prev = all[key] && typeof all[key] === "object" ? all[key] : {};
    all[key] = { ...prev, ...profile, email: email.trim() };
    localStorage.setItem(K_USER_PROFILES, JSON.stringify(all));
  };

  window.YClinicStorage = {
    getBookings,
    addBooking,
    removeBooking,
    setPendingBooking,
    getPendingBooking,
    clearPendingBooking,
    setSession,
    getSession,
    clearSession,
    getUserProfile,
    saveUserProfile,
  };
})();
