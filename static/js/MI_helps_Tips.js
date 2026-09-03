// Wait until page loads
document.addEventListener("DOMContentLoaded", function () {

    // Learn More Button
    const learnBtn = document.querySelector(".green-btn");
    if (learnBtn) {
        learnBtn.addEventListener("click", function () {
            alert("Getting Started Guide\n\n1. Select your interview role.\n2. Choose difficulty level.\n3. Click Start Interview.");
        });
    }

    // View Tips Button
    const tipsBtn = document.querySelector(".blue-btn");
    if (tipsBtn) {
        tipsBtn.addEventListener("click", function () {
            alert("Interview Tips\n\n• Allow microphone access.\n• Speak clearly.\n• Answer confidently.\n• Manage your time.");
        });
    }

    // Best Practices Button
    const bestBtn = document.querySelector(".purple-btn");
    if (bestBtn) {
        bestBtn.addEventListener("click", function () {
            alert("Best Practices\n\n• Keep your resume updated.\n• Give real examples.\n• Maintain eye contact.\n• Complete the interview.");
        });
    }

    // Resource Buttons
    const resourceButtons = document.querySelectorAll(".resource button");

    resourceButtons.forEach(function (button) {
        button.addEventListener("click", function () {

            const text = this.innerText;

            if (text.includes("Watch")) {
                alert("Opening Tutorial Video...");
            }
            else if (text.includes("Read")) {
                alert("Opening Documentation...");
            }
            else if (text.includes("Try")) {
                window.location.href = "Mock Interview.html";
            }
            else if (text.includes("Explore")) {
                alert("Loading Interview Tips...");
            }

        });
    });

    // Back Button
    const backBtn = document.querySelector(".back");
    if (backBtn) {
        backBtn.addEventListener("click", function () {
            window.location.href = "Dashboard.html";
        });
    }

    // Live Chat
    const supports = document.querySelectorAll(".support");

    supports.forEach(function (item) {
        item.addEventListener("click", function () {

            const title = item.querySelector("h3").innerText;

            if (title === "Email Support") {
                window.location.href = "mailto:support@mockinterview.com";
            }
            else if (title === "Live Chat") {
                alert("Live Chat feature will be available soon.");
            }
            else if (title === "User Guide") {
                alert("Opening User Guide...");
            }

        });
    });

});