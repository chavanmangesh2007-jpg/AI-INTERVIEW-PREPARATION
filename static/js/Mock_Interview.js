// ========================================
// Mock Interview JS — Camera, Mic, STT, TTS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================
    // 1. Role Selection (Setup Page)
    // ========================
    const roleCards = document.querySelectorAll(".role-card");
    const hiddenTopic = document.getElementById("selectedTopic");

    roleCards.forEach(card => {
        card.addEventListener("click", function () {
            roleCards.forEach(c => c.classList.remove("active-role"));
            this.classList.add("active-role");

            const roleHeading = this.querySelector("h3");
            if (roleHeading && hiddenTopic) {
                hiddenTopic.value = roleHeading.innerText.trim();
            }
        });
    });

    // Search Role filtering
    const search = document.querySelector(".top-search input");
    if (search) {
        search.addEventListener("keyup", function () {
            const value = this.value.toLowerCase();
            roleCards.forEach(card => {
                const h = card.querySelector("h3");
                if (h) {
                    card.style.display = h.innerText.toLowerCase().includes(value) ? "flex" : "none";
                }
            });
        });
    }

    // ========================
    // 2. Session Timer
    // ========================
    const timerEl = document.getElementById("sessionTimer");
    if (timerEl) {
        let elapsedSeconds = 0;
        setInterval(() => {
            elapsedSeconds++;
            const m = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
            const s = (elapsedSeconds % 60).toString().padStart(2, "0");
            timerEl.textContent = `${m}:${s}`;
        }, 1000);
    }

    // ========================
    // 3. Camera & Mic (WebRTC)
    // ========================
    const cameraFeed = document.getElementById("cameraFeed");
    const cameraToggleBtn = document.getElementById("cameraToggleBtn");
    const micToggleBtn = document.getElementById("micToggleBtn");
    const cameraOffOverlay = document.getElementById("cameraOffOverlay");
    const liveBadge = document.getElementById("liveBadge");
    const micStatusIcon = document.getElementById("micStatusIcon");
    const micStatusText = document.getElementById("micStatusText");
    const micStatusBox = document.querySelector(".mic-status-box");
    const soundWave = document.getElementById("soundWave");

    let mediaStream = null;
    let cameraOn = true;
    let micOn = true;

    async function startCamera() {
        if (!cameraFeed) return;
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            cameraFeed.srcObject = mediaStream;
            cameraOn = true;
            micOn = true;
            updateCameraUI();
            updateMicUI();
        } catch (err) {
            console.warn("Camera/Mic access denied or unavailable:", err);
            if (cameraOffOverlay) {
                cameraOffOverlay.classList.add("active");
                cameraOffOverlay.querySelector("p").textContent = "Camera permission denied";
            }
            if (liveBadge) {
                liveBadge.classList.add("off");
                liveBadge.innerHTML = '<i class="fa-solid fa-circle"></i> Off';
            }
        }
    }

    function stopCamera() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(t => t.stop());
            mediaStream = null;
            if (cameraFeed) cameraFeed.srcObject = null;
        }
    }

    function updateCameraUI() {
        if (!cameraToggleBtn) return;
        if (cameraOn) {
            cameraToggleBtn.innerHTML = '<i class="fa-solid fa-video"></i> Camera ON';
            cameraToggleBtn.className = "control-btn control-btn-active";
            if (cameraOffOverlay) cameraOffOverlay.classList.remove("active");
            if (liveBadge) {
                liveBadge.classList.remove("off");
                liveBadge.innerHTML = '<i class="fa-solid fa-circle"></i> Live';
            }
        } else {
            cameraToggleBtn.innerHTML = '<i class="fa-solid fa-video-slash"></i> Camera OFF';
            cameraToggleBtn.className = "control-btn control-btn-off";
            if (cameraOffOverlay) cameraOffOverlay.classList.add("active");
            if (liveBadge) {
                liveBadge.classList.add("off");
                liveBadge.innerHTML = '<i class="fa-solid fa-circle"></i> Off';
            }
        }
    }

    function updateMicUI() {
        if (!micToggleBtn) return;
        if (micOn) {
            micToggleBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> Mic ON';
            micToggleBtn.className = "control-btn control-btn-active";
            if (micStatusIcon) micStatusIcon.className = "fa-solid fa-microphone mic-status-icon";
            if (micStatusText) micStatusText.textContent = "Microphone is ON";
            if (micStatusBox) micStatusBox.classList.remove("mic-off");
            if (soundWave) soundWave.classList.remove("wave-off");
        } else {
            micToggleBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> Mic OFF';
            micToggleBtn.className = "control-btn control-btn-off";
            if (micStatusIcon) micStatusIcon.className = "fa-solid fa-microphone-slash mic-status-icon";
            if (micStatusText) micStatusText.textContent = "Microphone is OFF";
            if (micStatusBox) micStatusBox.classList.add("mic-off");
            if (soundWave) soundWave.classList.add("wave-off");
        }
    }

    if (cameraToggleBtn) {
        cameraToggleBtn.addEventListener("click", () => {
            if (!mediaStream) return;
            const videoTrack = mediaStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                cameraOn = videoTrack.enabled;
                updateCameraUI();
            }
        });
    }

    if (micToggleBtn) {
        micToggleBtn.addEventListener("click", () => {
            if (!mediaStream) return;
            const audioTrack = mediaStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                micOn = audioTrack.enabled;
                updateMicUI();
            }
        });
    }

    if (cameraFeed) {
        startCamera();
    }

    window.addEventListener("beforeunload", stopCamera);

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            stopCamera();
        });
    }

    // TTS & STT & Word Count
    const speakBtns = document.querySelectorAll(".speak-btn");
    speakBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const text = this.getAttribute("data-question");
            if (!text) return;
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            utterance.rate = 0.95;
            utterance.pitch = 1;

            this.classList.add("speaking");
            utterance.onend = () => this.classList.remove("speaking");
            utterance.onerror = () => this.classList.remove("speaking");
            speechSynthesis.speak(utterance);
        });
    });

    const listenBtns = document.querySelectorAll(".listen-btn");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    listenBtns.forEach(btn => {
        let recognition = null;
        let isListening = false;

        btn.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const textarea = document.getElementById(targetId);
            if (!textarea) return;

            if (!SpeechRecognition) {
                alert("Speech Recognition is not supported in this browser. Please use Chrome or Edge.");
                return;
            }

            if (isListening && recognition) {
                recognition.stop();
                return;
            }

            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";

            recognition.onstart = () => {
                isListening = true;
                btn.innerHTML = '<i class="fa-solid fa-microphone"></i> Listening...';
                btn.classList.add("listening-active");
            };

            recognition.onresult = (event) => {
                let finalTranscript = "";
                let interimTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                textarea.value = finalTranscript + interimTranscript;
                updateWordCount(targetId);
            };

            recognition.onend = () => {
                isListening = false;
                btn.innerHTML = '<i class="fa-solid fa-microphone"></i> Start Listening';
                btn.classList.remove("listening-active");
            };

            recognition.onerror = () => {
                isListening = false;
                btn.innerHTML = '<i class="fa-solid fa-microphone"></i> Start Listening';
                btn.classList.remove("listening-active");
            };

            recognition.start();
        });
    });

    function updateWordCount(textareaId) {
        const textarea = document.getElementById(textareaId);
        const wordCountEl = document.querySelector(`.word-count[data-for="${textareaId}"]`);
        if (!textarea || !wordCountEl) return;
        const text = textarea.value.trim();
        const words = text === "" ? 0 : text.split(/\s+/).length;
        wordCountEl.textContent = `Words: ${words}`;
    }

    document.querySelectorAll(".qa-textarea").forEach(ta => {
        ta.addEventListener("input", function () {
            updateWordCount(this.id);
        });
    });

    const closeTips = document.getElementById("closeTips");
    const tipsBar = document.getElementById("tipsBar");
    if (closeTips && tipsBar) {
        closeTips.addEventListener("click", () => {
            tipsBar.style.display = "none";
        });
    }
});
