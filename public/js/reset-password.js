const resetPasswordForm = document.getElementById("resetPasswordForm");
const resetPasswordButton = document.getElementById("resetPasswordButton");
const resetPasswordAlert = document.getElementById("resetPasswordAlert");
const resetPasswordButtonLabel = resetPasswordButton.querySelector(".button-label");
const resetPasswordSpinner = resetPasswordButton.querySelector(".spinner-border");
const tokenInput = document.getElementById("token");

const showAlert = (type, message) => {
  resetPasswordAlert.className = `alert alert-${type}`;
  resetPasswordAlert.textContent = message;
};

const setLoading = (isLoading) => {
  resetPasswordButton.disabled = isLoading;
  resetPasswordButtonLabel.textContent = isLoading ? "Resetting" : "Reset password";
  resetPasswordSpinner.classList.toggle("d-none", !isLoading);
};

const getQueryParam = (name) => {
  return new URLSearchParams(window.location.search).get(name) || "";
};

const initialize = () => {
  tokenInput.value = getQueryParam("token");
};

resetPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  resetPasswordForm.classList.add("was-validated");

  if (!resetPasswordForm.checkValidity()) {
    return;
  }

  setLoading(true);
  resetPasswordAlert.className = "alert d-none";

  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: tokenInput.value,
        password: resetPasswordForm.password.value,
        confirmPassword: resetPasswordForm.confirmPassword.value,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      showAlert("danger", result.message || "Unable to reset password.");
      return;
    }

    showAlert("success", result.message);
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1500);
  } catch (error) {
    showAlert("danger", "Unable to connect to the server. Please try again.");
  } finally {
    setLoading(false);
  }
});

initialize();
