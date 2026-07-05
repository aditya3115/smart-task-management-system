const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotPasswordButton = document.getElementById("forgotPasswordButton");
const forgotPasswordAlert = document.getElementById("forgotPasswordAlert");
const forgotPasswordButtonLabel = forgotPasswordButton.querySelector(".button-label");
const forgotPasswordSpinner = forgotPasswordButton.querySelector(".spinner-border");

const showAlert = (type, message) => {
  forgotPasswordAlert.className = `alert alert-${type}`;
  forgotPasswordAlert.textContent = message;
};

const setLoading = (isLoading) => {
  forgotPasswordButton.disabled = isLoading;
  forgotPasswordButtonLabel.textContent = isLoading ? "Sending" : "Send reset link";
  forgotPasswordSpinner.classList.toggle("d-none", !isLoading);
};

forgotPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  forgotPasswordForm.classList.add("was-validated");

  if (!forgotPasswordForm.checkValidity()) {
    return;
  }

  setLoading(true);
  forgotPasswordAlert.className = "alert d-none";

  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: forgotPasswordForm.email.value.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      showAlert("danger", result.message || "Unable to send reset instructions.");
      return;
    }

    showAlert("success", result.message);
  } catch (error) {
    showAlert("danger", "Unable to connect to the server. Please try again.");
  } finally {
    setLoading(false);
  }
});
