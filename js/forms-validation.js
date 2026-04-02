/**
 * Wires validation for forms marked with data-y-form (login, contact, booking, etc.).
 */
(() => {
  const V = window.YFormValidation;
  if (!V) return;

  const bindBlurInput = (el, validateFn) => {
    if (!el) return;
    el.addEventListener("blur", validateFn);
    el.addEventListener("input", () => {
      const id = el.getAttribute("aria-describedby");
      if (!id) return;
      const box = document.getElementById(id);
      if (box && !box.hidden) validateFn();
    });
  };

  const runSequentialFocus = (results, getEls) => {
    const i = results.findIndex((v) => !v);
    if (i < 0) return;
    getEls[i]?.()?.focus?.();
  };

  const initLogin = (form) => {
    const q = (sel) => form.querySelector(sel);
    const email = q("#email");
    const password = q("#password");
    const vEmail = () => V.validateEmail(email, "email-error");
    const vPass = () => V.validatePassword(password, "password-error");
    bindBlurInput(email, vEmail);
    bindBlurInput(password, vPass);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = [vEmail(), vPass()];
      if (!ok.every(Boolean)) {
        runSequentialFocus(ok, [() => email, () => password]);
        return;
      }
      const em = email.value.trim();
      const profile = window.YClinicStorage?.getUserProfile?.(em) || {};
      const payload = {
        email: em,
        firstName: profile.firstName || "",
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        at: new Date().toISOString(),
      };
      if (window.YClinicStorage?.setSession) {
        window.YClinicStorage.setSession(payload);
      } else {
        try {
          localStorage.setItem("y_clinic_session", JSON.stringify(payload));
        } catch (_) {}
      }
      window.location.href = "../account/account.html";
    });
  };

  const initForgotPassword = (form) => {
    const email = form.querySelector("#email");
    const vEmail = () => V.validateEmail(email, "email-error");
    bindBlurInput(email, vEmail);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!vEmail()) {
        email?.focus();
        return;
      }
      window.location.href = "../login/login.html";
    });
  };

  const initContact = (form) => {
    const q = (sel) => form.querySelector(sel);
    const name = q("#name");
    const email = q("#email");
    const phone = q("#number");
    const message = q("#message");
    const vName = () => V.validatePatientName(name, "name-error");
    const vEmail = () => V.validateEmail(email, "email-error");
    const vPhone = () => V.validatePhone(phone, "number-error");
    const vMsg = () => V.validateMessage(message, "message-error");
    bindBlurInput(name, vName);
    bindBlurInput(email, vEmail);
    bindBlurInput(phone, vPhone);
    bindBlurInput(message, vMsg);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = [vName(), vEmail(), vPhone(), vMsg()];
      if (!ok.every(Boolean)) {
        runSequentialFocus(ok, [() => name, () => email, () => phone, () => message]);
        return;
      }
      form.reset();
      window.alert("تم إرسال الرسالة (عرض تجريبي بدون خادم).");
    });
  };

  const initBookingPatient = (form) => {
    const q = (sel) => form.querySelector(sel);
    const name = q("#name");
    const phone = q("#phone");
    const email = q("#email");
    const vName = () => V.validatePatientName(name, "booking-name-error");
    const vPhone = () => V.validatePhone(phone, "booking-phone-error");
    const vEmail = () => V.validateEmail(email, "booking-email-error");
    bindBlurInput(name, vName);
    bindBlurInput(phone, vPhone);
    bindBlurInput(email, vEmail);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = [vName(), vPhone(), vEmail()];
      if (!ok.every(Boolean)) {
        runSequentialFocus(ok, [() => name, () => phone, () => email]);
        return;
      }
      window.location.hash = "payment-popup";
    });
  };

  const initBookingPayment = (form) => {
    const q = (sel) => form.querySelector(sel);
    const emailPopup = q("#email-popup");
    const cardNumber = q("#card-number");
    const cardHolder = q("#card-holder");
    const expM = q("#expiry-month");
    const expY = q("#expiry-year");
    const cvv = q("#cvv");

    const vEmail = () => V.validateEmail(emailPopup, "email-popup-error");
    const vCard = () => V.validateCardNumber(cardNumber, "card-number-error");
    const vHolder = () => V.validateCardHolder(cardHolder, "card-holder-error");
    const vExpiry = () =>
      V.validateExpiry(expM, expY, "expiry-month-error", "expiry-year-error");
    const vCvv = () => V.validateCvv(cvv, "cvv-error");

    bindBlurInput(emailPopup, vEmail);
    bindBlurInput(cardNumber, vCard);
    bindBlurInput(cardHolder, vHolder);
    bindBlurInput(expM, vExpiry);
    bindBlurInput(expY, vExpiry);
    bindBlurInput(cvv, vCvv);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = [vEmail(), vCard(), vHolder(), vExpiry(), vCvv()];
      if (!ok.every(Boolean)) {
        runSequentialFocus(ok, [
          () => emailPopup,
          () => cardNumber,
          () => cardHolder,
          () => expM,
          () => cvv,
        ]);
        return;
      }
      window.location.hash = "success-popup";
      if (typeof window.YClinicBookingCommit === "function") {
        window.YClinicBookingCommit();
      }
    });
  };

  const registry = {
    login: initLogin,
    "forgot-password": initForgotPassword,
    contact: initContact,
    "booking-patient": initBookingPatient,
    "booking-payment": initBookingPayment,
  };

  document.querySelectorAll("form[data-y-form]").forEach((form) => {
    const key = form.getAttribute("data-y-form");
    registry[key]?.(form);
  });
})();
