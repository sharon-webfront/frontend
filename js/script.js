const loginForm = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");
const questionnaireSection = document.getElementById("questionnaireSection");
const patientForm = document.getElementById("patientForm");

const languageSelect = document.getElementById("language");
const loginMessage = document.getElementById("loginMessage");
const formMessage = document.getElementById("formMessage");

const STORAGE_KEY = "medikiosk_patient_draft_v1";
// Open the body pain mapper
const openPainMapperBtn = document.getElementById("openPainMapperBtn");

if (openPainMapperBtn) {
    openPainMapperBtn.addEventListener("click", function() {
        window.location.href = "pain-map.html";
    });
}


// 1. LANGUAGE SWITCHING

function changeLanguage(language) {
    document.querySelectorAll("[data-en]").forEach(element => {
        element.textContent =
            language === "kn"
                ? element.dataset.kn
                : element.dataset.en;
    });

    document.documentElement.lang = language;
}

languageSelect.addEventListener("change", function () {
    changeLanguage(this.value);
});


// 2. DEMO LOGIN

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || password.length < 6) {
        loginMessage.textContent =
            "Enter a valid email and password of at least 6 characters.";
        return;
    }

    sessionStorage.setItem("medikiosk_demo_login", "true");

    loginSection.classList.add("hidden");
    questionnaireSection.classList.remove("hidden");

    loginMessage.textContent = "";
});


// 3. SAVE QUESTIONNAIRE

function saveDraft() {
    const formData = new FormData(patientForm);
    const answers = Object.fromEntries(formData.entries());

    answers.language = languageSelect.value;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));

    formMessage.textContent = "Your draft has been saved in this browser.";
}

document.getElementById("saveBtn").addEventListener("click", saveDraft);


// 4. RELOAD SAVED ANSWERS

function loadDraft() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        formMessage.textContent = "No saved answers were found.";
        return;
    }

    const answers = JSON.parse(savedData);

    Object.keys(answers).forEach(key => {
        const field = patientForm.elements.namedItem(key);

        if (field) {
            field.value = answers[key];
        }
    });

    if (answers.language) {
        languageSelect.value = answers.language;
        changeLanguage(answers.language);
    }

    formMessage.textContent = "Your saved answers have been reloaded.";
}

document.getElementById("loadBtn").addEventListener("click", loadDraft);


// 5. SUBMIT QUESTIONNAIRE - DEMO ONLY

patientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!patientForm.checkValidity()) {
        patientForm.reportValidity();
        return;
    }

    saveDraft();

    formMessage.textContent =
        "Demo submitted! Backend connection is not available yet.";
});


// 6. LOGOUT

document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.removeItem("medikiosk_demo_login");

    loginSection.classList.remove("hidden");
    questionnaireSection.classList.add("hidden");

    loginForm.reset();
    loginMessage.textContent = "";
});


// 7. RESTORE DEMO SESSION AFTER REFRESH

window.addEventListener("DOMContentLoaded", function () {
    changeLanguage(languageSelect.value);

    if (sessionStorage.getItem("medikiosk_demo_login") === "true") {
        loginSection.classList.add("hidden");
        questionnaireSection.classList.remove("hidden");
    }
});

// ========================================
// WEEK 2 - TASK 1: AUDIO RECORDING
// ========================================

const startRecordingBtn =
    document.getElementById("startRecordingBtn");

const stopRecordingBtn =
    document.getElementById("stopRecordingBtn");

const recordingStatus =
    document.getElementById("recordingStatus");

const recordingTimer =
    document.getElementById("recordingTimer");

const audioPlayback =
    document.getElementById("audioPlayback");

let mediaRecorder;
let audioChunks = [];
let recordingSeconds = 0;
let recordingInterval;
let audioStream;


