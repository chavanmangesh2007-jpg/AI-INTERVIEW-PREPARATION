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
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths?",
    "What are your weaknesses?",
    "Why do you want this job?",
    "Why do you want to join our company?",
    "What do you know about our company?",
    "Where do you see yourself in five years?",
    "What motivates you?",
    "What is your greatest achievement?",
    "Describe a challenging situation you faced.",
    "Tell me about a time you worked in a team.",
    "Describe a conflict you resolved.",
    "How do you handle pressure?",
    "How do you prioritize your work?",
    "What are your career goals?",
    "What is your biggest failure?",
    "Why did you leave your last job?",
    "What are your salary expectations?",
    "Do you have any questions for us?",
    "What is OOP?",
    "What are the four pillars of OOP?",
    "What is inheritance?",
    "What is polymorphism?",
    "What is abstraction?",
    "What is encapsulation?",
    "What is an interface?",
    "What is an abstract class?",
    "What is method overloading?",
    "What is method overriding?",
    "What is an array?",
    "What is a linked list?",
    "What is a stack?",
    "What is a queue?",
    "What is a binary tree?",
    "What is binary search?",
    "What is linear search?",
    "What is recursion?",
    "What is a hash table?",
    "What is time complexity?",
    "What is SQL?",
    "What is a primary key?",
    "What is a foreign key?",
    "What is normalization?",
    "What is a JOIN?",
    "What is an INNER JOIN?",
    "What is a LEFT JOIN?",
    "What is a transaction in SQL?",
    "What is indexing?",
    "What is a stored procedure?",
    "What is Git?",
    "What is GitHub?",
    "What is branching in Git?",
    "What is merging in Git?",
    "What is a pull request?",
    "What is REST API?",
    "What is JSON?",
    "What is HTTP?",
    "What is HTTPS?",
    "What is an API?",
    "What is Agile?",
    "What is Scrum?",
    "What is a Sprint?",
    "What is CI/CD?",
    "What is Docker?",
    "What is Kubernetes?",
    "What is cloud computing?",
    "What is AWS?",
    "What is Azure?",
    "What is multithreading?",
    "What is synchronization?",
    "What is deadlock?",
    "What is operating system?",
    "What is virtual memory?",
    "What is paging?",
    "What is TCP?",
    "What is UDP?",
    "What is DNS?",
    "What is an IP address?",
    "What is a firewall?",
    "Solve: 25 × 16.",
    "What is 20% of 450?",
    "Find the next number: 2, 4, 8, 16, ?",
    "A train travels 120 km in 2 hours. Find its speed.",
    "What is the probability of getting a head on a coin toss?",
    "Simplify: (15 × 8) ÷ 5.",
    "What is the average of 15, 20, 25, 30?",
    "What is the square root of 144?",
    "Convert 0.75 into a percentage.",
    "If a product costs ₹800 after a 20% discount, what was its original price?",
    "Describe a time you showed leadership.",
    "Tell me about a time you failed.",
    "How do you deal with criticism?",
    "Describe a time you solved a difficult problem.",
    "Tell me about a time you met a tight deadline.",
    "What would you do if you disagreed with your manager?",
    "How do you adapt to change?",
    "How do you handle multiple tasks?",
    "What makes you a good team player?",
    "What would you do in your first 90 days if hired?",
    "What is system design?",
    "How would you design a URL shortener?",
    "How would you design a chat application?",
    "What is caching?",
    "What is load balancing?",
    "What is database sharding?",
    "What questions do you have for us?"
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
const topicName = "Most Asked Questions";

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
