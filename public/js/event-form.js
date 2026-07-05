App.requireAuth();
App.bindLogout();

const eventForm = document.getElementById("eventForm");
const eventFormAlert = document.getElementById("eventFormAlert");
const eventFormButton = document.getElementById("eventFormButton");
const eventFormLoading = document.getElementById("eventFormLoading");
const mode = eventForm.dataset.mode;
const eventId = new URLSearchParams(window.location.search).get("id");

const setButtonLoading = (isLoading) => {
  eventFormButton.disabled = isLoading;
  eventFormButton.textContent = isLoading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Event";
};

const getPayload = () => {
  return {
    title: eventForm.title.value.trim(),
    description: eventForm.description.value.trim() || null,
    status: eventForm.status.value,
    category: eventForm.category.value.trim() || "General",
    location: eventForm.location.value.trim() || null,
    eventDate: eventForm.eventDate.value || null,
  };
};

const fillForm = (eventData) => {
  eventForm.title.value = eventData.title || "";
  eventForm.description.value = eventData.description || "";
  eventForm.status.value = eventData.status || "scheduled";
  eventForm.category.value = eventData.category || "General";
  eventForm.location.value = eventData.location || "";
  eventForm.eventDate.value = App.toDateInputValue(eventData.event_date);
};

const loadEventForEdit = async () => {
  if (mode !== "edit") {
    return;
  }

  if (!eventId) {
    App.showAlert(eventFormAlert, "danger", "Event ID is missing.");
    eventFormLoading.classList.add("d-none");
    return;
  }

  try {
    const data = await App.apiFetch(`/api/events/${eventId}`);
    fillForm(data.event);
    eventFormLoading.classList.add("d-none");
    eventForm.classList.remove("d-none");
  } catch (error) {
    eventFormLoading.classList.add("d-none");
    App.showAlert(eventFormAlert, "danger", error.message || "Unable to load event.");
  }
};

eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  eventForm.classList.add("was-validated");

  if (!eventForm.checkValidity()) {
    return;
  }

  setButtonLoading(true);

  try {
    if (mode === "edit") {
      await App.apiFetch(`/api/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify(getPayload()),
      });
      App.showAlert(eventFormAlert, "success", "Event updated successfully. Redirecting...");
    } else {
      await App.apiFetch("/api/events", {
        method: "POST",
        body: JSON.stringify(getPayload()),
      });
      App.showAlert(eventFormAlert, "success", "Event created successfully. Redirecting...");
      eventForm.reset();
      eventForm.category.value = "General";
      eventForm.status.value = "scheduled";
      eventForm.classList.remove("was-validated");
    }

    setTimeout(() => {
      window.location.href = "/events.html";
    }, 700);
  } catch (error) {
    App.showAlert(eventFormAlert, "danger", error.message || "Unable to save event.");
  } finally {
    setButtonLoading(false);
  }
});

if (mode === "edit") {
  loadEventForEdit();
}
