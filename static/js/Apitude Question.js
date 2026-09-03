// ===============================
// Countdown Timer
// ===============================

let minutes = 100;
let seconds = 0;

const timer = document.getElementById("time");

const countdown = setInterval(() => {

    if (seconds === 0) {

        if (minutes === 0) {
            clearInterval(countdown);
            alert("Interview Time Finished!");
            return;
        }

        minutes--;
        seconds = 59;

    } else {
        seconds--;
    }

    let m = minutes.toString().padStart(2, "0");
    let s = seconds.toString().padStart(2, "0");

    timer.innerHTML = `${m}:${s}`;

}, 1000);


// ===============================
// Speech Recognition
// ===============================

const textarea = document.querySelector("textarea");
const listenBtn = document.querySelector(".listen-btn");
const status = document.querySelector(".listen");
const wordCount = document.querySelector(".word");

let recognition;

if ('webkitSpeechRecognition' in window) {

    recognition = new webkitSpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {

        listenBtn.innerHTML =
            '<i class="fa-solid fa-microphone"></i> Listening...';

        status.innerHTML =
            '<i class="fa-solid fa-circle"></i> Listening...';

    };

    recognition.onresult = (event) => {

        let transcript = "";

        for (let i = 0; i < event.results.length; i++) {

            transcript += event.results[i][0].transcript;

        }

        textarea.value = transcript;

        let words = transcript.trim().split(/\s+/);

        if (transcript.trim() == "") {
            wordCount.innerHTML = "Words : 0";
        } else {
            wordCount.innerHTML =
                "Words : " + words.length;
        }

    };

    recognition.onend = () => {

        listenBtn.innerHTML =
            '<i class="fa-solid fa-microphone"></i> Start Listening';

        status.innerHTML =
            '<i class="fa-solid fa-circle"></i> Microphone Off';

    };

}

listenBtn.addEventListener("click", () => {

    if (recognition) {
        if (listenBtn.innerText.includes("Listening...")) {
            recognition.stop();
        } else {
            try { recognition.start(); } catch (e) { }
        }
    } else {
        alert("Speech Recognition is not supported in this browser.");
    }

});


// ===============================
// Questions
// ===============================

