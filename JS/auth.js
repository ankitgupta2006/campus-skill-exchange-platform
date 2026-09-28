const TOKEN_KEY = "campusSkillExchangeToken";
const USER_KEY = "campusSkillExchangeUser";
function toast(message, type = "success") {
  const box = document.getElementById("toastContainer");
  if (!box) {
    alert(message);
    return;
  }
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = message;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
function saveAuth(d) {
  localStorage.setItem(TOKEN_KEY, d.token);
  localStorage.setItem(USER_KEY, JSON.stringify(d.user));
}
function setBusy(button, busy, label) {
  if (!button) return;
  button.disabled = busy;
  if (busy) {
    button.dataset.old = button.textContent;
    button.textContent = "Please wait…";
  } else button.textContent = label || button.dataset.old || "Submit";
}
async function api(url, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const t = localStorage.getItem(TOKEN_KEY);
  if (t) headers.Authorization = "Bearer " + t;
  const r = await fetch("/api" + url, { ...options, headers });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.message || "Request failed.");
  return d;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest(".password-toggle");
  if (!b) return;
  const i = document.getElementById(b.dataset.target);
  if (!i) return;
  i.type = i.type === "password" ? "text" : "password";
  b.textContent = i.type === "password" ? "Show" : "Hide";
});

const reg = document.getElementById("registerForm");
reg?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const b = reg.querySelector("button[type=submit]");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const collegeInput = document.getElementById("college");
  const courseInput = document.getElementById("course");
  const skillsInput = document.getElementById("skills");
  const whatsappInput = document.getElementById("whatsapp");
  const passwordInput = document.getElementById("password");
  if (
    !nameInput ||
    !emailInput ||
    !collegeInput ||
    !courseInput ||
    !skillsInput ||
    !whatsappInput ||
    !passwordInput
  ) {
    toast("Registration form fields are missing. Please refresh the page.", "error");
    return;
  }
  setBusy(b, true);
  try {
    const d = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        college: collegeInput.value.trim(),
        course: courseInput.value.trim(),
        skills: skillsInput.value.trim(),
        whatsapp: whatsappInput.value.trim(),
        password: passwordInput.value,
      }),
    });
    saveAuth(d);
    toast("Profile created successfully!");
    setTimeout(() => (location.href = "dashboard.html"), 500);
  } catch (err) {
    toast(err.message, "error");
  } finally {
    setBusy(b, false, "Create Profile");
  }
});

const login = document.getElementById("loginForm");
login?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const b = document.getElementById("loginSubmit");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  if (!emailInput || !passwordInput) {
    toast("Login form fields are missing. Please refresh the page.", "error");
    return;
  }
  setBusy(b, true);
  try {
    const d = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: emailInput.value.trim(), password: passwordInput.value }),
    });
    saveAuth(d);
    toast("Login successful!");
    setTimeout(() => (location.href = "dashboard.html"), 500);
  } catch (err) {
    toast(err.message, "error");
  } finally {
    setBusy(b, false, "Sign In");
  }
});
