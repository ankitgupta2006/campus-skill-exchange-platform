const TOKEN_KEY = "campusSkillExchangeToken";

async function api(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`../api${url}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "login.html";
    throw new Error("Please log in.");
  }
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}

let profiles = [];

function makeText(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function render(list) {
  const container = document.getElementById("profileContainer");
  if (!container) return;
  container.replaceChildren();

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "no-profile";
    empty.append(makeText("h3", "", "No students found"), makeText("p", "", "Try another search."));
    container.appendChild(empty);
    return;
  }

  list.forEach((profile) => {
    const card = document.createElement("div");
    card.className = "profile-card";

    const top = document.createElement("div");
    top.className = "profile-top";
    top.append(
      makeText(
        "div",
        "profile-avatar",
        String(profile.name || "ST")
          .slice(0, 2)
          .toUpperCase()
      )
    );
    const identity = document.createElement("div");
    identity.append(
      makeText("h3", "", profile.name),
      makeText("p", "profile-course", profile.course)
    );
    top.appendChild(identity);

    const skills = document.createElement("div");
    skills.className = "profile-skills";
    skills.appendChild(makeText("strong", "", "Skills to teach"));
    String(profile.skills || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .forEach((skill) => skills.appendChild(makeText("span", "skill-tag", skill)));

    card.append(
      top,
      makeText("p", "", `College: ${profile.college}`),
      makeText("p", "", `Email: ${profile.email}`),
      skills
    );

    const action = document.createElement("div");
    action.className = "profile-action";
    if (profile.whatsappUnlocked && profile.whatsapp) {
      const link = makeText("a", "button", "WhatsApp ↗");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.href = `https://wa.me/${encodeURIComponent(profile.whatsapp)}`;
      action.appendChild(link);
    } else {
      const button = makeText("button", "request-button", "Send exchange request");
      button.type = "button";
      button.dataset.id = profile.id;
      action.appendChild(button);
    }
    card.appendChild(action);
    container.appendChild(card);
  });
}

async function load() {
  const data = await api("/users/peers");
  profiles = data.users || [];
  render(profiles);

  const query =
    new URLSearchParams(window.location.search).get("search") ||
    new URLSearchParams(window.location.search).get("skill") ||
    "";
  if (query) {
    const input = document.getElementById("searchInput");
    if (input) input.value = query;
    filter(query);
  }
}

function filter(query = document.getElementById("searchInput")?.value || "") {
  const value = query.trim().toLowerCase();
  render(
    profiles.filter((profile) =>
      [profile.name, profile.skills, profile.course, profile.college].some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(value)
      )
    )
  );
}

function searchProfiles() {
  filter();
}

window.searchProfiles = searchProfiles;
document.getElementById("searchInput")?.addEventListener("input", () => filter());
document.getElementById("profileContainer")?.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button || button.disabled) return;

  const message = window.prompt(
    "Message for this exchange request:",
    "I would like to exchange skills with you."
  );
  if (message === null) return;

  button.disabled = true;
  try {
    await api("/requests", {
      method: "POST",
      body: JSON.stringify({
        toUserId: button.dataset.id,
        message: message.trim(),
      }),
    });
    button.textContent = "Request sent";
  } catch (error) {
    button.disabled = false;
    window.alert(error.message);
  }
});

if (!localStorage.getItem(TOKEN_KEY)) {
  window.location.href = "login.html";
} else {
  load().catch((error) => window.alert(error.message));
}
