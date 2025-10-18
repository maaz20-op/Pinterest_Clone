

document.querySelectorAll(".toggle-login").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
  });
});

function toggleForms() {
  const signup = document.getElementById('signupForm');
  const login = document.getElementById('loginForm');
  signup.classList.toggle('hidden');
  login.classList.toggle('hidden');
}


const signupForm = document.getElementById("signupForm");
  const createAccountBtn = document.getElementById("account-creation-btn");

  signupForm.addEventListener("submit", function () {
    createAccountBtn.disabled = true;
    createAccountBtn.innerText = "Creating...";
  });