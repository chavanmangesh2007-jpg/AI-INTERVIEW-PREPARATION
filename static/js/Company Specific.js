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
            try { recognition.start(); } catch(e){}
        }
    } else {
        alert("Speech Recognition is not supported in this browser.");
    }

});


// ===============================
// Questions
// ===============================

let selectedCompany = "General";
let questions = ["Loading..."];
let current = 0;

const companySelect = document.getElementById("companySelect");
const totalQuestionsCount = document.getElementById("totalQuestionsCount");
const questionEl = document.querySelector(".question-box h2");
const textareaEl = document.querySelector("textarea");
const wordCountEl = document.querySelector(".word");

// Backend integration vars
let sessionId = null;

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

function startBackendSession() {
    let topicName = "Company Specific: " + selectedCompany;
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

async function loadQuestions(company) {
    try {
        const response = await fetch(`/api/get-company-questions/?company=${encodeURIComponent(company)}`);
        const data = await response.json();
        questions = data.questions || [];
        
        current = 0;
        
        // 1 question = 1 minute
        minutes = questions.length;
        seconds = 0;
        
        if (totalQuestionsCount) {
            totalQuestionsCount.innerText = questions.length;
        }

        if (questions.length > 0) {
            questionEl.innerHTML = `<span>${current + 1}.</span> ${questions[current]}`;
        } else {
            questionEl.innerHTML = `No questions found for ${company}`;
        }
        
        if (textareaEl) textareaEl.value = "";
        if (wordCountEl) wordCountEl.innerHTML = "Words : 0";
        
        window.speechSynthesis.cancel();
        setTimeout(() => {
            const speakBtn = document.getElementById("speakQuestion");
            if (speakBtn) speakBtn.click();
        }, 500);

        // Start a new session in the backend when company changes
        startBackendSession();
        
    } catch (error) {
        console.error('Error fetching questions:', error);
        questionEl.innerHTML = `Error loading questions.`;
    }
}

// Initial load
window.addEventListener("load", () => {
    loadQuestions(selectedCompany);
});

if (companySelect) {
    companySelect.addEventListener("change", (e) => {
        selectedCompany = e.target.value;
        loadQuestions(selectedCompany);
    });
}

const nextBtn = document.querySelector(".next");

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

    questionEl.innerHTML =
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

        window.location.href = "/practice/";

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
    catch(error) {

        alert("Please allow Camera and Microphone Permission.");
        console.log(error);

    }

}


// Stop Camera + Mic
function stopCamera(){

    if(stream){

        stream.getTracks().forEach(track => {

            track.stop();

        });

        stream = null;
        camera.srcObject = null;

    }

}


// Camera start when page loads
window.addEventListener("load", ()=>{

    startCamera();

});


// Stop camera when leaving page
window.addEventListener("beforeunload", ()=>{

    stopCamera();

});


// Stop camera when End Interview clicked
document.querySelector(".end").addEventListener("click",()=>{

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

    if(videoTrack.enabled){
        cameraBtn.innerHTML = '<i class="fa-solid fa-video"></i> Camera OFF';
    }else{
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

    if(!stream) return;


    const audioTrack = stream.getAudioTracks()[0];

    audioTrack.enabled = !audioTrack.enabled;


    if(audioTrack.enabled){

        micActive = true;


        // Button
        micBtn.innerHTML =
        '<i class="fa-solid fa-microphone"></i> Mic ON';


        // Status Card
        micStatus.innerHTML = "Microphone is ON";

        micIcon.className = "fa-solid fa-microphone";

        wave.style.display = "flex";


        // Start Speech Recognition
        if(recognition){
            try { recognition.start(); } catch(e){}
        }

    }
    else{


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
        if(recognition){
            recognition.stop();
        }

    }

});


recognition.onresult = (event) => {

    let finalText = "";

    for(let i = event.resultIndex; i < event.results.length; i++){

        if(event.results[i].isFinal){

            finalText += event.results[i][0].transcript;

        }

    }


    if(finalText !== ""){

        textarea.value += finalText + " ";

    }


    // Remove duplicate words
    let words = textarea.value
        .trim()
        .split(/\s+/);


    let uniqueWords = [];

    words.forEach(word => {

        if(uniqueWords[uniqueWords.length - 1] !== word){

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
if (speakBtn) {
    speakBtn.addEventListener("click", speakQuestion);
}

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