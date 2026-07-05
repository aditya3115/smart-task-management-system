App.requireAuth();
App.bindLogout();

const dashboardAlert = document.getElementById("dashboardAlert");
const totalTasksEl = document.getElementById("totalTasks");
const pendingTasksEl = document.getElementById("pendingTasks");
const completedTasksEl = document.getElementById("completedTasks");
const overdueTasksEl = document.getElementById("overdueTasks");
const recentTasksContainer = document.getElementById("recentTasks");
const recentTasksEmpty = document.getElementById("recentTasksEmpty");
const dueSoonList = document.getElementById("dueSoonList");
const upcomingEventsCount = document.getElementById("upcomingEventsCount");

const formatStatus = (status) => App.formatLabel(status);

const renderTaskItem = (task) => {
  return `
    <article class="recent-task-item">
      <strong>${App.escapeHtml(task.title)}</strong>
      <div class="due-soon-meta">
        <span>${App.formatLabel(task.priority)} priority</span>
        <span>${App.escapeHtml(task.category || "General")}</span>
        <span>${App.formatDate(task.due_date)}</span>
      </div>
      <p class="text-secondary mb-0">${App.escapeHtml(task.description || "No details provided.")}</p>
    </article>
  `;
};

const renderDueSoonItem = (task) => {
  return `
    <article class="due-soon-item">
      <strong>${App.escapeHtml(task.title)}</strong>
      <div class="due-soon-meta">
        <span>${App.formatLabel(task.status)}</span>
        <span>${App.formatDate(task.due_date)}</span>
      </div>
    </article>
  `;
};

const showAlert = (type, message) => {
  App.showAlert(dashboardAlert, type, message);
};

const loadDashboard = async () => {
  try {
    const [taskData, eventData] = await Promise.all([
      App.apiFetch("/api/tasks?sortBy=createdAt&sortOrder=desc"),
      App.apiFetch("/api/events?sortBy=eventDate&sortOrder=asc"),
    ]);

    const tasks = taskData.tasks || [];
    const events = eventData.events || [];
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter((task) => task.status === "pending" || task.status === "in_progress").length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const overdueTasks = tasks.filter((task) => task.due_date && new Date(task.due_date) < today && task.status !== "completed").length;
    const dueSoonTasks = tasks
      .filter((task) => task.due_date && new Date(task.due_date) >= today && new Date(task.due_date) <= nextWeek)
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 4);
    const recentTasks = tasks.slice(0, 5);
    const upcomingEvents = events.filter((event) => event.event_date && new Date(event.event_date) >= today).slice(0, 5);

    totalTasksEl.textContent = totalTasks;
    pendingTasksEl.textContent = pendingTasks;
    completedTasksEl.textContent = completedTasks;
    overdueTasksEl.textContent = overdueTasks;
    upcomingEventsCount.textContent = upcomingEvents.length;

    if (recentTasks.length === 0) {
      recentTasksEmpty.classList.remove("d-none");
      return;
    }

    recentTasksEmpty.classList.add("d-none");
    recentTasksContainer.innerHTML = recentTasks.map(renderTaskItem).join("");
    dueSoonList.innerHTML = dueSoonTasks.length
      ? dueSoonTasks.map(renderDueSoonItem).join("")
      : `<div class="due-soon-item"><p class="mb-0 text-secondary">No tasks due in the next 7 days.</p></div>`;
  } catch (error) {
    showAlert("danger", error.message || "Unable to load dashboard data.");
  }
};

loadDashboard();
