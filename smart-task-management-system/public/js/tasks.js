App.requireAuth();
App.bindLogout();

const taskAlert = document.getElementById("taskAlert");
const filterForm = document.getElementById("filterForm");
const taskCount = document.getElementById("taskCount");
const tasksLoading = document.getElementById("tasksLoading");
const tasksEmpty = document.getElementById("tasksEmpty");
const tasksList = document.getElementById("tasksList");

const params = new URLSearchParams(window.location.search);

const setInitialFilters = () => {
  ["search", "status", "priority", "sortBy", "sortOrder"].forEach((name) => {
    if (params.has(name) && filterForm.elements[name]) {
      filterForm.elements[name].value = params.get(name);
    }
  });
};

const buildQuery = () => {
  const formData = new FormData(filterForm);
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
  tasksLoading.classList.toggle("d-none", !isLoading);
};

const renderTask = (task) => {
  const completedDisabled = task.status === "completed" ? "disabled" : "";

  return `
    <article class="task-item">
      <div class="task-item-main">
        <div class="task-title">${App.escapeHtml(task.title)}</div>
        <p class="text-secondary mb-0">${App.escapeHtml(task.description || "No description added.")}</p>
        <div class="task-meta">
          <span class="badge badge-soft ${App.statusClass(task.status)}">${App.formatLabel(task.status)}</span>
          <span class="badge badge-soft ${App.priorityClass(task.priority)}">${App.formatLabel(task.priority)}</span>
          <span class="badge text-bg-light">${App.escapeHtml(task.category || "General")}</span>
          <span class="badge text-bg-light">${App.formatDate(task.due_date)}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn btn-sm btn-outline-success" data-action="complete" data-id="${task.id}" ${completedDisabled}>Complete</button>
        <a class="btn btn-sm btn-outline-secondary" href="/edit-task.html?id=${task.id}">Edit</a>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${task.id}">Delete</button>
      </div>
    </article>
  `;
};

const loadTasks = async () => {
  setLoading(true);
  tasksEmpty.classList.add("d-none");
  tasksList.innerHTML = "";

  try {
    const query = buildQuery();
    const data = await App.apiFetch(`/api/tasks?${query.toString()}`);
    const tasks = data.tasks || [];

    taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"} found`;
    setLoading(false);

    if (tasks.length === 0) {
      tasksEmpty.classList.remove("d-none");
      return;
    }

    tasksList.innerHTML = tasks.map(renderTask).join("");
  } catch (error) {
    setLoading(false);
    App.showAlert(taskAlert, "danger", error.message || "Unable to load tasks.");
  }
};

filterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const search = filterForm.search.value.trim();
  if (search && search.length < 2) {
    App.showAlert(taskAlert, "warning", "Search must be at least 2 characters.");
    return;
  }

  const query = buildQuery();
  window.history.replaceState({}, "", query.toString() ? `/tasks.html?${query}` : "/tasks.html");
  loadTasks();
});

tasksList.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) {
    return;
  }

  const { action, id } = actionButton.dataset;
  actionButton.disabled = true;

  try {
    if (action === "complete") {
      await App.apiFetch(`/api/tasks/${id}/complete`, { method: "PATCH" });
      App.showAlert(taskAlert, "success", "Task marked as completed.");
    }

    if (action === "delete") {
      const confirmed = window.confirm("Delete this task?");
      if (!confirmed) {
        actionButton.disabled = false;
        return;
      }

      await App.apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
      App.showAlert(taskAlert, "success", "Task deleted successfully.");
    }

    loadTasks();
  } catch (error) {
    actionButton.disabled = false;
    App.showAlert(taskAlert, "danger", error.message || "Action failed.");
  }
});

setInitialFilters();
loadTasks();