// Run recording functionality only when its HTML elements exist
if (
    startRecordingBtn &&
    stopRecordingBtn &&
    recordingStatus &&
    recordingTimer &&
    audioPlayback
) {

    // Start recording
    startRecordingBtn.addEventListener("click", async function () {

        try {

            if (!navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia) {

                recordingStatus.textContent =
                    "Microphone recording is not supported here.";

                return;
            }

            audioStream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });

            audioChunks = [];
            recordingSeconds = 0;

            recordingTimer.textContent = "00:00";
            audioPlayback.hidden = true;

            mediaRecorder = new MediaRecorder(audioStream);

            mediaRecorder.addEventListener("dataavailable", function (event) {

                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }

            });

            mediaRecorder.addEventListener("stop", function () {

                const audioBlob = new Blob(audioChunks, {
                    type: mediaRecorder.mimeType || "audio/webm"
                });

                const audioURL = URL.createObjectURL(audioBlob);

                audioPlayback.src = audioURL;
                audioPlayback.hidden = false;

                recordingStatus.textContent =
                    "Recording completed. You can play your audio.";

                audioStream.getTracks().forEach(function (track) {
                    track.stop();
                });

            });

            mediaRecorder.start();

            startRecordingBtn.disabled = true;
            stopRecordingBtn.disabled = false;

            recordingStatus.textContent = "Recording in progress...";

            recordingInterval = setInterval(function () {

                recordingSeconds++;

                const minutes = Math.floor(recordingSeconds / 60);
                const seconds = recordingSeconds % 60;

                recordingTimer.textContent =
                    String(minutes).padStart(2, "0") + ":" +
                    String(seconds).padStart(2, "0");

            }, 1000);

        } catch (error) {

            recordingStatus.textContent =
                "Microphone access failed. Please allow microphone permission.";

            console.error("Recording error:", error);

        }

    });

    // Stop recording
    stopRecordingBtn.addEventListener("click", function () {

        if (mediaRecorder && mediaRecorder.state === "recording") {

            mediaRecorder.stop();

            clearInterval(recordingInterval);

            startRecordingBtn.disabled = false;
            stopRecordingBtn.disabled = true;

        }

    });

}
// End of recording functionality

// ========================================
// WEEK 2 - TASK 2: AUDIO FILE UPLOAD
// ========================================

const audioFileInput = document.getElementById("audioFile");
const uploadStatus = document.getElementById("uploadStatus");
const uploadedAudioPlayback =
    document.getElementById("uploadedAudioPlayback");

let uploadedAudioURL = null;

audioFileInput.addEventListener("change", function () {

    const selectedFile = audioFileInput.files[0];

    if (!selectedFile) {
        return;
    }

    // Check whether the selected file is audio
    if (!selectedFile.type.startsWith("audio/")) {

        uploadStatus.textContent =
            "Invalid file. Please select an audio file.";

        audioFileInput.value = "";
        uploadedAudioPlayback.hidden = true;

        return;
    }

    // Release the previous preview URL, if any
    if (uploadedAudioURL) {
        URL.revokeObjectURL(uploadedAudioURL);
    }

    // Create a temporary URL for the selected audio
    uploadedAudioURL = URL.createObjectURL(selectedFile);

    uploadedAudioPlayback.src = uploadedAudioURL;
    uploadedAudioPlayback.hidden = false;

    uploadStatus.textContent =
        "Selected file: " + selectedFile.name;

});

// ========================================
// WEEK 2 - TASK 3: TRANSCRIPT PREVIEW
// ========================================

const transcriptText =
    document.getElementById("transcriptText");

const characterCount =
    document.getElementById("characterCount");

const clearTranscriptBtn =
    document.getElementById("clearTranscriptBtn");

const saveTranscriptBtn =
    document.getElementById("saveTranscriptBtn");

const transcriptMessage =
    document.getElementById("transcriptMessage");


// Update character count when patient types
transcriptText.addEventListener("input", function () {

    characterCount.textContent =
        "Characters: " + transcriptText.value.length;

});


// Clear transcript
clearTranscriptBtn.addEventListener("click", function () {

    transcriptText.value = "";

    characterCount.textContent = "Characters: 0";

    transcriptMessage.textContent =
        "Transcript cleared.";

});


// Save transcript in browser storage
saveTranscriptBtn.addEventListener("click", function () {

    const transcript = transcriptText.value.trim();

    if (transcript === "") {

        transcriptMessage.textContent =
            "Please enter or review a transcript before saving.";

        return;
    }

    localStorage.setItem(
        "medikiosk_transcript_v1",
        transcript
    );

    transcriptMessage.textContent =
        "Transcript saved successfully.";

});


// Reload previously saved transcript
const savedTranscript = localStorage.getItem(
    "medikiosk_transcript_v1"
);

if (savedTranscript) {

    transcriptText.value = savedTranscript;

    characterCount.textContent =
        "Characters: " + savedTranscript.length;

}

// ========================================
// WEEK 2 - TASK 4: TRANSCRIPT REVIEW
// ========================================

