const T = "campusSkillExchangeToken",
  U = "campusSkillExchangeUser";
let user;
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
async function api(url, o = {}) {
  const h = { "Content-Type": "application/json", ...(o.headers || {}) };
  h.Authorization = "Bearer " + localStorage.getItem(T);
  const r = await fetch("../api" + url, { ...o, headers: h }),
    d = await r.json().catch(() => ({}));
  if (r.status === 401) {
    localStorage.removeItem(T);
    location.href = "login.html";
    throw Error("Please log in again.");
  }
  if (!r.ok) throw Error(d.message || "Request failed.");
  return d;
}
function set(id, v) {
  const e = document.getElementById(id);
  if (e) e.textContent = v || "Not available";
}
function skills(s) {
  const e = document.getElementById("skillsList");
  e.innerHTML = "";
  String(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .forEach((x) => {
      const t = document.createElement("span");
      t.className = "skill-tag";
      t.textContent = x;
      e.appendChild(t);
    });
}
async function load() {
  user = (await api("/auth/me")).user;
  set("studentName", user.name);
  set("profileName", user.name);
  set("profileEmail", user.email);
  set("profileCollege", user.college);
  set("profileCourse", user.course);
  document.getElementById("studentAvatar").textContent = user.name.slice(0, 2).toUpperCase();
  const s = String(user.skills)
    .split(",")
    .filter((x) => x.trim());
  set("skillsCount", s.length);
  skills(user.skills);
  const rs = (await api("/requests")).requests;
  const incoming = rs.filter((r) => r.toUserId === user.id && r.status === "pending");
  set("requestCount", incoming.length);
  set(
    "notificationSummary",
    incoming.length
      ? incoming.length + " pending exchange request(s)."
      : "No new exchange requests."
  );
  const list = document.getElementById("requestList");
  list.innerHTML = "";
  incoming.forEach((r) => {
    const x = document.createElement("article");
    x.className = "request-item";
    x.innerHTML =
      "<div><strong>" +
      r.fromName +
      "</strong><p>" +
      r.message +
      "</p></div><div class=request-actions><button class=accept-request data-id=" +
      r.id +
      ">Accept</button><button class=decline-request data-id=" +
      r.id +
      ">Decline</button></div>";
    list.appendChild(x);
  });
  const con = document.getElementById("acceptedConnections");
  const accepted = rs.filter((r) => r.status === "accepted" && r.otherUser.whatsapp);
  con.innerHTML = accepted.length
    ? accepted
        .map(
          (r) =>
            '<div class="request-item"><strong>' +
            r.otherUser.name +
            '</strong><a class="button" target="_blank" rel="noopener noreferrer" href="https://wa.me/' +
            r.otherUser.whatsapp +
            '">WhatsApp ↗</a></div>'
        )
        .join("")
    : '<p class="empty-requests">WhatsApp contact appears here after an exchange request is accepted.</p>';
  editName.value = user.name;
  editCollege.value = user.college;
  editCourse.value = user.course;
  editSkills.value = user.skills;
  editWhatsapp.value = user.whatsapp || "";
  editPassword.value = "";
}
document.addEventListener("DOMContentLoaded", async () => {
  if (!localStorage.getItem(T)) {
    location.href = "login.html";
    return;
  }
  try {
    await load();
  } catch (e) {
    toast(e.message, "error");
  }
  editProfileButton?.addEventListener("click", () => (editProfileSection.hidden = false));
  cancelEditButton?.addEventListener("click", () => (editProfileSection.hidden = true));
  editProfileForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const b = e.target.querySelector("button[type=submit]");
    b.disabled = true;
    try {
      const d = await api("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: editName.value.trim(),
          college: editCollege.value.trim(),
          course: editCourse.value.trim(),
          skills: editSkills.value.trim(),
          whatsapp: editWhatsapp.value.trim(),
          password: editPassword.value,
        }),
      });
      localStorage.setItem(U, JSON.stringify(d.user));
      await load();
      editProfileSection.hidden = true;
      toast("Profile updated successfully.");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      b.disabled = false;
    }
  });
  requestList?.addEventListener("click", async (e) => {
    const b = e.target.closest("button[data-id]");
    if (!b) return;
    const action = b.classList.contains("accept-request") ? "accept" : "decline";
    if (action === "decline" && !confirm("Decline this exchange request?")) return;
    b.disabled = true;
    try {
      await api("/requests/" + b.dataset.id, {
        method: "PATCH",
        body: JSON.stringify({ status: action === "accept" ? "accepted" : "declined" }),
      });
      await load();
      toast(action === "accept" ? "Exchange request accepted." : "Exchange request declined.");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      b.disabled = false;
    }
  });
  logoutButton?.addEventListener("click", () => {
    if (!confirm("Log out of Campus Skill Exchange?")) return;
    localStorage.removeItem(T);
    localStorage.removeItem(U);
    location.href = "login.html";
  });
  deleteAccountButton?.addEventListener("click", () => {
    deleteModal.hidden = false;
    deletePassword.value = "";
    deletePassword.focus();
  });
  cancelDeleteButton?.addEventListener("click", () => (deleteModal.hidden = true));
  confirmDeleteButton?.addEventListener("click", async () => {
    const password = deletePassword.value;
    if (!password) {
      toast("Enter your current password.", "error");
      return;
    }
    confirmDeleteButton.disabled = true;
    try {
      await api("/auth/account", { method: "DELETE", body: JSON.stringify({ password }) });
      localStorage.removeItem(T);
      localStorage.removeItem(U);
      toast("Account deleted successfully.");
      setTimeout(() => (location.href = "../index.html"), 700);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      confirmDeleteButton.disabled = false;
    }
  });
});
