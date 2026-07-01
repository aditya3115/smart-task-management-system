App.requireAuth();
App.bindLogout();

const profileAlert = document.getElementById("profileAlert");
const profileLoading = document.getElementById("profileLoading");
const profileContent = document.getElementById("profileContent");
const profileInitials = document.getElementById("profileInitials");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileRole = document.getElementById("profileRole");
const profileCreated = document.getElementById("profileCreated");
const profileLogoutButton = document.getElementById("profileLogoutButton");

const getInitials = (name) => {
  return String(name || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const showAlert = (type, message) => {
  App.showAlert(profileAlert, type, message);
};

const loadProfile = async () => {
  try {
    const data = await App.apiFetch("/api/auth/profile");
    const user = data.user;

    profileInitials.textContent = getInitials(user.name);
    profileName.textContent = user.name;
    profileEmail.textContent = user.email;
    profileRole.textContent = App.formatLabel(user.role);
    profileCreated.textContent = App.formatDate(user.created_at);

    localStorage.setItem("authUser", JSON.stringify(user));
    profileLoading.classList.add("d-none");
    profileContent.classList.remove("d-none");
  } catch (error) {
    profileLoading.classList.add("d-none");
    showAlert("danger", error.message || "Unable to load profile.");
  }
};

profileLogoutButton.addEventListener("click", App.logout);
loadProfile();
