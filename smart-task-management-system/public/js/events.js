App.requireAuth();
App.bindLogout();

const eventAlert = document.getElementById("eventAlert");
const eventFilterForm = document.getElementById("eventFilterForm");
const eventCount = document.getElementById("eventCount");
const eventsLoading = document.getElementById("eventsLoading");
const eventsEmpty = document.getElementById("eventsEmpty");
const eventsList = document.getElementById("eventsList");

const params = new URLSearchParams(window.location.search);

const setInitialFilters = () => {
  ["search", "status", "category", "sortBy", "sortOrder"].forEach((name) => {
    if (params.has(name) && eventFilterForm.elements[name]) {
      eventFilterForm.elements[name].value = params.get(name);
    }
  });
};

const buildQuery = () => {
  const formData = new FormData(eventFilterForm);
  const query = new URLSearchParams();

  formData.forEach((value, key) => {
    const trimmedValue = String(value).trim();
    if (trimmedValue) {
      query.set(key, trimmedValue);
    }
  });

  return query;
};

const setLoading = (isLoading) => {
  eventsLoading.classList.toggle("d-none", !isLoading);
};

const renderEvent = (event) => {
  return `
    <article class="task-item">
      <div class="task-item-main">
        <div class="task-title">${App.escapeHtml(event.title)}</div>
        <p class="text-secondary mb-0">${App.escapeHtml(event.description || "No details added.")}</p>
        <div class="task-meta">
          <span class="badge badge-soft ${App.statusClass(event.status)}">${App.formatLabel(event.status)}</span>
          <span class="badge text-bg-light">${App.escapeHtml(event.category || "General")}</span>
          <span class="badge text-bg-light">${App.escapeHtml(event.location || "No location")}</span>
          <span class="badge text-bg-light">${App.formatDate(event.event_date)}</span>
        </div>
      </div>
      <div class="task-actions">
        <a class="btn btn-sm btn-outline-secondary" href="/edit-event.html?id=${event.id}">Edit</a>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${event.id}">Delete</button>
      </div>
    </article>
  `;
};

const loadEvents = async () => {
  setLoading(true);
  eventsEmpty.classList.add("d-none");
  eventsList.innerHTML = "";

  try {
    const query = buildQuery();
    const data = await App.apiFetch(`/api/events?${query.toString()}`);
    const events = data.events || [];

    eventCount.textContent = `${events.length} event${events.length === 1 ? "" : "s"} found`;
    setLoading(false);

    if (events.length === 0) {
      eventsEmpty.classList.remove("d-none");
      return;
    }

    eventsList.innerHTML = events.map(renderEvent).join("");
  } catch (error) {
    setLoading(false);
    App.showAlert(eventAlert, "danger", error.message || "Unable to load events.");
  }
};

const showAlert = (type, message) => {
  App.showAlert(eventAlert, type, message);
};

eventFilterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const search = eventFilterForm.search.value.trim();
  if (search && search.length < 2) {
    App.showAlert("warning", "Search must be at least 2 characters.");
    return;
  }

  const query = buildQuery();
  window.history.replaceState({}, "", query.toString() ? `/events.html?${query}` : "/events.html");
  loadEvents();
});

eventsList.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) {
    return;
  }

  const id = actionButton.dataset.id;
  actionButton.disabled = true;

  try {
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) {
      actionButton.disabled = false;
      return;
    }

    await App.apiFetch(`/api/events/${id}`, { method: "DELETE" });
    App.showAlert("success", "Event deleted successfully.");
    loadEvents();
  } catch (error) {
    actionButton.disabled = false;
    App.showAlert("danger", error.message || "Action failed.");
  }
});

setInitialFilters();
loadEvents();
