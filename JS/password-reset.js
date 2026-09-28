function toast(message, type = "success") {
  const box = document.getElementById("toastContainer");
  if (!box) return;
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = message;
  box.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}
function setLoading(button, on, label) {
  if (!button) return;
  button.disabled = on;
  button.dataset.original = button.dataset.original || button.textContent;
  button.textContent = on ? "Please wait…" : label || button.dataset.original;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest(".password-toggle");
  if (!b) return;
  const input = document.getElementById(b.dataset.target);
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
  b.textContent = input.type === "password" ? "Show" : "Hide";
});
document.addEventListener("DOMContentLoaded", () => {
  const forgot = document.getElementById("forgotForm");
  forgot?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const b = document.getElementById("forgotSubmit");
    setLoading(b, true);
    try {
      const r = await fetch("../api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: document.getElementById("email").value.trim() }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message || "Could not send reset link.");
      toast(d.message);
      forgot.reset();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(b, false, "Send Reset Link");
    }
  });
  const reset = document.getElementById("resetForm");
  reset?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const p = document.getElementById("password").value,
      c = document.getElementById("confirmPassword").value;
    if (p !== c) {
      toast("Passwords do not match.", "error");
      return;
    }
    const b = document.getElementById("resetSubmit");
    setLoading(b, true);
    try {
      const token = new URLSearchParams(location.search).get("token") || "";
      const r = await fetch("../api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: p }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message || "Could not reset the password.");
      toast(d.message);
      setTimeout(() => (location.href = "login.html"), 1200);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(b, false, "Reset Password");
    }
  });
});
