// ==========================
// HR Interview Questions JS
// ==========================

// Card Counter Animation
const cards = document.querySelectorAll(".card h2");
const values = [250, 10, 0, 0];

cards.forEach((card, index) => {

    let count = 0;

    let interval = setInterval(() => {

        if (count >= values[index]) {

            clearInterval(interval);

            if (index === 3) {
                card.innerHTML = values[index] + "%";
            }

        } else {

            count++;

            if (index === 3) {
                card.innerHTML = count + "%";
            } else {
                card.innerHTML = count;
            }

        }

    }, 10);

});


// ==========================
// Category Click
// ==========================

const categories = document.querySelectorAll(".category");

categories.forEach(category => {

    category.addEventListener("click", function () {

        const name = this.querySelector("h3").innerText;

        console.log(name + " Category Opened");

    });

});


// ==========================
// Recent Question Click
// ==========================

const questions = document.querySelectorAll(".question");

questions.forEach(question => {

    question.addEventListener("click", function () {

        window.location.href = "Mock Interview.html";

    });

});


// ==========================
// Arrow Hover Effect
// ==========================

const arrows = document.querySelectorAll(".question i");

arrows.forEach(arrow => {

    arrow.addEventListener("mouseover", function () {

        this.style.color = "#2563eb";

    });

    arrow.addEventListener("mouseout", function () {

        this.style.color = "#666";

    });

});


// ==========================
// View All Categories
// ==========================

const viewAll = document.querySelector(".heading a");

viewAll.addEventListener("click", function (e) {

    e.preventDefault();

    alert("All Categories Coming Soon!");

});


// ==========================
// Navbar Buttons
// ==========================

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        navLinks.forEach(item => item.classList.remove("active"));

        this.classList.add("active");

    });

});


// ==========================
// Profile Button
// ==========================

const profile = document.querySelector(".profile");

profile.addEventListener("click", function () {

    alert("Opening Profile...");

    // window.location.href = "profile.html";

});


// ==========================
// Welcome Message
// ==========================

window.onload = function () {

    console.log("HR Interview Questions Loaded Successfully");

};

