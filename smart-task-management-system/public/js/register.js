const registerForm = document.getElementById("registerForm");
const registerButton = document.getElementById("registerButton");
const registerAlert = document.getElementById("registerAlert");
const registerButtonLabel = registerButton.querySelector(".button-label");
const registerSpinner = registerButton.querySelector(".spinner-border");

if (localStorage.getItem("authToken") || sessionStorage.getItem("authToken")) {
  window.location.href = "/dashboard.html";
}

const showAlert = (type, message) => {
  registerAlert.className = `alert alert-${type}`;
  registerAlert.textContent = message;
};

const setLoading = (isLoading) => {
  registerButton.disabled = isLoading;
  registerButtonLabel.textContent = isLoading ? "Creating account" : "Create account";
  registerSpinner.classList.toggle("d-none", !isLoading);
};

const isStrongPassword = (password) => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
};

const validatePasswordMatch = () => {
  const passwordsMatch = registerForm.password.value === registerForm.confirmPassword.value;
  registerForm.confirmPassword.setCustomValidity(passwordsMatch ? "" : "Passwords must match");
  return passwordsMatch;
};

registerForm.password.addEventListener("input", validatePasswordMatch);
registerForm.confirmPassword.addEventListener("input", validatePasswordMatch);

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  registerForm.classList.add("was-validated");
  validatePasswordMatch();

  if (!registerForm.checkValidity() || !isStrongPassword(registerForm.password.value)) {
    showAlert("danger", "Please enter valid registration details.");
    return;
  }

  setLoading(true);
  registerAlert.className = "alert d-none";

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registerForm.name.value.trim(),
        email: registerForm.email.value.trim(),
        password: registerForm.password.value,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      showAlert("danger", result.message || "Registration failed");
      return;
    }

    localStorage.setItem("authToken", result.data.token);
    localStorage.setItem("authUser", JSON.stringify(result.data.user));
    showAlert("success", "Account created successfully. Redirecting...");

    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 700);
  } catch (error) {
    showAlert("danger", "Unable to connect to the server. Please try again.");
  } finally {
    setLoading(false);
  }
});
