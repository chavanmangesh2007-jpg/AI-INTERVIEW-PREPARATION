// Get Elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const togglePassword = document.getElementById("togglePassword");

// Show / Hide Password
togglePassword.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    }

});

// Login Button
loginBtn.addEventListener("click", function (e) {

    e.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (emailValue === "") {
        alert("Please enter your email.");
        email.focus();
        return;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!emailPattern.test(emailValue)) {
        alert("Please enter a valid email.");
        return;
    }

    if (passwordValue === "") {
        alert("Please enter your password.");
        password.focus();
        return;
    }

    if (passwordValue.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    // Save Login
    localStorage.setItem("userEmail", emailValue);

    alert("Login Successful!");

    window.location.href = "Home.html";

});

// Forgot Password
document.querySelector(".forgot").addEventListener("click", function (e) {

    e.preventDefault();

    alert("Forgot Password feature coming soon!");

});

// Google Button
document.querySelectorAll(".social")[0].addEventListener("click", function () {

    alert("Google Login Coming Soon!");

});

// GitHub Button
document.querySelectorAll(".social")[1].addEventListener("click", function () {

    alert("GitHub Login Coming Soon!");

});

