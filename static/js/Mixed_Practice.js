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
"What are your strengths?",
"What are your weaknesses?",
"Why should we hire you?",
"Why do you want to work for our company?",
"Where do you see yourself in five years?",
"What motivates you?",
"What are your career goals?",
"Describe your current role.",
"Why are you looking for a new job?",
"What is your biggest achievement?",
"What is your biggest failure?",
"How do you handle stress?",
"Describe a challenging project you worked on.",
"How do you prioritize your work?",
"What is polymorphism?",
"What is encapsulation?",
"What is inheritance?",
"What is abstraction?",
"What is method overloading?",
"What is method overriding?",
"What is multithreading?",
"What is exception handling?",
"What is a constructor?",
"What is an interface?",
"What is an abstract class?",
"What is HTML?",
"What is CSS?",
"What is JavaScript?",
"What is the DOM?",
"What is Bootstrap?",
"What is React?",
"What is Angular?",
"What is Node.js?",
"What is Express.js?",
"What is JSON?",
"What is REST API?",
"What is SQL?",
"What is a primary key?",
"What is a foreign key?",
"What is normalization?",
"What is indexing?",
"What is Git?",
"What is GitHub?",
"What is Docker?",
"What is Kubernetes?",
"What is percentage?",
"What is profit and loss?",
"What is simple interest?",
"What is compound interest?",
"What is ratio and proportion?",
"What is average?",
"What is time and work?",
"What is time and distance?",
"What is probability?",
"What is permutation?",
"What is combination?",
"What is logical reasoning?",
"Solve a percentage problem.",
"Solve a ratio problem.",
"Tell me about a time you solved a difficult problem.",
"Describe a conflict with a teammate.",
"Tell me about a time you showed leadership.",
"Describe a time you failed.",
"Tell me about a successful team project.",
"Describe a time you worked under pressure.",
"Tell me about a time you learned a new skill.",
"Describe a time you exceeded expectations.",
"Tell me about a difficult decision you made.",
"Describe a time you handled criticism.",
"What is system design?",
"What is scalability?",
"What is load balancing?",
"What is caching?",
"What is CDN?",
"What is microservices architecture?",
"What is database sharding?",
"What is database replication?",
"What is API Gateway?",
"What is Redis?",
"What do you know about our company?",
"Why do you think you're a good fit for this role?",
"What type of work environment do you prefer?",
"How do you handle deadlines?",
"What are your salary expectations?",
"Are you willing to relocate?",
"How do you manage multiple tasks?",
"What makes you different from other candidates?",
"Describe your ideal manager.",
"What are your long-term career plans?",
"What is a linked list?",
"What is a stack?",
"What is a queue?",
"What is a binary tree?",
"What is binary search?",
"What is quick sort?",
"What is recursion?",
"What is dynamic programming?",
"What is a hash table?",
"Do you have any questions for us?",
"Explain merge sort.",
"What is bubble sort?",
"What is selection sort?",
"What is insertion sort?",
"What is heap sort?",
"What is DFS?",
"What is BFS?",
"What is a graph?",
"What is a tree?",
"What is a binary search tree?",
"What is AVL tree?",
"What is a heap?",
"What is a trie?",
"What is hashing?",
"What is collision in hashing?",
"What is a deadlock?",
"What is multithreading?",
"What is synchronization?",
"What is process scheduling?",
"What is memory management?",
"What is operating system?",
"What is virtual memory?",
"What is paging?",
"What is segmentation?",
"What is compiler?",
"What is interpreter?",
"What is TCP?",
"What is UDP?",
"What is HTTP?",
"What is HTTPS?",
"What is DNS?",
"What is IP address?",
"What is subnet mask?",
"What is firewall?",
"What is VPN?",
"What is cloud computing?",
"What is AWS?",
"What is Microsoft Azure?",
"What is Google Cloud Platform?",
"What is virtualization?",
"What is CI/CD?",
"What is Jenkins?",
"What is Maven?",
"What is Gradle?",
"What is unit testing?",
"What is integration testing?",
"What is Selenium?",
"What is JUnit?",
"What is TestNG?",
"What is Agile?",
"What is Scrum?",
"What is Sprint?",
"What is Product Backlog?",
"What is Sprint Planning?",
"What is Daily Scrum?",
"What is Sprint Review?",
"What is Sprint Retrospective?",
"Explain CAP theorem.",
"What is ACID property?",
"What is NoSQL?",
"What is MongoDB?",
"What is Firebase?",
"What is PostgreSQL?",
"What is MySQL?",
"What is Oracle Database?",
"What is SQLite?",
"What is stored procedure?",
"What is trigger?",
"What is view in SQL?",
"What is transaction?",
"What is commit?",
"What is rollback?",
"What is optimistic locking?",
"What is pessimistic locking?",
"How do you handle conflicts at work?",
"Describe a time you solved a customer issue.",
"Tell me about a time you improved a process.",
"Describe a difficult decision you made.",
"Tell me about a time you worked independently.",
"Describe a situation where you had to learn quickly.",
"Tell me about a time you handled failure.",
"Describe a situation where you exceeded your target.",
"Tell me about a time you trained someone.",
"Describe a time you managed multiple deadlines.",
"What are your short-term goals?",
"What is your dream company?",
"What are your expectations from this role?",
"What motivates you to perform well?",
"What type of work culture do you prefer?",
"What are your salary expectations?",
"How soon can you join?",
"Would you work on weekends if required?",
"Are you comfortable with night shifts?",
"How do you stay updated with technology?",
"What is scalability in system design?",
"What is availability?",
"What is fault tolerance?",
"What is latency?",
"What is throughput?",
"What is message queue?",
"What is Kafka?",
"What is RabbitMQ?",
"What is Redis cache?",
"What is a reverse proxy?",
"What is a forward proxy?",
"What is CDN caching?",
"What is database indexing?",
"What is sharding?",
"What is replication?",
"What is horizontal scaling?",
"What is vertical scaling?",
"What is stateless architecture?",
"What is stateful architecture?",
"What is session management?",
"What is JWT?",
"What is OAuth?",
"What is authentication?",
"What is authorization?",
"What is API rate limiting?",
"What is throttling?",
"What is circuit breaker pattern?",
"What is service discovery?",
"What is event-driven architecture?",
"What is asynchronous programming?",
"What is synchronous programming?",
"What is load testing?",
"What is stress testing?",
"What is smoke testing?",
"What is regression testing?",
"What is black-box testing?",
"What is white-box testing?"
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
const topicName = "Mixed Practice";

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
