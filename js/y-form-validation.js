/**
 * Shared Arabic field validation helpers for site forms.
 */
(() => {
  const MSG = {
    nameRequired: "يرجى إدخال الاسم.",
    nameShort: "الاسم يجب أن يكون حرفين على الأقل.",
    phoneRequired: "يرجى إدخال رقم الهاتف.",
    phoneInvalid: "رقم الهاتف غير صالح (8–15 رقماً).",
    emailRequired: "يرجى إدخال البريد الإلكتروني.",
    emailInvalid: "صيغة البريد الإلكتروني غير صالحة.",
    passwordRequired: "يرجى إدخال كلمة المرور.",
    passwordWeak: "كلمة المرور يجب ألا تقل عن 8 أحرف.",
    messageRequired: "يرجى إدخال الرسالة.",
    messageShort: "الرسالة يجب ألا تقل عن 10 أحرف.",
    cardRequired: "يرجى إدخال رقم البطاقة.",
    cardInvalid: "رقم البطاقة غير صالح.",
    cardHolderRequired: "يرجى إدخال الاسم على البطاقة.",
    expiryMonthInvalid: "الشهر يجب أن يكون بين 1 و 12.",
    expiryYearInvalid: "السنة غير صالحة.",
    cardExpired: "انتهت صلاحية البطاقة.",
    cvvInvalid: "رمز الأمان يجب أن يكون 3 أو 4 أرقام.",
  };

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const digitCount = (s) => (String(s).match(/\d/g) || []).length;

  const findErrorGroup = (el) =>
    el && (el.closest(".form-group") || el.closest(".y-form-field"));

  const setFieldError = (el, errorId, message) => {
    const box = errorId ? document.getElementById(errorId) : null;
    const group = findErrorGroup(el);
    if (box) {
      box.textContent = message;
      box.hidden = false;
    }
    if (group) group.classList.add("has-error");
    if (el?.setAttribute) el.setAttribute("aria-invalid", "true");
  };

  const clearFieldError = (el, errorId) => {
    const box = errorId ? document.getElementById(errorId) : null;
    const group = findErrorGroup(el);
    if (box) {
      box.textContent = "";
      box.hidden = true;
    }
    if (group) group.classList.remove("has-error");
    if (el?.setAttribute) el.setAttribute("aria-invalid", "false");
  };

  const luhnValid = (raw) => {
    const d = String(raw).replace(/\D/g, "");
    if (d.length < 13 || d.length > 19) return false;
    let sum = 0;
    let alt = false;
    for (let i = d.length - 1; i >= 0; i--) {
      let n = parseInt(d[i], 10);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  };

  const parseExpiryYear = (raw) => {
    const yRaw = String(raw || "").trim();
    if (!yRaw) return NaN;
    const y = yRaw.length === 2 ? 2000 + parseInt(yRaw, 10) : parseInt(yRaw, 10);
    return y;
  };

  window.YFormValidation = {
    MSG,
    emailRe,
    digitCount,
    findErrorGroup,
    setFieldError,
    clearFieldError,

    validatePatientName(el, errorId) {
      const v = (el?.value || "").trim();
      if (!v) {
        setFieldError(el, errorId, MSG.nameRequired);
        return false;
      }
      if (v.length < 2) {
        setFieldError(el, errorId, MSG.nameShort);
        return false;
      }
      clearFieldError(el, errorId);
      return true;
    },

    validatePhone(el, errorId) {
      const raw = (el?.value || "").trim();
      if (!raw) {
        setFieldError(el, errorId, MSG.phoneRequired);
        return false;
      }
      const n = digitCount(raw);
      if (n < 8 || n > 15) {
        setFieldError(el, errorId, MSG.phoneInvalid);
        return false;
      }
      clearFieldError(el, errorId);
      return true;
    },

    validateEmail(el, errorId) {
      const v = (el?.value || "").trim();
      if (!v) {
        setFieldError(el, errorId, MSG.emailRequired);
        return false;
      }
      if (!emailRe.test(v)) {
        setFieldError(el, errorId, MSG.emailInvalid);
        return false;
      }
      clearFieldError(el, errorId);
      return true;
    },

    validatePassword(el, errorId, minLen = 8) {
      const v = el?.value || "";
      if (!v) {
        setFieldError(el, errorId, MSG.passwordRequired);
        return false;
      }
      if (v.length < minLen) {
        setFieldError(el, errorId, MSG.passwordWeak);
        return false;
      }
      clearFieldError(el, errorId);
      return true;
    },

    validateMessage(el, errorId, minLen = 10) {
      const v = (el?.value || "").trim();
      if (!v) {
        setFieldError(el, errorId, MSG.messageRequired);
        return false;
      }
      if (v.length < minLen) {
        setFieldError(el, errorId, MSG.messageShort);
        return false;
      }
      clearFieldError(el, errorId);
      return true;
    },

    validateCardNumber(el, errorId) {
      const raw = (el?.value || "").trim();
      if (!raw) {
        setFieldError(el, errorId, MSG.cardRequired);
        return false;
      }
      const n = digitCount(raw);
      if (n < 13 || n > 19 || !luhnValid(raw)) {
        setFieldError(el, errorId, MSG.cardInvalid);
        return false;
      }
      clearFieldError(el, errorId);
      return true;
    },

    validateCardHolder(el, errorId) {
      const v = (el?.value || "").trim();
      if (!v) {
        setFieldError(el, errorId, MSG.cardHolderRequired);
        return false;
      }
      if (v.length < 2) {
        setFieldError(el, errorId, MSG.nameShort);
        return false;
      }
      clearFieldError(el, errorId);
      return true;
    },

    validateExpiry(monthEl, yearEl, monthErrId, yearErrId) {
      const mRaw = (monthEl?.value || "").trim();
      const yRaw = (yearEl?.value || "").trim();
      const m = parseInt(mRaw, 10);
      let monthOk = true;
      let yearOk = true;

      if (!mRaw || Number.isNaN(m) || m < 1 || m > 12) {
        setFieldError(monthEl, monthErrId, MSG.expiryMonthInvalid);
        monthOk = false;
      } else {
        clearFieldError(monthEl, monthErrId);
      }

      const y = parseExpiryYear(yRaw);
      const nowY = new Date().getFullYear();
      if (!yRaw || Number.isNaN(y) || y < nowY - 25 || y > nowY + 20) {
        setFieldError(yearEl, yearErrId, MSG.expiryYearInvalid);
        yearOk = false;
      } else {
        clearFieldError(yearEl, yearErrId);
      }

      if (!monthOk || !yearOk) return false;

      const now = new Date();
      const nowYear = now.getFullYear();
      const nowMonth = now.getMonth() + 1;
      if (y < nowYear || (y === nowYear && m < nowMonth)) {
        setFieldError(monthEl, monthErrId, MSG.cardExpired);
        setFieldError(yearEl, yearErrId, MSG.cardExpired);
        return false;
      }

      clearFieldError(monthEl, monthErrId);
      clearFieldError(yearEl, yearErrId);
      return true;
    },

    validateCvv(el, errorId) {
      const d = String(el?.value || "").replace(/\D/g, "");
      if (d.length < 3 || d.length > 4) {
        setFieldError(el, errorId, MSG.cvvInvalid);
        return false;
      }
      clearFieldError(el, errorId);
      return true;
    },
  };
})();
