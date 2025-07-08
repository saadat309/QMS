import { showModal, handleError } from "/utils.js";

const submitBtn = document.getElementById("submitBtn");
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/admins/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();

      // Save admin data in sessionStorage
      sessionStorage.setItem("admin", JSON.stringify(data.admin));

      // Redirect to dashboard
      window.location.href = "/index.html";

      console.log("login Success", data);
    }
  } catch (err) {
    handleError(err, "cant submit, Server side error");
  }
});

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

togglePassword.addEventListener("click", function () {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  eyeIcon.classList.toggle("fa-eye");
  eyeIcon.classList.toggle("fa-eye-slash");
});