const questions = [
    "What is the next even number after 100?",
    "If a book costs ₹250 after a 50% discount, what was its original price?",
    "What is the probability of getting a head when tossing a coin?",
    "What is the probability of rolling a 6 on a fair die?",
    "What is the next number: 5, 10, 20, 40, ?",
    "What is 125% of 80?",
    "What is the value of 13²?",
    "What is the cube root of 125?",
    "What is the average of the first five natural numbers?",
    "If 20% of a number is 40, what is the number?",
    "What is the perimeter of a square with side 12 cm?",
    "What is the area of a rectangle of length 15 cm and width 6 cm?",
    "What is 17 × 19?",
    "What is 625 ÷ 25?",
    "What is the next alphabet: A, C, E, G, ?",
    "What is the opposite of 'Expand'?",
    "What is the synonym of 'Brave'?",
    "What is the antonym of 'Ancient'?",
    "Which number is divisible by both 2 and 3?",
    "What is 11 × 11?",
    "What is 13 × 13?",
    "What is 15 × 15?",
    "What is 16 × 16?",
    "What is the value of 1000 - 567?",
    "What is 75% of 120?",
    "What is 90% of 90?",
    "What is 45 + 67?",
    "What is 123 - 56?",
    "What is 48 × 5?",
    "What is 720 ÷ 9?",
    "What is the next number: 100, 90, 80, 70, ?",
    "What is the value of π (approximately)?",
    "What is the circumference formula of a circle?",
    "What is the area formula of a circle?",
    "What is the SI unit of speed?",
    "What is the SI unit of force?",
    "What is the capital of India?",
    "Which planet is known as the Red Planet?",
    "What is the boiling point of water in Celsius?",
    "What is the freezing point of water in Celsius?",
    "What is the largest continent?",
    "What is the longest river in the world?",
    "How many days are there in a leap year?",
    "How many months have 31 days?",
    "What is the value of 2⁵?",
    "What is the value of 5⁴?",
    "What is the next number: 3, 9, 27, 81, ?",
    "What is 18% of 500?",
    "What is the HCF of 18 and 24?",
    "What is the LCM of 15 and 20?",
    "What is the average of 12, 18, 24, 30?",
    "If a train is 200 m long and crosses a pole in 20 seconds, what is its speed?",
    "If 8 men complete a job in 15 days, how long will 12 men take?",
    "What is the profit on selling an item for ₹800 that cost ₹640?",
    "What is the loss percentage if CP = ₹500 and SP = ₹450?",
    "What is 5/8 of 160?",
    "What is 9/10 of 500?",
    "What is the square root of 225?",
    "What is the square root of 256?",
    "What is the cube of 8?",
    "What is the cube root of 512?",
    "What is the next letter: Z, X, V, T, ?",
    "What is the synonym of 'Happy'?",
    "What is the antonym of 'Victory'?",
    "What is 14 × 14?",
    "What is 19 × 19?",
    "What is 20 × 20?",
    "What is 250 + 375?",
    "What is 1000 - 245?",
    "What is 864 ÷ 12?",
    "What is 18 × 25?",
    "What is 5% of ₹2000?",
    "What is 12.5% of 160?",
    "What is the ratio of 20 to 25?",
    "Simplify: 2 + 3 × 4?",
    "Simplify: (8 + 4) ÷ 2?",
    "What is the decimal value of 3/8?",
    "What is the fraction form of 0.75?",
    "What is the next number: 2, 6, 12, 20, ?",
    "What is the sum of the first 10 natural numbers?",
    "What is the product of the first five natural numbers?",
    "What is the smallest three-digit number?",
    "What is the largest three-digit number?",
    "What is the Roman numeral for 50?",
    "What is the Roman numeral for 100?",
    "What is the Roman numeral for 500?",
    "What is the Roman numeral for 1000?",
    "What is 33% of 300?",
    "What is 66% of 150?",
    "What is 7² + 3²?",
    "What is 15² - 10²?",
    "What is the average of 50, 60, 70?",
    "What is the next number: 7, 14, 28, 56, ?",
    "What is the value of 1! (factorial)?",
    "What is the value of 5! (factorial)?",
    "What is the value of 6! (factorial)?",
    "What is the percentage of 45 out of 60?",
    "What is the percentage of 72 out of 90?",
    "What is 1/3 of 99?",
    "What is 2/5 of 250?",
    "What is the next number: 11, 22, 44, 88, ?",
    "What is the next alphabet: B, D, F, H, ?",
    "What is the opposite of 'Generous'?",
    "What is the synonym of 'Quick'?",
    "What is 18 × 18?",
    "What is 21 × 21?",
    "What is 22 × 22?",
    "What is 24 × 24?",
    "What is 900 ÷ 30?",
    "What is 450 ÷ 15?",
    "What is 96 ÷ 8?",
    "What is 144 ÷ 9?",
    "What is the value of 99 × 9?",
    "What is 50% of 50?",
    "What is 10% of 350?",
    "What is 35% of 200?",
    "What is the next number: 4, 9, 16, 25, ?",
    "What is the square root of 400?",
    "What is the cube root of 729?",
    "What is the value of 8³?",
    "What is the perimeter of a triangle with sides 5 cm, 6 cm, and 7 cm?",
    "What is the area of a triangle with base 10 cm and height 8 cm?",
    "What is the formula for simple interest?",
    "What is the formula for compound interest?",
    "What is the formula for speed?",
    "What is the formula for distance?",
    "What is the formula for time?",
    "What is the next number: 13, 26, 39, 52, ?",
    "What is the average of 5, 10, 15, 20, 25?",
    "What is 80% of 250?",
    "What is 95% of 200?",
    "What is 27 × 11?",
    "What is 36 × 12?",
    "What is 625 ÷ 5?",
    "What is 784 ÷ 28?",
    "What is the smallest even prime number?",
    "What is the next prime number after 47?",
    "What is the value of 12³?",
    "What is the value of 15³?",
    "What is the square root of 324?",
    "What is the square root of 625?",
    "What is the cube root of 343?",
    "What is 1% of ₹5000?",
    "What is 2.5% of 400?",
    "What is the next number: 1, 4, 9, 16, 25, ?",
    "What is the sum of interior angles of a triangle?",
    "What is the sum of interior angles of a quadrilateral?",
    "What is the SI unit of work?",
    "What is the SI unit of energy?",
    "What is the SI unit of power?",
    "What is the SI unit of current?",
    "What is the SI unit of voltage?",
    "What is the SI unit of resistance?",
    "What is the speed of light approximately?",
    "What is the acceleration due to gravity on Earth?"
];

