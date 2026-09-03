// ===============================
// Countdown Timer
// ===============================

let minutes = 120;
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
"What is an array?",
"What are the advantages of arrays?",
"What are the disadvantages of arrays?",
"Difference between array and linked list?",
"What is array indexing?",
"How do you insert an element into an array?",
"How do you delete an element from an array?",
"What is array traversal?",
"What is searching in an array?",
"Difference between linear search and binary search?",
"What is binary search?",
"What is the time complexity of binary search?",
"What is sorting?",
"Difference between Bubble Sort and Selection Sort?",
"What is Insertion Sort?",
"What is Merge Sort?",
"What is Quick Sort?",
"What is Kadane's Algorithm?",
"What is Prefix Sum?",
"What is Sliding Window Technique?",
"What is a Linked List?",
"Types of Linked Lists?",
"Difference between Singly and Doubly Linked List?",
"What is a Circular Linked List?",
"What is a Node in Linked List?",
"How do you insert at the beginning of a Linked List?",
"How do you insert at the end of a Linked List?",
"How do you delete a node from a Linked List?",
"How do you search in a Linked List?",
"How do you reverse a Linked List?",
"How do you detect a loop in a Linked List?",
"How do you find the middle node of a Linked List?",
"How do you merge two sorted Linked Lists?",
"How do you remove duplicates from a Linked List?",
"How do you delete the Nth node from the end?",
"What is a Dummy Node?",
"What are the advantages of Linked List?",
"What are the disadvantages of Linked List?",
"What are the applications of Linked List?",
"What is the time complexity of Linked List operations?",
"What is a Stack?",
"What is LIFO?",
"What are Stack operations?",
"What is Push operation?",
"What is Pop operation?",
"What is Peek operation?",
"What is Stack Overflow?",
"What is Stack Underflow?",
"What are the applications of Stack?",
"What are Infix, Prefix, and Postfix expressions?",
"How do you convert Infix to Postfix?",
"How do you evaluate a Postfix expression?",
"How do you reverse a string using Stack?",
"What is Parentheses Matching?",
"What is Next Greater Element?",
"What is Largest Rectangle in Histogram?",
"How do you implement Stack using Array?",
"How do you implement Stack using Linked List?",
"What is the time complexity of Stack operations?",
"Difference between Stack and Queue?",
"What is a Queue?",
"What is FIFO?",
"What are Queue operations?",
"What is Enqueue operation?",
"What is Dequeue operation?",
"What is a Circular Queue?",
"What is a Priority Queue?",
"What is a Deque?",
"What are the applications of Queue?",
"How do you implement Queue using Array?",
"How do you implement Queue using Linked List?",
"How do you implement Queue using two Stacks?",
"How do you implement Stack using two Queues?",
"What is Front pointer in Queue?",
"What is Rear pointer in Queue?",
"What is Queue Overflow?",
"What is Queue Underflow?",
"What is the time complexity of Queue operations?",
"Difference between Queue and Deque?",
"Difference between Queue and Stack?",
"What is a Tree?"
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

        window.location.href = "/practice/technical/";

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

// ===============================
// Backend Integration
// ===============================

let sessionId = null;
const topicName = "Data Structure";

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
