// Default Password is '1234' - Change this to your preference!
const SYSTEM_PIN = "1234";

function unlockApp() {
    const input = document.getElementById('pin-input').value;
    if (input === SYSTEM_PIN) {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        FlowEngine.updateData();
        speak("Access granted. Welcome back.");
    } else {
        alert("ACCESS DENIED: Biometric Mismatch.");
        document.getElementById('pin-input').value = "";
    }
}

function lockApp() {
    location.reload(); // Quickest way to re-lock the state
}

const FlowEngine = {
    updateData() {
        const lastStart = localStorage.getItem('flow_start') 
            ? new Date(localStorage.getItem('flow_start')) 
            : new Date();
        
        const today = new Date();
        const diffDays = Math.floor((today - lastStart) / (1000 * 60 * 60 * 24)) + 1;
        const phase = diffDays <= 5 ? "menstrual" : "follicular";
        const nextDate = new Date(lastStart.getTime() + (28 * 24 * 60 * 60 * 1000));

        document.getElementById('phase-display').innerText = phase.toUpperCase();
        document.getElementById('next-date').innerText = nextDate.toDateString();
        document.getElementById('orb').className = `phase-${phase}`;
    }
};

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
function startBiometricSync() {
    recognition.start();
    document.getElementById('orb').classList.add('active-sync');
}

recognition.onresult = (event) => {
    const cmd = event.results[0][0].transcript.toLowerCase();
    document.getElementById('orb').classList.remove('active-sync');

    if (cmd.includes("log period") || cmd.includes("started")) {
        localStorage.setItem('flow_start', new Date().toISOString());
        FlowEngine.updateData();
        speak("Biometric sync successful. Cycle logged.");
    }
};

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.pitch = 0.8;
    window.speechSynthesis.speak(msg);
}

window.onload = () => {
    // Check for notification permission early
    if (Notification.permission !== "granted") Notification.requestPermission();
};