let current = 0;

const nextBtn = document.querySelector(".next");

const question = document.querySelector(".question-box h2");

nextBtn.addEventListener("click", () => {

    if (textarea.value.trim() === "") {
        alert("Please attempt this question before moving to the next one.");
        return;
    }

    submitAnswerToBackend(false);

    current++;

    if (current >= questions.length) {

        alert("Interview Completed!");

        current = questions.length - 1;

        return;

    }

    question.innerHTML =
        `<span>${current + 1}.</span> ${questions[current]}`;

    textarea.value = "";

    wordCount.innerHTML = "Words : 0";

});


// ===============================
// End Interview
// ===============================

const endBtn = document.querySelector(".end");

endBtn.addEventListener("click", () => {

    let ok = confirm("Do you really want to end the interview?");

    if (ok) {

        clearInterval(countdown);

        if (recognition) {
            recognition.stop();
        }

        submitAnswerToBackend(true);

        alert("Interview Ended Successfully. Redirecting to Results...");

        if (sessionId) {
            window.location.href = "/practice/";
        } else {
            window.location.href = "/practice/";
        }

    }

});


// ===============================
// Close Tips
// ===============================

const close = document.querySelector(".close");
const tips = document.querySelector(".tips");

close.addEventListener("click", () => {

    tips.style.display = "none";

});
// ===============================
// Camera Access
// ===============================

// ===============================
// Camera Access
// ===============================

const camera = document.getElementById("camera");




// Start Camera
async function startCamera() {

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        camera.srcObject = stream;

    }
    catch (error) {

        alert("Please allow Camera and Microphone Permission.");
        console.log(error);

    }

}


// Stop Camera + Mic
function stopCamera() {

    if (stream) {

        stream.getTracks().forEach(track => {

            track.stop();

        });

        stream = null;
        camera.srcObject = null;

    }

}


// Camera start when page loads
window.addEventListener("load", () => {

    startCamera();

});


// Stop camera when leaving page
window.addEventListener("beforeunload", () => {

    stopCamera();

});


// Stop camera when back button clicked
// (Handled by HTML)


// Stop camera when End Interview clicked
document.querySelector(".end").addEventListener("click", () => {

    stopCamera();

});

// Page Open झाल्यावर Camera Start होईल
window.onload = () => {
    startCamera();
};
// Camera Stop

if (camera.srcObject) {

    camera.srcObject.getTracks().forEach(track => {
        track.stop();
    });

}

const cameraBtn = document.getElementById("cameraBtn");
const micBtn = document.getElementById("micBtn");

let stream;

// startCamera() मध्ये
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        camera.srcObject = stream;

    } catch (err) {
        console.log(err);
    }
}

// Camera ON/OFF
cameraBtn.addEventListener("click", () => {

    const videoTrack = stream.getVideoTracks()[0];

    videoTrack.enabled = !videoTrack.enabled;

    if (videoTrack.enabled) {
        cameraBtn.innerHTML = '<i class="fa-solid fa-video"></i> Camera OFF';
    } else {
        cameraBtn.innerHTML = '<i class="fa-solid fa-video-slash"></i> Camera ON';
    }

});

// ===============================
// Mic Button + Speech To Text
// ===============================

// ===============================
// Mic Button
// ===============================

let micActive = true;

const micStatus = document.getElementById("micStatus");
const micIcon = document.getElementById("micIcon");
const wave = document.getElementById("wave");


