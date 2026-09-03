 // =======================
// Logout Page JavaScript
// =======================

// Clear Login Data
localStorage.clear();
sessionStorage.clear();

// Login Again Button
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function () {

    alert("Redirecting to Login Page...");

    window.location.href = "login.html";

});

// Home Button
const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", function () {

    window.location.href = "Home.html";

});

// Auto Redirect after 10 Seconds
setTimeout(function () {

    window.location.href = "login.html";

}, 10000);

// Page Loaded Message
window.onload = function () {

    console.log("Logout Successful");

};
