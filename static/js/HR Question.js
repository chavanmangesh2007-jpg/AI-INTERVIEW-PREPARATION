  // ---------------------------
// HR Interview Dashboard JS
// ---------------------------

document.addEventListener("DOMContentLoaded", () => {

    // Stats
    let savedCount = 0;
    let progress = 0;

    const savedText = document.querySelectorAll(".card h2")[2];
    const progressText = document.querySelectorAll(".card h2")[3];

    // ---------------------------
    // Category Click Animation
    // ---------------------------
    const categories = document.querySelectorAll(".category");

    categories.forEach(category => {

        category.addEventListener("click", function () {

            this.style.transform = "scale(0.95)";

            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 150);

        });

    });

    // ---------------------------
    // Recent Question Click
    // ---------------------------

    const questions = document.querySelectorAll(".question");

    questions.forEach((question, index) => {

        question.style.cursor = "pointer";

        question.addEventListener("click", () => {

            const title = question.querySelector("h3").innerText;

            progress += 5;

            if (progress > 100)
                progress = 100;

            progressText.innerText = progress + "%";

            alert(title + "\n\nQuestion page will open here.");

        });

    });

    // ---------------------------
    // Bookmark Feature
    // ---------------------------

    const arrows = document.querySelectorAll(".question i");

    arrows.forEach(icon => {

        icon.addEventListener("dblclick", function (e) {

            e.stopPropagation();

            if (!this.classList.contains("saved")) {

                this.classList.add("saved");
                this.style.color = "#2563eb";

                savedCount++;
                savedText.innerText = savedCount;

                alert("Question Saved!");

            }

        });

    });

    // ---------------------------
    // View All Categories
    // ---------------------------

    const viewAll = document.querySelector(".heading a");

    viewAll.addEventListener("click", function (e) {

        e.preventDefault();

        alert("All Categories page will open here.");

    });

    // ---------------------------
    // Counter Animation
    // ---------------------------

    function animateCounter(element, target) {

        let count = 0;

        const speed = target / 50;

        const timer = setInterval(() => {

            count += speed;

            if (count >= target) {
                count = target;
                clearInterval(timer);
            }

            element.innerText = Math.floor(count);

        }, 20);

    }

    animateCounter(document.querySelectorAll(".card h2")[0], 250);
    animateCounter(document.querySelectorAll(".card h2")[1], 10);

});