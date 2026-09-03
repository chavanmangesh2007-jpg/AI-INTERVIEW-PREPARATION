   // Questions
const questions = [
    "Explain the difference between Array and Linked List.",
    "What is Object Oriented Programming?",
    "What is a Stack?",
    "What is a Queue?",
    "Explain Polymorphism.",
    "Difference between HTML and HTML5?",
    "What is CSS Flexbox?",
    "Explain JavaScript Closures.",
    "What is SQL JOIN?",
    "Tell me about yourself."
];

let currentQuestion = 0;

// HTML Elements
const question = document.querySelector(".card h2");
const questionNo = document.querySelector(".top span");
const progress = document.querySelector(".inner h2");
const progressCircle = document.querySelector(".circle");
const timer = document.querySelector(".timer");
const mic = document.querySelector(".mic");
const listen = document.querySelector(".listen");
const aiText = document.querySelector(".robot").nextElementSibling;
const nextBtn = document.querySelector(".next");
const endBtn = document.querySelector(".end");

// ---------------- Timer ----------------

let minute = 2;
let second = 45;

function updateTimer() {

    timer.innerHTML =
        `${String(minute).padStart(2,"0")}:${String(second).padStart(2,"0")}`;

    if (minute === 0 && second === 0) {
        return;
    }

    if (second === 0) {
        minute--;
        second = 59;
    } else {
        second--;
    }
}

setInterval(updateTimer,1000);

// ---------------- Mic ----------------

let recording = true;

mic.addEventListener("click",function(){

    if(recording){

        recording = false;

        mic.style.background = "red";

        listen.innerHTML = "Recording Stopped";

        aiText.innerHTML = "Answer Saved Successfully.";

    }

    else{

        recording = true;

        mic.style.background = "#6a4cff";

        listen.innerHTML = "Listening...";

        aiText.innerHTML = "I'm listening to your answer...";
    }

});

// ---------------- Next Question ----------------

nextBtn.addEventListener("click",function(){

    currentQuestion++;

    if(currentQuestion >= questions.length){

        alert("🎉 Interview Completed!");

        currentQuestion = questions.length-1;

        return;
    }

    question.innerHTML = questions[currentQuestion];

    questionNo.innerHTML =
    `${currentQuestion+1} / ${questions.length}`;

    let percentage =
    Math.round(((currentQuestion+1)/questions.length)*100);

    progress.innerHTML = percentage + "%";

    progressCircle.style.background =
    `conic-gradient(#6a4cff ${percentage*3.6}deg,#ececf6 0deg)`;

    // Reset Timer
    minute = 2;
    second = 45;

});

// ---------------- End Interview ----------------

endBtn.addEventListener("click",function(){

    let ans = confirm("Do you want to end the interview?");

    if(ans){

        alert("Interview Ended Successfully.");

        window.location.href="Mock Interview.html";
    }

});