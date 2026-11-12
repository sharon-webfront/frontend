
import * as THREE from "three";

const viewer = document.getElementById("bodyViewer");
const loadingMessage = document.getElementById("loadingMessage");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#edf5f6");

const camera = new THREE.PerspectiveCamera(
    45,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    100
);

camera.position.set(0, 1.5, 7);
camera.lookAt(0, 0.85, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
viewer.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(4, 6, 5);
scene.add(light);

const bodyGroup = new THREE.Group();
scene.add(bodyGroup);

let bodyParts = [];
let selectedRegions = new Set();
let painEntries = [];

let isDragging = false;
let pointerMoved = false;
let previousX = 0;
let previousY = 0;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const normalMaterial = new THREE.MeshStandardMaterial({
    color: "#c99578",
    roughness: 0.75
});

const selectedMaterial = new THREE.MeshStandardMaterial({
    color: "#e53935",
    roughness: 0.7
});

function addPart(name, geometry, position) {
    const mesh = new THREE.Mesh(geometry, normalMaterial.clone());
    mesh.position.set(position.x, position.y, position.z);
    mesh.userData.region = name;

    bodyGroup.add(mesh);
    bodyParts.push(mesh);
    return mesh;
}

function addCapsule(name, start, end, radius) {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(b, a);
    const length = direction.length();

    const geometry = new THREE.CapsuleGeometry(
        radius,
        Math.max(length - radius * 2, 0.01),
        6,
        12
    );

    const mesh = addPart(
        name,
        geometry,
        {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2,
            z: (a.z + b.z) / 2
        }
    );

    mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
    );
}

function createHumanBody(gender) {
    bodyGroup.clear();
    bodyParts = [];
    selectedRegions.clear();

    const isFemale = gender === "female";

    // Head and neck
    addPart(
        "Head",
        new THREE.SphereGeometry(0.34, 24, 24),
        { x: 0, y: 2.75, z: 0 }
    );

    addCapsule("Neck", [0, 2.35, 0], [0, 2.55, 0], 0.13);

    // Upper body
    addPart(
        "Chest",
        new THREE.SphereGeometry(1, 24, 24),
        { x: 0, y: 1.85, z: 0 }
    ).scale.set(isFemale ? 0.53 : 0.62, 0.55, 0.32);

    addPart(
        "Abdomen",
        new THREE.SphereGeometry(1, 24, 24),
        { x: 0, y: 1.15, z: 0 }
    ).scale.set(0.42, 0.5, 0.29);

    addPart(
        "Pelvis",
        new THREE.SphereGeometry(1, 24, 24),
        { x: 0, y: 0.65, z: 0 }
    ).scale.set(isFemale ? 0.52 : 0.43, 0.32, 0.3);

    // Arms
    for (const side of [-1, 1]) {
        const label = side === -1 ? "Left" : "Right";

        addCapsule(
            `${label} Upper Arm`,
            [side * 0.53, 2.1, 0],
            [side * 0.85, 1.48, 0],
            0.15
        );

        addCapsule(
            `${label} Forearm`,
            [side * 0.85, 1.48, 0],
            [side * 1.03, 0.85, 0],
            0.11
        );

        addPart(
            `${label} Hand`,
            new THREE.SphereGeometry(0.13, 16, 16),
            { x: side * 1.04, y: 0.72, z: 0 }
        );

        // Legs
        addCapsule(
            `${label} Thigh`,
            [side * 0.22, 0.55, 0],
            [side * 0.25, -0.45, 0],
            0.2
        );

        addCapsule(
            `${label} Lower Leg`,
            [side * 0.25, -0.45, 0],
            [side * 0.25, -1.45, 0],
            0.13
        );

        addPart(
            `${label} Foot`,
            new THREE.SphereGeometry(0.18, 16, 16),
            { x: side * 0.25, y: -1.55, z: 0.13 }
        ).scale.set(0.8, 0.5, 1.5);
    }
}

function updatePainDescription() {
    const value = Number(
        document.getElementById("painIntensity").value
    );

    document.getElementById("painValue").textContent = value;

    let description = "No pain";

    if (value >= 1 && value <= 3) description = "Mild pain";
    else if (value <= 6 && value >= 4) description = "Moderate pain";
    else if (value <= 8 && value >= 7) description = "Severe pain";
    else if (value >= 9) description = "Very severe pain";

    document.getElementById("painDescription").textContent =
        description;
}

document.getElementById("painIntensity")
    .addEventListener("input", updatePainDescription);

function updateSelectedText() {
    const names = [...selectedRegions];

    document.getElementById("selectedRegion").textContent =
        names.length
            ? "Selected areas: " + names.join(", ")
            : "Selected areas: None";
}

