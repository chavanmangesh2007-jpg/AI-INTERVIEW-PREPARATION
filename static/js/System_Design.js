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
"What is system design?",
"What is scalability?",
"What is availability in system design?",
"What is reliability?",
"What is fault tolerance?",
"What is latency?",
"What is throughput?",
"What is horizontal scaling?",
"What is vertical scaling?",
"What is load balancing?",
"What is a reverse proxy?",
"What is a forward proxy?",
"What is caching?",
"What are the different types of cache?",
"What is cache invalidation?",
"What is CDN?",
"What is database sharding?",
"What is database replication?",
"What is partitioning?",
"What is normalization?",
"What is denormalization?",
"What is ACID?",
"What is BASE?",
"What is CAP theorem?",
"What is eventual consistency?",
"What is strong consistency?",
"What is SQL?",
"What is NoSQL?",
"When would you choose SQL over NoSQL?",
"When would you choose NoSQL over SQL?",
"What is indexing?",
"What is a primary key?",
"What is a foreign key?",
"What is a composite key?",
"What is a clustered index?",
"What is a non-clustered index?",
"What is connection pooling?",
"What is database failover?",
"What is read replica?",
"What is write replica?",
"What is optimistic locking?",
"What is pessimistic locking?",
"What is a deadlock?",
"How do you prevent deadlocks?",
"What is a microservice architecture?",
"What are the advantages of microservices?",
"What are the disadvantages of microservices?",
"What is a monolithic architecture?",
"When should you use a monolith?",
"What is service discovery?",
"What is an API gateway?",
"What is REST API?",
"What is GraphQL?",
"What is gRPC?",
"What is SOAP?",
"What is stateless architecture?",
"What is stateful architecture?",
"What is session management?",
"What is JWT?",
"What is OAuth?",
"What is authentication?",
"What is authorization?",
"What is rate limiting?",
"What is throttling?",
"What is circuit breaker pattern?",
"What is retry mechanism?",
"What is message queue?",
"What is Apache Kafka?",
"What is RabbitMQ?",
"What is asynchronous communication?",
"What is synchronous communication?",
"What is event-driven architecture?",
"What is event sourcing?",
"What is CQRS?",
"What is pub-sub architecture?",
"What is idempotency?",
"What is distributed transaction?",
"What is two-phase commit?",
"What is Saga pattern?",
"What is distributed locking?",
"What is Redis used for?",
"What is Memcached?",
"What is Bloom Filter?",
"What is consistent hashing?",
"What is hashing?",
"What is load shedding?",
"What is auto scaling?",
"What is health check?",
"What is heartbeat mechanism?",
"What is leader election?",
"What is consensus algorithm?",
"What is Raft algorithm?",
"What is Paxos?",
"What is ZooKeeper?",
"What is etcd?",
"What is Docker?",
"What is Kubernetes?",
"What is containerization?",
"What is virtualization?",
"What is orchestration?",
"What is CI/CD?",
"What is blue-green deployment?",
"What is canary deployment?",
"What is rolling deployment?",
"What is feature flag?",
"What is observability?",
"What is monitoring?",
"What is logging?",
"What is distributed tracing?",
"What are metrics?",
"How do you design a URL shortening service?",
"How do you design a chat application?",
"How do you design Instagram?",
"How do you design WhatsApp?",
"How do you design YouTube?",
"How do you design Twitter/X?",
"How do you design an online shopping system?",
"How do you design a ride-sharing application?",
"How do you design a food delivery system?",
"How do you design a notification service?",
"How do you design a payment gateway?",
"How do you design a file storage system?",
"How do you design a search engine?",
"How do you design an online banking system?",
"How do you design a video streaming platform?",
"How do you design a social media platform?",
"How do you design a distributed cache?",
"How do you design an API rate limiter?",
"How do you design a hotel booking system?",
"How do you design an online examination system?",
"How do you design a real-time collaboration system?",
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
const topicName = "System Design";

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
