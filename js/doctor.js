
// WEEK 3 TASK 2: DASHBOARD STATISTICS

// Demo patient records

// WEEK 3 TASK 3: DEMO PATIENT RECORDS

const patientCases = [
    {
        patientId: "MK001",
        patientName: "Patient A",
        speciality: "General Medicine",
        submittedDate: "12 Nov 2026",
        status: "pending"
    },
    {
        patientId: "MK002",
        patientName: "Patient B",
        speciality: "Cardiology",
        submittedDate: "11 Nov 2026",
        status: "approved"
    },
    {
        patientId: "MK003",
        patientName: "Patient C",
        speciality: "Dermatology",
        submittedDate: "10 Nov 2026",
        status: "pending"
    },
    {
        patientId: "MK004",
        patientName: "Patient D",
        speciality: "Neurology",
        submittedDate: "09 Nov 2026",
        status: "approved"
    },
    {
        patientId: "MK005",
        patientName: "Patient E",
        speciality: "General Medicine",
        submittedDate: "08 Nov 2026",
        status: "pending"
    }
];


// Calculate total cases
const total = patientCases.length;

// Count pending cases
const pending = patientCases.filter(function(patient) {
    return patient.status === "pending";
}).length;

// Count approved cases
const approved = patientCases.filter(function(patient) {
    return patient.status === "approved";
}).length;

// Display the numbers on the dashboard
document.getElementById("totalCases").textContent = total;

document.getElementById("pendingCases").textContent = pending;

document.getElementById("approvedCases").textContent = approved;

// DISPLAY PATIENT RECORDS IN THE TABLE

const patientTableBody = document.getElementById("patientTableBody");

patientTableBody.innerHTML = patientCases.map(function(patient) {

    return `
        <tr>
            <td>${patient.patientId}</td>
            <td>${patient.patientName}</td>
            <td>${patient.speciality}</td>
            <td>${patient.submittedDate}</td>
            <td>
                <span class="status-badge ${patient.status}">
                    ${patient.status}
                </span>
            </td>
            <td>
                <button class="view-case-btn" type="button"
                    data-patient-id="${patient.patientId}">
                    View Case
                </button>
            </td>
        </tr>
    `;

}).join("");

// WEEK 3 TASK 4: SEARCH AND FILTER PATIENTS

const patientSearch = document.getElementById("patientSearch");
const specialityFilter = document.getElementById("specialityFilter");
const statusFilter = document.getElementById("statusFilter");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");

