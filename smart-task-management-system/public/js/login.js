const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginAlert = document.getElementById("loginAlert");
const rememberMe = document.getElementById("rememberMe");
const loginButtonLabel = loginButton.querySelector(".button-label");
const loginSpinner = loginButton.querySelector(".spinner-border");

if (localStorage.getItem("authToken") || sessionStorage.getItem("authToken")) {
  window.location.href = "/dashboard.html";
}

const showAlert = (type, message) => {
  loginAlert.className = `alert alert-${type}`;
  loginAlert.textContent = message;
};

const setLoading = (isLoading) => {
  loginButton.disabled = isLoading;
  loginButtonLabel.textContent = isLoading ? "Signing in" : "Login";
  loginSpinner.classList.toggle("d-none", !isLoading);
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginForm.classList.add("was-validated");

  if (!loginForm.checkValidity()) {
    return;
  }

  setLoading(true);
  loginAlert.className = "alert d-none";

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginForm.email.value.trim(),
        password: loginForm.password.value,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      showAlert("danger", result.message || "Login failed");
      return;
    }

    const storage = rememberMe.checked ? localStorage : sessionStorage;
    storage.setItem("authToken", result.data.token);
    storage.setItem("authUser", JSON.stringify(result.data.user));
    showAlert("success", "Login successful. Redirecting...");

    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 700);
  } catch (error) {
    showAlert("danger", "Unable to connect to the server. Please try again.");
  } finally {
    setLoading(false);
  }
});