function selectBodyPart(event) {
    if (pointerMoved) return;

    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(bodyParts, false);

    if (hits.length === 0) return;

    const mesh = hits[0].object;
    const region = mesh.userData.region;

    if (selectedRegions.has(region)) {
        selectedRegions.delete(region);
        mesh.material.color.set("#c99578");
    } else {
        selectedRegions.add(region);
        mesh.material.color.set("#e53935");
    }

    updateSelectedText();
}

renderer.domElement.addEventListener("pointerdown", (event) => {
    isDragging = true;
    pointerMoved = false;
    previousX = event.clientX;
    previousY = event.clientY;
    renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previousX;
    const deltaY = event.clientY - previousY;

    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        pointerMoved = true;
    }

    bodyGroup.rotation.y += deltaX * 0.01;
    bodyGroup.rotation.x += deltaY * 0.005;

    bodyGroup.rotation.x = Math.max(
        -0.5,
        Math.min(0.5, bodyGroup.rotation.x)
    );

    previousX = event.clientX;
    previousY = event.clientY;
});

renderer.domElement.addEventListener("pointerup", (event) => {
    isDragging = false;
    selectBodyPart(event);
});

renderer.domElement.addEventListener("pointercancel", () => {
    isDragging = false;
});

renderer.domElement.addEventListener("wheel", (event) => {
    event.preventDefault();

    camera.position.z += event.deltaY * 0.003;
    camera.position.z = Math.max(4, Math.min(10, camera.position.z));
}, { passive: false });

document.getElementById("maleBtn").addEventListener("click", () => {
    createHumanBody("male");
    document.getElementById("maleBtn").classList.add("active");
    document.getElementById("femaleBtn").classList.remove("active");
    updateSelectedText();
});

document.getElementById("femaleBtn").addEventListener("click", () => {
    createHumanBody("female");
    document.getElementById("femaleBtn").classList.add("active");
    document.getElementById("maleBtn").classList.remove("active");
    updateSelectedText();
});

document.getElementById("rotateLeftBtn").addEventListener("click", () => {
    bodyGroup.rotation.y -= 0.35;
});

document.getElementById("rotateRightBtn").addEventListener("click", () => {
    bodyGroup.rotation.y += 0.35;
});

document.getElementById("resetViewBtn").addEventListener("click", () => {
    bodyGroup.rotation.set(0, 0, 0);
    camera.position.set(0, 1.5, 7);
    camera.lookAt(0, 0.85, 0);
});

document.getElementById("zoomInBtn").addEventListener("click", () => {
    camera.position.z = Math.max(4, camera.position.z - 0.5);
});

document.getElementById("zoomOutBtn").addEventListener("click", () => {
    camera.position.z = Math.min(10, camera.position.z + 0.5);
});

document.getElementById("addPainBtn").addEventListener("click", () => {
    if (selectedRegions.size === 0) {
        alert("Please select at least one body area.");
        return;
    }

    const intensity = Number(
        document.getElementById("painIntensity").value
    );

    const entry = {
        regions: [...selectedRegions],
        intensity,
        type: document.getElementById("painType").value,
        duration: document.getElementById("painDuration").value,
        frequency: document.getElementById("painFrequency").value
    };

    painEntries.push(entry);
    selectedRegions.clear();

    bodyParts.forEach((part) => {
        part.material.color.set("#c99578");
    });

    updateSelectedText();
    renderPainList();
});

function renderPainList() {
    const list = document.getElementById("painLocationList");
    list.innerHTML = "";

    painEntries.forEach((entry, index) => {
        const li = document.createElement("li");

        li.textContent =
            `${entry.regions.join(", ")} — Pain ${entry.intensity}/10, ` +
            `${entry.type}, ${entry.duration}, ${entry.frequency} `;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            painEntries.splice(index, 1);
            renderPainList();
        });

        li.appendChild(removeButton);
        list.appendChild(li);
    });
}

document.getElementById("savePainBtn").addEventListener("click", () => {
    const data = {
        gender: document.getElementById("femaleBtn").classList.contains("active")
            ? "female" : "male",
        locations: painEntries,
        savedAt: new Date().toISOString()
    };

    localStorage.setItem("medikiosk_pain_map_v1", JSON.stringify(data));

    document.getElementById("saveMessage").textContent =
        "Pain details saved successfully!";
});

function resizeViewer() {
    const width = viewer.clientWidth;
    const height = viewer.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

window.addEventListener("resize", resizeViewer);

createHumanBody("male");
loadingMessage.style.display = "none";
updatePainDescription();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
// Return to patient questionnaire
const backToPatientBtn = document.getElementById("backToPatientBtn");

if (backToPatientBtn) {
    backToPatientBtn.addEventListener("click", function() {
        window.location.href = "index.html";
    });
}
