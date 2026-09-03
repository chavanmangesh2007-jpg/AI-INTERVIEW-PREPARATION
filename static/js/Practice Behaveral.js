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

const questions = [
"Tell me about yourself.",
"Describe a time you solved a difficult problem.",
"Tell me about a challenge you faced at work.",
"Describe a time you worked under pressure.",
"Tell me about a time you failed.",
"What did you learn from your biggest mistake?",
"Describe a conflict with a coworker.",
"How did you resolve a disagreement with your manager?",
"Tell me about a time you showed leadership.",
"Describe a situation where you motivated your team.",
"Tell me about a time you met a tight deadline.",
"Describe a time you missed a deadline.",
"Tell me about a time you handled multiple priorities.",
"Describe a difficult decision you made.",
"Tell me about a time you took initiative.",
"Describe a situation where you exceeded expectations.",
"Tell me about a time you handled criticism.",
"Describe a time you received negative feedback.",
"Tell me about a successful team project.",
"Describe a time you worked with a difficult teammate.",
"Tell me about a time you had to adapt to change.",
"Describe a situation where you learned something quickly.",
"Tell me about a time you solved a customer problem.",
"Describe a time you improved a process.",
"Tell me about a time you made an important decision.",
"Describe a time you handled ambiguity.",
"Tell me about a time you persuaded someone.",
"Describe a time you handled conflict in a team.",
"Tell me about a time you made a mistake at work.",
"Describe a time you managed a crisis.",
"Tell me about a time you handled stress effectively.",
"Describe a time you worked with limited resources.",
"Tell me about a time you managed competing priorities.",
"Describe a time you trained a coworker.",
"Tell me about a time you delegated work.",
"Describe a time you accepted responsibility.",
"Tell me about a time you disagreed with a company policy.",
"Describe a time you solved a technical issue.",
"Tell me about a time you improved team performance.",
"Describe a time you worked with cross-functional teams.",
"Tell me about a time you handled confidential information.",
"Describe a time you demonstrated integrity.",
"Tell me about a time you earned someone's trust.",
"Describe a time you helped a struggling teammate.",
"Tell me about a time you had to learn a new skill.",
"Describe a time you worked independently.",
"Tell me about a time you handled an unhappy customer.",
"Describe a time you managed change successfully.",
"Tell me about a time you identified a risk.",
"Describe a time you prevented a problem.",
"Tell me about a time you achieved a difficult goal.",
"Describe a time you went beyond your responsibilities.",
"Tell me about a time you improved productivity.",
"Describe a time you handled workplace conflict.",
"Tell me about a time you resolved a misunderstanding.",
"Describe a time you worked overtime to complete a task.",
"Tell me about a time you managed your time effectively.",
"Describe a time you balanced multiple deadlines.",
"Tell me about a time you influenced a decision.",
"Describe a time you handled failure positively.",
"Tell me about a time you resolved a communication issue.",
"Describe a time you accepted constructive criticism.",
"Tell me about a time you encouraged teamwork.",
"Describe a time you solved a recurring problem.",
"Tell me about a time you had to negotiate.",
"Describe a time you handled a difficult client.",
"Tell me about a time you improved customer satisfaction.",
"Describe a time you worked with a diverse team.",
"Tell me about a time you adapted to a new technology.",
"Describe a time you stayed calm under pressure.",
"Tell me about a time you worked without supervision.",
"Describe a time you delivered excellent service.",
"Tell me about a time you motivated yourself.",
"Describe a time you handled unexpected changes.",
"Tell me about a time you met an impossible deadline.",
"Describe a time you prioritized urgent tasks.",
"Tell me about a time you handled workplace stress.",
"Describe a time you solved a problem creatively.",
"Tell me about a time you took ownership.",
"Describe a time you inspired others.",
"Tell me about a time you managed conflict professionally.",
"Describe a time you built strong relationships.",
"Tell me about a time you improved communication.",
"Describe a time you accepted a challenging assignment.",
"Tell me about a time you demonstrated accountability.",
"Describe a time you managed a project successfully.",
"Tell me about a time you recovered from failure.",
"Describe a time you worked outside your comfort zone.",
"Tell me about a time you solved a complex issue.",
"Describe a time you handled competing demands.",
"Tell me about a time you collaborated effectively.",
"Describe a time you made an ethical decision.",
"Tell me about a time you handled criticism positively.",
"Describe a time you achieved a team goal.",
"Tell me about a time you made a quick decision.",
"Describe a time you handled pressure successfully.",
"Tell me about a time you supported organizational change.",
"Describe a time you resolved a difficult situation.",
"Tell me about a time you demonstrated resilience.",
"Describe a time you managed workplace conflict.",
"Tell me about a time you learned from failure.",
"Describe a time you helped improve team morale.",
"Tell me about a time you influenced your manager.",
"Describe a time you worked with different personalities.",
"Tell me about a time you handled uncertainty.",
"Describe a time you solved an urgent problem.",
"Tell me about a time you identified an opportunity.",
"Describe a time you exceeded customer expectations.",
"Tell me about a time you made a positive impact.",
"Describe a time you managed your workload efficiently.",
"Tell me about a time you accepted additional responsibilities.",
"Describe a time you stayed motivated during setbacks.",
"Tell me about a time you demonstrated professionalism.",
"Describe a time you resolved a customer complaint.",
"Tell me about a time you improved quality.",
"Describe a time you showed empathy at work.",
"Tell me about a time you supported a teammate.",
"Describe a time you handled a difficult conversation.",
"Tell me about a time you managed expectations.",
"Describe a time you adapted your communication style.",
"Tell me about a time you identified a better solution.",
"Describe a time you achieved a personal goal.",
"Tell me about a time you accepted change.",
"Describe a time you solved a conflict peacefully.",
"Tell me about a time you built trust with a client.",
"Describe a time you learned from feedback.",
"Tell me about a time you handled rejection.",
"Describe a time you managed a high-pressure situation.",
"Tell me about a time you remained positive.",
"Describe a time you solved an unexpected issue.",
"Tell me about a time you handled a difficult stakeholder.",
"Describe a time you demonstrated patience.",
"Tell me about a time you accepted accountability.",
"Describe a time you encouraged innovation.",
"Tell me about a time you handled competing priorities successfully.",
"Describe a time you maintained work-life balance.",
"Tell me about a time you delivered results despite obstacles.",
"Describe a time you improved workplace efficiency.",
"Tell me about a time you built team collaboration.",
"Describe a time you handled feedback from customers.",
"Tell me about a time you worked under uncertainty.",
"Describe a time you resolved a misunderstanding at work.",
"Tell me about a time you solved a business problem.",
"Describe a time you helped your organization succeed.",
"Tell me about a time you demonstrated adaptability.",
"Describe a time you stayed focused despite distractions.",
"Tell me about a time you led by example.",
"Describe a time you managed an unexpected challenge.",
"Tell me about a time you achieved success through teamwork.",
"Describe a time you handled conflict with professionalism.",
"Tell me about a time you took responsibility for an error.",
"Describe a time you solved a problem without guidance.",
"Tell me about a time you exceeded your manager's expectations.",
"Describe a time you achieved an important milestone.",
"Tell me about a time you demonstrated strong work ethics.",
"Describe a time you remained calm in a difficult situation.",
"Tell me about a time you overcame a major obstacle.",
"Describe a time you made a lasting contribution to your team."
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


// Stop camera when back button clicked
// (Handled by HTML)


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
const topicName = "Behavioral Questions";

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