// Function to display filtered patients
function displayFilteredPatients() {

    const searchValue = patientSearch.value.toLowerCase().trim();
    const selectedSpeciality = specialityFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredPatients = patientCases.filter(function(patient) {

        const matchesSearch =
            patient.patientName.toLowerCase().includes(searchValue) ||
            patient.patientId.toLowerCase().includes(searchValue);

        const matchesSpeciality =
            selectedSpeciality === "all" ||
            patient.speciality === selectedSpeciality;

        const matchesStatus =
            selectedStatus === "all" ||
            patient.status === selectedStatus;

        return matchesSearch && matchesSpeciality && matchesStatus;

    });

    patientTableBody.innerHTML = filteredPatients.map(function(patient) {

        return `
            <tr>
                <td>${patient.patientId}</td>
                <td>${patient.patientName}</td>
                <td>${patient.speciality}</td>
                <td>${patient.submittedDate}</td>
                <td>
                    <span class="status-badge ${patient.status}">
                        ${patient.status}
                    </span>
                </td>
                <td>
                    <button class="view-case-btn" type="button"
                        data-patient-id="${patient.patientId}">
                        View Case
                    </button>
                </td>
            </tr>
        `;

    }).join("");

    // Show message when no records match
    if (filteredPatients.length === 0) {
        patientTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:25px;">
                    No matching patient records found.
                </td>
            </tr>
        `;
    }
}

// Search as the doctor types
patientSearch.addEventListener("input", displayFilteredPatients);

// Filter by speciality
specialityFilter.addEventListener("change", displayFilteredPatients);

// Filter by status
statusFilter.addEventListener("change", displayFilteredPatients);

// Reset all filters
resetFiltersBtn.addEventListener("click", function() {

    patientSearch.value = "";
    specialityFilter.value = "all";
    statusFilter.value = "all";

    displayFilteredPatients();

});

// WEEK 3 TASK 5: DEMO MEDICAL DETAILS

const patientDetails = {

    MK001: {
        age: "35",
        gender: "Female",
        symptoms: "Headache and mild dizziness.",
        duration: "3 days",
        frequency: "Occasional",
        pain: "4/10",
        painType: "Throbbing",
        painEntries: [
    {
        location: "Head",
        intensity: 4,
        type: "Sharp",
        duration: "3 days",
        frequency: "Occasional"
    },
    {
        location: "Neck",
        intensity: 3,
        type: "Aching",
        duration: "2 days",
        frequency: "Occasional"
    }
],
        illness: "No previous illness reported.",
        surgery: "None reported.",
        medication: "None reported.",
        allergies: "No known allergies reported."
    },

    MK002: {
        age: "48",
        gender: "Male",
        symptoms: "Chest discomfort during physical activity.",
        duration: "1 week",
        frequency: "Occasional",
        pain: "5/10",
        painType: "Sharp",
        illness: "Previous high blood pressure reported.",
        surgery: "None reported.",
        medication: "Medication history to be reviewed.",
        allergies: "None reported."
    },

    MK003: {
        age: "26",
        gender: "Female",
        symptoms: "Skin irritation and itching.",
        duration: "5 days",
        frequency: "Frequent",
        pain: "2/10",
        painType: "itching",
        illness: "No previous illness reported.",
        surgery: "None reported.",
        medication: "Topical medication reported.",
        allergies: "Not yet recorded."
    },

    MK004: {
        age: "52",
        gender: "Male",
        symptoms: "Recurring headaches.",
        duration: "2 weeks",
        frequency: "Frequent",
        pain: "6/10",
        painType: "Throbbing",
        illness: "Previous migraine history reported.",
        surgery: "None reported.",
        medication: "Medication history to be reviewed.",
        allergies: "Not yet recorded."
    },

    MK005: {
        age: "31",
        gender: "Female",
        symptoms: "Abdominal discomfort.",
        duration: "2 days",
        frequency: "Occasional",
        pain: "3/10",
        painType: "Sharp",
        illness: "No previous illness reported.",
        surgery: "Previous surgery reported.",
        medication: "None reported.",
        allergies: "No known allergies reported."
        
    }

};


// WEEK 3 TASK 5: OPEN PATIENT CASE

const caseModal = document.getElementById("caseModal");

function openPatientCase(patientId) {

    const patient = patientCases.find(function(item) {
        return item.patientId === patientId;
    });

    const details = patientDetails[patientId];

    if (!patient || !details) {
        alert("Patient record not found.");
        return;
    }

    document.getElementById("detailPatientId").textContent = patient.patientId;
    document.getElementById("detailPatientName").textContent = patient.patientName;
    document.getElementById("detailAge").textContent = details.age;
    document.getElementById("detailGender").textContent = details.gender;
    document.getElementById("detailSpeciality").textContent = patient.speciality;
    document.getElementById("detailDate").textContent = patient.submittedDate;

    document.getElementById("detailSymptoms").textContent = details.symptoms;
    document.getElementById("detailDuration").textContent = details.duration;
    document.getElementById("detailFrequency").textContent = details.frequency;
    document.getElementById("detailPain").textContent = details.pain;

    // WEEK 4 TASK 2: DISPLAY PAIN INFORMATION

    const painIntensity = parseInt(details.pain, 10);

    let painSeverity = "Not recorded";

    if (Number.isFinite(painIntensity) && details.pain !== "" && details.pain !== null) {
        if (painIntensity === 0) {
            painSeverity = "No pain";
        } else if (painIntensity <= 3) {
            painSeverity = "Mild";
        } else if (painIntensity <= 6) {
            painSeverity = "Moderate";
        } else if (painIntensity <= 8) {
            painSeverity = "Severe";
        } else if (painIntensity <= 10) {
            painSeverity = "Very severe";
        }
    }

    document.getElementById("doctorPainIntensity").textContent =
        details.pain !== undefined && details.pain !== "" && details.pain !== null
            ? details.pain
            : "Not recorded";

    document.getElementById("doctorPainSeverity").textContent = painSeverity;

    document.getElementById("doctorPainType").textContent =
        details.painType || "Not recorded";

    document.getElementById("doctorPainDuration").textContent =
        details.duration || "Not recorded";

    document.getElementById("doctorPainFrequency").textContent =
        details.frequency || "Not recorded";
        // Display multiple pain entries

const painEntriesContainer = document.getElementById("doctorPainEntries");

painEntriesContainer.replaceChildren();

if (details.painEntries && details.painEntries.length > 0) {

    details.painEntries.forEach(function(entry) {

        const card = document.createElement("div");
        card.className = "doctor-pain-entry";

        card.innerHTML = `
            <h4>${entry.location}</h4>
            <p>Intensity: ${entry.intensity}/10</p>
            <p>Pain type: ${entry.type}</p>
            <p>Duration: ${entry.duration}</p>
            <p>Frequency: ${entry.frequency}</p>
        `;

        painEntriesContainer.appendChild(card);
    });

} else {
    painEntriesContainer.textContent = "No additional pain locations recorded.";
}


    document.getElementById("detailIllness").textContent = details.illness;
    document.getElementById("detailSurgery").textContent = details.surgery;
    document.getElementById("detailMedication").textContent = details.medication;
    document.getElementById("detailAllergies").textContent = details.allergies;

    caseModal.hidden = false;
}


// Handle View Case button clicks
patientTableBody.addEventListener("click", function(event) {

    const button = event.target.closest(".view-case-btn");

    if (!button) return;

    const patientId = button.dataset.patientId;

    openPatientCase(patientId);

});


// CLOSE CASE WINDOW

function closePatientCase() {
    caseModal.hidden = true;
}

document.getElementById("closeCaseBtn").addEventListener("click", closePatientCase);

document.getElementById("closeCaseFooterBtn").addEventListener("click", closePatientCase);


// Close when clicking outside the case window
caseModal.addEventListener("click", function(event) {

    if (event.target === caseModal) {
        closePatientCase();
    }

});


// Close using Escape key
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape" && !caseModal.hidden) {
        closePatientCase();
    }

});

// WEEK 3 TASK 6: EDIT PATIENT CASE SHEET

let currentPatientId = null;

// Load previously saved demo edits
const savedPatientDetails = localStorage.getItem(
    "medikiosk_doctor_edits_v1"
);

if (savedPatientDetails) {
    try {
        const parsedEdits = JSON.parse(savedPatientDetails);

        Object.keys(parsedEdits).forEach(function(patientId) {
            if (patientDetails[patientId]) {
                Object.assign(patientDetails[patientId], parsedEdits[patientId]);
            }
        });

    } catch (error) {
        console.error("Could not load saved patient edits:", error);
    }
}


// Remember which patient is currently opened
patientTableBody.addEventListener("click", function(event) {

    const button = event.target.closest(".view-case-btn");

    if (button) {
        currentPatientId = button.dataset.patientId;
    }

});


// Get editing form elements
const editCaseBtn = document.getElementById("editCaseBtn");
const editCaseSection = document.getElementById("editCaseSection");
const saveCaseBtn = document.getElementById("saveCaseBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editMessage = document.getElementById("editMessage");


// Open editing form
editCaseBtn.addEventListener("click", function() {

    if (!currentPatientId) return;

    const details = patientDetails[currentPatientId];
    const patient = patientCases.find(function(item) {
        return item.patientId === currentPatientId;
    });

    if (!details || !patient) return;

    // Fill form with existing information
    document.getElementById("editAge").value = details.age;
    document.getElementById("editGender").value = details.gender;
    document.getElementById("editSpeciality").value = patient.speciality;

    document.getElementById("editSymptoms").value = details.symptoms;
    document.getElementById("editDuration").value = details.duration;
    document.getElementById("editFrequency").value = details.frequency;
    document.getElementById("editPain").value = parseInt(details.pain, 10);

    document.getElementById("editIllness").value = details.illness;
    document.getElementById("editSurgery").value = details.surgery;
    document.getElementById("editMedication").value = details.medication;
    document.getElementById("editAllergies").value = details.allergies;

    editMessage.textContent = "";

    // Show editing form and hide read-only details
    document.querySelector(".case-details").hidden = true;
    editCaseSection.hidden = false;

    editCaseBtn.hidden = true;

});


// Save updated patient information
saveCaseBtn.addEventListener("click", function() {

    if (!currentPatientId) return;

    const age = Number(document.getElementById("editAge").value);
    const pain = Number(document.getElementById("editPain").value);

    if (!Number.isInteger(age) || age < 0 || age > 120) {
        editMessage.textContent = "Please enter a valid age between 0 and 120.";
        return;
    }

    if (!Number.isFinite(pain) || pain < 0 || pain > 10) {
        editMessage.textContent = "Please enter a pain level between 0 and 10.";
        return;
    }

    const details = patientDetails[currentPatientId];

    // Update patient details
    details.age = String(age);
    details.gender = document.getElementById("editGender").value;
    details.symptoms = document.getElementById("editSymptoms").value.trim();
    details.duration = document.getElementById("editDuration").value.trim();
    details.frequency = document.getElementById("editFrequency").value.trim();
    details.pain = pain + "/10";

    details.illness = document.getElementById("editIllness").value.trim();
    details.surgery = document.getElementById("editSurgery").value.trim();
    details.medication = document.getElementById("editMedication").value.trim();
    details.allergies = document.getElementById("editAllergies").value.trim();

    // Update speciality in the patient list
    const patient = patientCases.find(function(item) {
        return item.patientId === currentPatientId;
    });

    patient.speciality = document.getElementById("editSpeciality").value;

    // Save changes in browser storage
    localStorage.setItem(
        "medikiosk_doctor_edits_v1",
        JSON.stringify(patientDetails)
    );

    // Refresh the patient list
    displayFilteredPatients();

    // Show updated case details
    document.querySelector(".case-details").hidden = false;
    editCaseSection.hidden = true;
    editCaseBtn.hidden = false;

    openPatientCase(currentPatientId);

    alert("Patient case updated successfully.");

});


// Cancel editing without saving
cancelEditBtn.addEventListener("click", function() {

    editCaseSection.hidden = true;
    document.querySelector(".case-details").hidden = false;

    editCaseBtn.hidden = false;

    editMessage.textContent = "";

});

// WEEK 3 TASK 7: DOCTOR CASE APPROVAL AND REJECTION

const approveCaseBtn = document.getElementById("approveCaseBtn");
const rejectCaseBtn = document.getElementById("rejectCaseBtn");
const caseActionMessage = document.getElementById("caseActionMessage");


// 1. Restore previously saved case decisions
const savedCaseStatuses = localStorage.getItem(
    "medikiosk_case_statuses_v1"
);

if (savedCaseStatuses) {
    try {
        const savedStatuses = JSON.parse(savedCaseStatuses);

        savedStatuses.forEach(function(savedCase) {
            const patient = patientCases.find(function(item) {
                return item.patientId === savedCase.patientId;
            });

            if (patient) {
                patient.status = savedCase.status;
                patient.rejectionReason = savedCase.rejectionReason || "";
            }
        });

    } catch (error) {
        console.error("Could not load saved case statuses:", error);
    }
}


// 2. Update dashboard statistics
function updateCaseStatistics() {

    const total = patientCases.length;

    const pending = patientCases.filter(function(patient) {
        return patient.status === "pending";
    }).length;

    const approved = patientCases.filter(function(patient) {
        return patient.status === "approved";
    }).length;

    document.getElementById("totalCases").textContent = total;
    document.getElementById("pendingCases").textContent = pending;
    document.getElementById("approvedCases").textContent = approved;
}


// 3. Save all case decisions in browser storage
function saveCaseStatuses() {

    const statusData = patientCases.map(function(patient) {
        return {
            patientId: patient.patientId,
            status: patient.status,
            rejectionReason: patient.rejectionReason || ""
        };
    });

    localStorage.setItem(
        "medikiosk_case_statuses_v1",
        JSON.stringify(statusData)
    );
}


// 4. Approve a patient case
approveCaseBtn.addEventListener("click", function() {

    if (!currentPatientId) {
        alert("Please open a patient case first.");
        return;
    }

    const patient = patientCases.find(function(item) {
        return item.patientId === currentPatientId;
    });

    if (!patient) return;

    const confirmed = confirm(
        "Are you sure you want to approve this patient case?"
    );

    if (!confirmed) return;

    patient.status = "approved";
    patient.rejectionReason = "";

    saveCaseStatuses();
    displayFilteredPatients();
    updateCaseStatistics();

    caseActionMessage.textContent =
        "Patient case " + patient.patientId + " has been approved.";

    alert("Patient case approved successfully.");

});


// 5. Reject a patient case
rejectCaseBtn.addEventListener("click", function() {

    if (!currentPatientId) {
        alert("Please open a patient case first.");
        return;
    }

    const patient = patientCases.find(function(item) {
        return item.patientId === currentPatientId;
    });

    if (!patient) return;

    const reason = prompt(
        "Enter the reason for rejecting this patient case:"
    );

    // Cancel was clicked
    if (reason === null) return;

    // Do not accept an empty reason
    if (reason.trim() === "") {
        alert("Please enter a rejection reason.");
        return;
    }

    patient.status = "rejected";
    patient.rejectionReason = reason.trim();

    saveCaseStatuses();
    displayFilteredPatients();
    updateCaseStatistics();

    caseActionMessage.textContent =
        "Patient case " + patient.patientId +
        " has been rejected. Reason: " + patient.rejectionReason;

    alert("Patient case rejected.");

});


// 6. Refresh the table and statistics after loading saved decisions
displayFilteredPatients();
updateCaseStatistics();

// WEEK 3 TASK 8: GENERATE PATIENT CASE PDF

const downloadCasePdfBtn = document.getElementById("downloadCasePdfBtn");
const printCaseSheet = document.getElementById("printCaseSheet");


// Convert special characters safely before inserting patient data
function escapePdfText(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// Generate the printable case sheet
downloadCasePdfBtn.addEventListener("click", function() {

    if (!currentPatientId) {
        alert("Please open a patient case first.");
        return;
    }

    const patient = patientCases.find(function(item) {
        return item.patientId === currentPatientId;
    });

    const details = patientDetails[currentPatientId];

    if (!patient || !details) {
        alert("Patient record not found.");
        return;
    }

    // Prepare the patient information
    printCaseSheet.innerHTML = `
        <h1>MediKiosk</h1>
        <p>Patient Case Sheet</p>

        <h2>Patient Information</h2>

        <p><strong>Patient ID:</strong> ${escapePdfText(patient.patientId)}</p>
        <p><strong>Patient Name:</strong> ${escapePdfText(patient.patientName)}</p>
        <p><strong>Age:</strong> ${escapePdfText(details.age)}</p>
        <p><strong>Gender:</strong> ${escapePdfText(details.gender)}</p>
        <p><strong>Speciality:</strong> ${escapePdfText(patient.speciality)}</p>
        <p><strong>Submitted Date:</strong> ${escapePdfText(patient.submittedDate)}</p>

        <h2>Symptoms and Pain Information</h2>

        <p><strong>Symptoms:</strong> ${escapePdfText(details.symptoms)}</p>
        <p><strong>Duration:</strong> ${escapePdfText(details.duration)}</p>
        <p><strong>Frequency:</strong> ${escapePdfText(details.frequency)}</p>
        <p><strong>Pain Level:</strong> ${escapePdfText(details.pain)}</p>
        <h2>Pain Details</h2>

<p><strong>Pain Intensity:</strong> ${escapePdfText(details.pain)}</p>
<p><strong>Pain Type:</strong> ${escapePdfText(details.painType || "Not recorded")}</p>
<p><strong>Pain Duration:</strong> ${escapePdfText(details.duration)}</p>
<p><strong>Pain Frequency:</strong> ${escapePdfText(details.frequency)}</p>

<h3>Reported Pain Locations</h3>
${
    details.painEntries && details.painEntries.length > 0
        ? details.painEntries.map(function(entry) {
            return `
                <div>
                    <p><strong>Location:</strong> ${escapePdfText(entry.location)}</p>
                    <p><strong>Intensity:</strong> ${escapePdfText(entry.intensity)}/10</p>
                    <p><strong>Type:</strong> ${escapePdfText(entry.type)}</p>
                    <p><strong>Duration:</strong> ${escapePdfText(entry.duration)}</p>
                    <p><strong>Frequency:</strong> ${escapePdfText(entry.frequency)}</p>
                </div>
            `;
        }).join("")
        : "<p>No additional pain locations recorded.</p>"
}
        <h2>Medical History</h2>

        <p><strong>Previous Illnesses:</strong> ${escapePdfText(details.illness)}</p>
        <p><strong>Previous Surgeries:</strong> ${escapePdfText(details.surgery)}</p>
        <p><strong>Medications:</strong> ${escapePdfText(details.medication)}</p>
        <p><strong>Allergies:</strong> ${escapePdfText(details.allergies)}</p>

        <h2>Doctor Review</h2>

        <p><strong>Case Status:</strong> ${escapePdfText(patient.status)}</p>
        <p><strong>Rejection Reason:</strong> ${escapePdfText(patient.rejectionReason || "Not applicable")}</p>

        <div class="pdf-footer">
            Generated using MediKiosk on ${escapePdfText(new Date().toLocaleDateString())}.
            <br>
            This document contains patient-reported information for doctor review.
        </div>
    `;

    // Open the browser print dialog
    window.print();

});