const confirmTranscriptBtn =
    document.getElementById("confirmTranscriptBtn");

const reviewStatus =
    document.getElementById("reviewStatus");


// Confirm the transcript
confirmTranscriptBtn.addEventListener("click", function () {

    const transcript = transcriptText.value.trim();

    if (transcript === "") {

        reviewStatus.textContent =
            "Please enter a transcript before confirming.";

        return;
    }

    // Save the confirmed transcript
    localStorage.setItem(
        "medikiosk_confirmed_transcript_v1",
        transcript
    );

    reviewStatus.textContent =
        "Transcript reviewed and confirmed successfully.";

    confirmTranscriptBtn.textContent = "Transcript Confirmed";

    confirmTranscriptBtn.disabled = true;

});


// If a previously confirmed transcript exists,
// show its confirmation status when the page opens.
const previouslyConfirmedTranscript =
    localStorage.getItem("medikiosk_confirmed_transcript_v1");

if (previouslyConfirmedTranscript &&
    previouslyConfirmedTranscript === transcriptText.value.trim()) {

    reviewStatus.textContent =
        "This transcript was previously confirmed.";

    confirmTranscriptBtn.textContent = "Transcript Confirmed";

    confirmTranscriptBtn.disabled = true;

}

// WEEK 2 TASK 5: AUDIO PROCESSING STATUS

const processingStatus = document.getElementById("processingStatus");
const processingMessage = document.getElementById("processingMessage");
const processingProgressBar = document.getElementById("processingProgressBar");

const processAudioBtn = document.getElementById("processAudioBtn");
const retryProcessingBtn = document.getElementById("retryProcessingBtn");

function processAudio() {

    // Check whether the user has recorded or uploaded audio
    const hasRecordedAudio = audioPlayback.src !== "";
    const hasUploadedAudio = uploadedAudioPlayback.src !== "";

    if (!hasRecordedAudio && !hasUploadedAudio) {
        processingStatus.textContent = "Error";
        processingMessage.textContent =
            "Please record or upload an audio file before processing.";

        retryProcessingBtn.hidden = false;
        return;
    }

    // Start processing
    processAudioBtn.disabled = true;
    retryProcessingBtn.hidden = true;

    processingStatus.textContent = "Processing...";
    processingMessage.textContent =
        "Your audio is being prepared. Please wait.";

    processingProgressBar.style.width = "0%";

    let progress = 0;

    const processingTimer = setInterval(function () {

        progress += 10;

        processingProgressBar.style.width = progress + "%";

        if (progress >= 100) {

            clearInterval(processingTimer);

            processingStatus.textContent = "Processing Complete";
            processingMessage.textContent =
                "Audio is ready for the speech-to-text stage.";

            processAudioBtn.disabled = false;
            processAudioBtn.textContent = "Process Again";

        }

    }, 300);
}

// Process audio button
processAudioBtn.addEventListener("click", processAudio);

// Retry button
retryProcessingBtn.addEventListener("click", function () {

    processingProgressBar.style.width = "0%";

    processingStatus.textContent = "Ready to retry";
    processingMessage.textContent =
        "You can try processing your audio again.";

    retryProcessingBtn.hidden = true;
    processAudioBtn.disabled = false;

    processAudio();

});
// WEEK 2 TASK 6: TRANSFER CONFIRMED TRANSCRIPT

const useTranscriptBtn = document.getElementById("useTranscriptBtn");
const symptomsField = document.getElementById("symptoms");

// Enable transfer only after confirmation
if (previouslyConfirmedTranscript &&
    previouslyConfirmedTranscript === transcriptText.value.trim()) {
    useTranscriptBtn.disabled = false;
}

// Transfer the confirmed transcript into the symptoms field
useTranscriptBtn.addEventListener("click", function () {

    const currentTranscript = transcriptText.value.trim();
    const confirmedTranscript = localStorage.getItem(
        "medikiosk_confirmed_transcript_v1"
    );

    if (!currentTranscript) {
        alert("Please enter a transcript first.");
        return;
    }

    if (currentTranscript !== confirmedTranscript) {
        alert("Please confirm your transcript before using it.");
        return;
    }

    symptomsField.value = currentTranscript;

    symptomsField.dispatchEvent(
        new Event("input", { bubbles: true })
    );

    alert("Transcript added to the patient symptoms field.");
});
// Open the body
console.log("MediKiosk script.js is connected");