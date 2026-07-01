App.requireAuth();
App.bindLogout();

const taskForm = document.getElementById("taskForm");
const taskFormAlert = document.getElementById("taskFormAlert");
const taskFormButton = document.getElementById("taskFormButton");
const taskFormLoading = document.getElementById("taskFormLoading");
const mode = taskForm.dataset.mode;
const taskId = new URLSearchParams(window.location.search).get("id");

const setButtonLoading = (isLoading) => {
  taskFormButton.disabled = isLoading;
  taskFormButton.textContent = isLoading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Task";
};

const getPayload = () => {
  return {
    title: taskForm.title.value.trim(),
    description: taskForm.description.value.trim() || null,
    status: taskForm.status.value,
    priority: taskForm.priority.value,
    category: taskForm.category.value.trim() || "General",
    dueDate: taskForm.dueDate.value || null,
  };
};

const fillForm = (task) => {
  taskForm.title.value = task.title || "";
  taskForm.description.value = task.description || "";
  taskForm.status.value = task.status || "pending";
  taskForm.priority.value = task.priority || "medium";
  taskForm.category.value = task.category || "General";
  taskForm.dueDate.value = App.toDateInputValue(task.due_date);
};

const loadTaskForEdit = async () => {
  if (mode !== "edit") {
    return;
  }

  if (!taskId) {
    App.showAlert(taskFormAlert, "danger", "Task ID is missing.");
    taskFormLoading.classList.add("d-none");
    return;
  }

  try {
    const data = await App.apiFetch(`/api/tasks/${taskId}`);
    fillForm(data.task);
    taskFormLoading.classList.add("d-none");
    taskForm.classList.remove("d-none");
  } catch (error) {
    taskFormLoading.classList.add("d-none");
    App.showAlert(taskFormAlert, "danger", error.message || "Unable to load task.");
  }
};

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  taskForm.classList.add("was-validated");

  if (!taskForm.checkValidity()) {
    return;
  }

  setButtonLoading(true);

  try {
    if (mode === "edit") {
      await App.apiFetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(getPayload()),
      });
      App.showAlert(taskFormAlert, "success", "Task updated successfully. Redirecting...");
    } else {
      await App.apiFetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(getPayload()),
      });
      App.showAlert(taskFormAlert, "success", "Task created successfully. Redirecting...");
      taskForm.reset();
      taskForm.category.value = "General";
      taskForm.status.value = "pending";
      taskForm.priority.value = "medium";
      taskForm.classList.remove("was-validated");
    }

    setTimeout(() => {
      window.location.href = "/tasks.html";
    }, 700);
  } catch (error) {
    App.showAlert(taskFormAlert, "danger", error.message || "Unable to save task.");
  } finally {
    setButtonLoading(false);
  }
});

if (mode === "edit") {
  loadTaskForEdit();
}
