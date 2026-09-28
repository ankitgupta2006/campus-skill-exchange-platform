const heroSearchForm = document.getElementById("heroSearchForm");
const heroSearchInput = document.getElementById("heroSearchInput");

heroSearchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = heroSearchInput?.value.trim() || "";
  const destination = query
    ? `pages/profiles.html?search=${encodeURIComponent(query)}`
    : "pages/profiles.html";
  window.location.href = destination;
});
