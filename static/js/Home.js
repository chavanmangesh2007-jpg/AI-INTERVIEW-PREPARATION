// ===============================
// AI Interview Preparation Assistant
// script.js
// ===============================

// Welcome Message
window.addEventListener("load", () => {
    console.log("Welcome to AI Interview Preparation Assistant");
});

// ===============================
// Start Mock Interview Button
// ===============================

const startBtn = document.querySelector(".start1");

if (startBtn) {
    startBtn.addEventListener("click", function () {
        alert("Starting Mock Interview...");
        window.location.href = "Mock Interview.html";
    });
}

// ===============================
// Upload Resume Button
// ===============================

const resumeFile = document.getElementById("resumeFile");
const fileName = document.getElementById("fileName");

if (resumeFile) {

    resumeFile.addEventListener("change", function () {

        if (this.files.length > 0) {

            const file = this.files[0];

            fileName.textContent = file.name;

            alert("Resume uploaded successfully!");

            console.log("Selected File:", file.name);

        } else {

            fileName.textContent = "Upload Resume";

        }

    });

}



// ===============================
// Counter Animation
// ===============================

function animateCounter(element, target, suffix = "") {

    let count = 0;

    const speed = target / 100;

    const timer = setInterval(() => {

        count += speed;

        if (count >= target) {
            count = target;
            clearInterval(timer);
        }

        element.innerHTML = Math.floor(count) + suffix;

    }, 20);

}

const numbers = document.querySelectorAll(".stat-box h2");

if (numbers.length >= 4) {

    animateCounter(numbers[0], 10, "K+");
    animateCounter(numbers[1], 25, "K+");
    animateCounter(numbers[2], 95, "%");
    animateCounter(numbers[3], 5, "/5");

}

// ===============================
// Smooth Scroll
// ===============================

document.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", function () {

        console.log("Opening:", this.getAttribute("href"));

    });

});

// ===============================
// Greeting
// ===============================

const hour = new Date().getHours();

if (hour < 12) {
    console.log("Good Morning");
}
else if (hour < 18) {
    console.log("Good Afternoon");
}
else {
    console.log("Good Evening");
}