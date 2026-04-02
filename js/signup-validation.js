/**
 * Signup form: birthdate picker + gender + shared field validators.
 */
(() => {
  const V = window.YFormValidation;
  if (!V) return;
  const form = document.querySelector(".auth-section form");
  if (!form) return;

  const MSG = {
    birthdateRequired: "يرجى اختيار تاريخ الميلاد.",
    genderRequired: "يرجى اختيار الجنس.",
  };

  const q = (sel) => form.querySelector(sel);

  const validateBirthdate = () => {
    const hidden = q("#birthdate");
    const trigger = q("#birthdate-trigger");
    const v = (hidden?.value || "").trim();
    if (!v) {
      V.setFieldError(trigger, "birthdate-error", MSG.birthdateRequired);
      return false;
    }
    V.clearFieldError(trigger, "birthdate-error");
    return true;
  };

  const validateGender = () => {
    const checked = form.querySelector('input[name="gender"]:checked');
    const male = q("#gender-male");
    const female = q("#gender-female");
    if (!checked) {
      V.setFieldError(male, "gender-error", MSG.genderRequired);
      female?.setAttribute("aria-invalid", "true");
      return false;
    }
    V.clearFieldError(male, "gender-error");
    female?.setAttribute("aria-invalid", "false");
    return true;
  };

  const validateName = () => V.validatePatientName(q("#name"), "name-error");
  const validatePhone = () => V.validatePhone(q("#phone"), "phone-error");
  const validateEmail = () => V.validateEmail(q("#email"), "email-error");
  const validatePassword = () => V.validatePassword(q("#password"), "password-error");

  const runAllValidators = () => [
    validateName(),
    validatePhone(),
    validateEmail(),
    validateBirthdate(),
    validateGender(),
    validatePassword(),
  ];

  const focusOrder = [
    () => q("#name"),
    () => q("#phone"),
    () => q("#email"),
    () => q("#birthdate-trigger"),
    () => q("#gender-male"),
    () => q("#password"),
  ];

  q("#name")?.addEventListener("blur", validateName);
  q("#name")?.addEventListener("input", () => {
    if (q("#name-error") && !q("#name-error").hidden) validateName();
  });

  q("#phone")?.addEventListener("blur", validatePhone);
  q("#phone")?.addEventListener("input", () => {
    if (q("#phone-error") && !q("#phone-error").hidden) validatePhone();
  });

  q("#email")?.addEventListener("blur", validateEmail);
  q("#email")?.addEventListener("input", () => {
    if (q("#email-error") && !q("#email-error").hidden) validateEmail();
  });

  q("#birthdate")?.addEventListener("input", () => {
    if (q("#birthdate-error") && !q("#birthdate-error").hidden)
      validateBirthdate();
  });

  form.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (q("#gender-error") && !q("#gender-error").hidden) validateGender();
    });
  });

  q("#password")?.addEventListener("blur", validatePassword);
  q("#password")?.addEventListener("input", () => {
    if (q("#password-error") && !q("#password-error").hidden)
      validatePassword();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = runAllValidators();
    if (!ok.every(Boolean)) {
      const i = ok.findIndex((v) => !v);
      focusOrder[i]?.()?.focus?.();
      return;
    }
    const em = q("#email").value.trim();
    const fullName = q("#name").value.trim();
    const phone = q("#phone").value.trim();
    const firstName =
      fullName.split(/\s+/).filter(Boolean)[0] || "";
    const payload = {
      email: em,
      firstName,
      fullName,
      phone,
      at: new Date().toISOString(),
    };
    if (window.YClinicStorage?.setSession) {
      window.YClinicStorage.setSession(payload);
      window.YClinicStorage.saveUserProfile?.(em, {
        firstName,
        fullName,
        phone,
      });
    } else {
      try {
        localStorage.setItem("y_clinic_session", JSON.stringify(payload));
      } catch (_) {}
    }
    window.location.href = "../account/account.html";
  });
})();
