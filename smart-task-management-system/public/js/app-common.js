const App = (() => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  const getToken = () => token;

  const requireAuth = () => {
    if (!token) {
      window.location.href = "/login.html";
    }
  };

  const clearSession = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");
  };

  const apiFetch = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Request failed");
    }

    return result.data;
  };

  const logout = async () => {
    try {
      if (token) {
        await apiFetch("/api/auth/logout", { method: "POST" });
      }
    } catch (error) {
      // Local logout should still work if the confirmation endpoint fails.
    } finally {
      clearSession();
      window.location.href = "/login.html";
    }
  };

  const bindLogout = () => {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", logout);
    }
  };

  const showAlert = (element, type, message) => {
    element.className = `alert alert-${type}`;
    element.textContent = message;
  };

  const formatLabel = (value) => {
    return String(value || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (value) => {
    if (!value) {
      return "No due date";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  };

  const toDateInputValue = (value) => {
    if (!value) {
      return "";
    }

    return new Date(value).toISOString().slice(0, 10);
  };

  const escapeHtml = (value) => {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const statusClass = (status) => {
    return `badge-status-${String(status).replace(/_/g, "-")}`;
  };

  const priorityClass = (priority) => {
    return `badge-priority-${priority}`;
  };

  return {
    getToken,
    requireAuth,
    clearSession,
    apiFetch,
    logout,
    bindLogout,
    showAlert,
    formatLabel,
    formatDate,
    toDateInputValue,
    escapeHtml,
    statusClass,
    priorityClass,
  };
})();
