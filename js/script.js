const loginForm = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");
const questionnaireSection = document.getElementById("questionnaireSection");
const patientForm = document.getElementById("patientForm");

const languageSelect = document.getElementById("language");
const loginMessage = document.getElementById("loginMessage");
const formMessage = document.getElementById("formMessage");

const STORAGE_KEY = "medikiosk_patient_draft_v1";


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