micBtn.addEventListener("click", () => {

    if (!stream) return;


    const audioTrack = stream.getAudioTracks()[0];

    audioTrack.enabled = !audioTrack.enabled;


    if (audioTrack.enabled) {

        micActive = true;


        // Button
        micBtn.innerHTML =
            '<i class="fa-solid fa-microphone"></i> Mic ON';


        // Status Card
        micStatus.innerHTML = "Microphone is ON";

        micIcon.className = "fa-solid fa-microphone";

        wave.style.display = "flex";


        // Start Speech Recognition
        if (recognition) {
            try { recognition.start(); } catch (e) { }
        }

    }
    else {


        micActive = false;


        // Button
        micBtn.innerHTML =
            '<i class="fa-solid fa-microphone-slash"></i> Mic OFF';


        // Status Card
        micStatus.innerHTML = "Microphone is OFF";

        micIcon.className = "fa-solid fa-microphone-slash";


        // Hide wave animation
        wave.style.display = "none";


        // Stop Speech Recognition
        if (recognition) {
            recognition.stop();
        }

    }

});


recognition.onresult = (event) => {

    let finalText = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {

        if (event.results[i].isFinal) {

            finalText += event.results[i][0].transcript;

        }

    }


    if (finalText !== "") {

        textarea.value += finalText + " ";

    }


    // Remove duplicate words
    let words = textarea.value
        .trim()
        .split(/\s+/);


    let uniqueWords = [];

    words.forEach(word => {

        if (uniqueWords[uniqueWords.length - 1] !== word) {

            uniqueWords.push(word);

        }

    });


    textarea.value = uniqueWords.join(" ");


    wordCount.innerHTML =
        "Words : " + uniqueWords.length;

};
// ===============================
// Speak Current Question
// ===============================

const speakBtn = document.getElementById("speakQuestion");

function speakQuestion() {

    // Stop previous speech
    window.speechSynthesis.cancel();

    // Get current question text
    const text = questions[current];

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";     // English
    speech.rate = 0.9;         // Speed
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}

// Speaker icon click
speakBtn.addEventListener("click", speakQuestion);

// Automatically read next question
nextBtn.addEventListener("click", () => {
    setTimeout(speakQuestion, 500);
    // Reset save icon if it was solid
    const saveBtn = document.getElementById("saveQuestion");
    if (saveBtn) {
        saveBtn.classList.remove('fa-solid');
        saveBtn.classList.add('fa-regular');
    }
});

// ===============================
// Save Current Question
// ===============================
const saveBtn = document.getElementById("saveQuestion");
if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        const text = questions[current];
        fetch("/api/toggle-save-question/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": getCookie("csrftoken") || ""
            },
            body: `title=${encodeURIComponent(text)}&category=${encodeURIComponent(topicName)}`
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'saved') {
                    saveBtn.classList.remove('fa-regular');
                    saveBtn.classList.add('fa-solid');
                } else if (data.status === 'removed') {
                    saveBtn.classList.remove('fa-solid');
                    saveBtn.classList.add('fa-regular');
                }
            })
            .catch(err => console.error(err));
    });
}

// ===============================
// Backend Integration
// ===============================

let sessionId = null;
const topicName = "Aptitude Questions";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const existingSessionId = urlParams.get('session_id');

    if (existingSessionId) {
        sessionId = existingSessionId;
        fetch(`/api/tq/session-status/${sessionId}/`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.answered_count !== undefined) {
                    current = data.answered_count;
                    if (current >= questions.length) {
                        current = questions.length - 1;
                    }
                    const questionElement = document.querySelector(".question-box h2");
                    if (questionElement) {
                        questionElement.innerHTML = `<span>${current + 1}.</span> ${questions[current]}`;
                    }
                }
            })
            .catch(err => console.error(err));
    } else {
        fetch("/api/tq/start/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken") || ""
            },
            body: JSON.stringify({ topic: topicName })
        })
            .then(res => res.json())
            .then(data => {
                if (data.session_id) sessionId = data.session_id;
            })
            .catch(err => console.error(err));
    }
});

function submitAnswerToBackend(isFinal = false) {
    if (!sessionId) return;

    let answerText = textarea.value.trim();
    let currentQuestion = questions[current];

    if (answerText === "") return;

    fetch("/api/tq/evaluate/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken") || ""
        },
        body: JSON.stringify({
            session_id: sessionId,
            question_text: currentQuestion,
            user_answer: answerText,
            is_final: isFinal
        })
    }).catch(err => console.error(err));
}
