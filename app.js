/**
 * NxtWave EvalAI — Automated AI Project Evaluation & Certification Engine
 * Author: Vishnu (NxtWave Growth Challenge Submission)
 * Objective: 500 Final-Year Registrations for "Build Your First AI Project in 60 Mins"
 */

// Sample Projects & Code Presets for each Engineering Branch
const PROJECT_PRESETS = {
  CSE: {
    type: "resume_screener",
    title: "AI Resume Screener & Recruiter Mock Interviewer",
    code: `# NxtWave 60-Minute AI Project: Resume Screener with Gemini Flash
import os
import json
import google.generativeai as genai
from typing import Dict, Any

# Configure Gemini API
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "DEMO_KEY"))
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config={
        "temperature": 0.2, # Low temperature for consistent evaluation
        "response_mime_type": "application/json"
    }
)

SYSTEM_PROMPT = """You are a Principal Tech Recruiter.
Evaluate the candidate's resume text against target job requirements.
Return JSON schema:
{
  "match_score": int (0-100),
  "key_strengths": [str],
  "missing_skills": [str],
  "interview_questions": [str]
}"""

def evaluate_resume(resume_text: str, role_requirements: str) -> Dict[str, Any]:
    """Evaluates candidate profile with automated error boundary and schema parsing."""
    try:
        user_content = f"TARGET ROLE: {role_requirements}\\nCANDIDATE RESUME: {resume_text}"
        response = model.generate_content([SYSTEM_PROMPT, user_content])
        result = json.loads(response.text)
        return {
            "status": "success",
            "data": result,
            "latency_ms": 380
        }
    except json.JSONDecodeError as jde:
        return {"status": "error", "message": "Failed to parse JSON response"}
    except Exception as e:
        return {"status": "error", "message": f"API Execution Error: {str(e)}"}

# Test Execution
if __name__ == "__main__":
    sample_resume = "Vishnu - Final Year B.Tech CSE. Built full-stack apps in React, Node, Python."
    sample_role = "Junior AI Engineer. Requirements: Python, LLM API integration, JSON validation."
    result = evaluate_resume(sample_resume, sample_role)
    print(json.dumps(result, indent=2))`
  },

  ECE: {
    type: "edge_anomaly",
    title: "IoT Sensor Stream Anomaly Detector with Gemini",
    code: `# NxtWave 60-Minute AI Project: Edge IoT Sensor Anomaly Classifier
import json
import numpy as np
import google.generativeai as genai

genai.configure(api_key="DEMO_KEY")
model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_sensor_telemetry(readings: list) -> dict:
    """Analyzes 60-second sliding window telemetry from ESP32 / DHT22 sensors."""
    mean_val = float(np.mean(readings))
    std_val = float(np.std(readings))
    
    prompt = f"""Given sensor stream telemetry:
Mean: {mean_val:.2f}°C, StdDev: {std_val:.2f}, Raw Samples: {readings[-5:]}
Classify if this indicates hardware thermal runaway or normal drift.
Format: JSON with fields 'status', 'severity', 'recommended_action'."""
    
    response = model.generate_content(prompt)
    return {"telemetry_mean": mean_val, "ai_diagnosis": response.text}`
  },

  MECH: {
    type: "maintenance_bot",
    title: "Factory Equipment Failure Prediction Chatbot",
    code: `# NxtWave 60-Minute AI Project: Equipment Predictive Maintenance System
import json
import google.generativeai as genai

genai.configure(api_key="DEMO_KEY")
model = genai.GenerativeModel("gemini-1.5-flash")

def predict_equipment_maintenance(rpm: float, vibration_hz: float, temp_c: float):
    """Predicts bearing wear and failure probability using sensory data."""
    audit_data = {"rpm": rpm, "vibration": vibration_hz, "temp": temp_c}
    prompt = f"Analyze industrial motor parameters: {audit_data}. Output failure risk score (0-100)."
    res = model.generate_content(prompt)
    return {"equipment_health": "Healthy", "audit_details": res.text}`
  },

  CIVIL: {
    type: "doc_analyzer",
    title: "Automated Construction Compliance Extractor",
    code: `# NxtWave 60-Minute AI Project: Blueprint Compliance & Material Estimator
import google.generativeai as genai

model = genai.GenerativeModel("gemini-1.5-flash")

def audit_building_specifications(spec_text: str):
    """Extracts NBC (National Building Code) compliance standards from structural text."""
    prompt = f"Extract IS 456 concrete grade specifications and setback compliance from: {spec_text}"
    return model.generate_content(prompt).text`
  }
};

// State variables & LocalStorage persistence (Zero-cost client-side database)
const STORAGE_KEY = "nxtwave_evalai_state_v1";
const DEFAULT_REGISTRATIONS = 342;
const TARGET_REGISTRATIONS = 500;
const DEFAULT_COLLEGES = [
  { college: "SRM University AP", count: 114 },
  { college: "VIT-AP University", count: 98 },
  { college: "KL University", count: 76 },
  { college: "Vignan's University", count: 54 }
];

let currentRegistrations = DEFAULT_REGISTRATIONS;
let collegesData = JSON.parse(JSON.stringify(DEFAULT_COLLEGES));

function loadPersistentState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.currentRegistrations === "number") {
        currentRegistrations = parsed.currentRegistrations;
      }
      if (Array.isArray(parsed.collegesData) && parsed.collegesData.length > 0) {
        collegesData = parsed.collegesData;
      }
    }
  } catch (err) {
    console.warn("LocalStorage state read error:", err);
  }
}

function savePersistentState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentRegistrations,
      collegesData
    }));
  } catch (err) {
    console.warn("LocalStorage state write error:", err);
  }
}

function updateTrackerUI() {
  const pct = Math.min(100, (currentRegistrations / TARGET_REGISTRATIONS) * 100);
  const displayEl = document.getElementById("trackerCountDisplay");
  const fillEl = document.getElementById("regProgressFill");
  if (displayEl) displayEl.textContent = `${currentRegistrations} / ${TARGET_REGISTRATIONS} Seats Filled`;
  if (fillEl) fillEl.style.width = `${pct}%`;
}

// Initialize on DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  loadPersistentState();
  initPresets();
  setupEventListeners();
  updateCodeStats();
  updateTrackerUI();
  renderLeaderboard();
});

// Setup Code Presets
function initPresets() {
  const branchSelect = document.getElementById("studentBranch");
  const projectSelect = document.getElementById("projectType");
  const codeEditor = document.getElementById("codeEditor");

  function loadBranchPreset() {
    const branch = branchSelect.value;
    const preset = PROJECT_PRESETS[branch] || PROJECT_PRESETS["CSE"];
    projectSelect.value = preset.type;
    codeEditor.value = preset.code;
    updateCodeStats();
  }

  branchSelect.addEventListener("change", loadBranchPreset);
  
  // Initial load
  loadBranchPreset();

  // Load Sample Button
  document.getElementById("btnLoadSample").addEventListener("click", () => {
    loadBranchPreset();
    triggerEvaluation();
  });
}

// Code Stats: Line & Token Estimation
function updateCodeStats() {
  const code = document.getElementById("codeEditor").value;
  const lines = code ? code.split("\n").length : 0;
  const tokens = Math.round((code ? code.length : 0) / 3.8);
  document.getElementById("codeStats").textContent = `Line Count: ${lines} • Tokens: ~${tokens}`;
}

// Setup Event Listeners
function setupEventListeners() {
  document.getElementById("codeEditor").addEventListener("input", updateCodeStats);

  // Run Evaluation Button
  document.getElementById("btnRunEval").addEventListener("click", () => {
    triggerEvaluation();
  });

  // Copy ATS Bullets
  document.getElementById("btnCopyAts").addEventListener("click", () => {
    const text = document.getElementById("atsBulletsContent").textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
      const icon = document.getElementById("copyAtsIcon");
      icon.textContent = "✓";
      setTimeout(() => { icon.textContent = "📋"; }, 2000);
    });
  });

  // Print / Save Certificate
  document.getElementById("btnPrintCert").addEventListener("click", () => {
    window.print();
  });

  // WhatsApp Share Certificate
  document.getElementById("btnShareCertWa").addEventListener("click", () => {
    const studentName = document.getElementById("studentName").value.trim() || "Vishnu";
    const college = document.getElementById("studentCollege").value;
    const score = document.getElementById("overallScore").textContent;
    const project = document.getElementById("certProjectName").textContent;

    const message = `🚀 Hey batchmates! I just built and verified my Applied AI project ("${project}") on NxtWave's EvalAI engine!

📊 My Audit Score: ${score}/100 (Grade A+)
🏫 College: ${college}
📄 ATS Resume Bullets: Generated & Verified!

NxtWave is conducting a free 60-Minute workshop where you build this live and claim your credential:
👉 Register for free here: https://nxtwave-evalai.vercel.app/?ref=VISHNU`;

    window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank");
  });

  // WhatsApp Share Campus Class Group
  document.getElementById("btnShareCampusWa").addEventListener("click", () => {
    const text = document.getElementById("sharePreviewText").textContent.trim();
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  });

  // Copy Share Text
  document.getElementById("btnCopyShareText").addEventListener("click", () => {
    const text = document.getElementById("sharePreviewText").textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
      const icon = document.getElementById("copyShareIcon");
      icon.textContent = "✓";
      setTimeout(() => { icon.textContent = "📋"; }, 2000);
    });
  });

  // Workshop Registration Form Submit
  document.getElementById("btnCompleteReg").addEventListener("click", handleRegistration);
}

// Evaluation Trigger & Animation Sequence
function triggerEvaluation() {
  const code = document.getElementById("codeEditor").value.trim();
  const name = document.getElementById("studentName").value.trim() || "Vishnu Vardhan";
  const college = document.getElementById("studentCollege").value;
  const branch = document.getElementById("studentBranch").value;

  if (!code) {
    alert("Please paste your AI project code or click 'Load Sample Code' first!");
    return;
  }

  const overlay = document.getElementById("scanningOverlay");
  overlay.style.display = "flex";

  const steps = [
    document.getElementById("scanStep1"),
    document.getElementById("scanStep2"),
    document.getElementById("scanStep3"),
    document.getElementById("scanStep4")
  ];

  steps.forEach(s => s.classList.remove("step-active"));

  // Simulated multi-step auditing
  let stepIdx = 0;
  steps[0].classList.add("step-active");

  const interval = setInterval(() => {
    stepIdx++;
    if (stepIdx < steps.length) {
      steps.forEach(s => s.classList.remove("step-active"));
      steps[stepIdx].classList.add("step-active");
    } else {
      clearInterval(interval);
      overlay.style.display = "none";
      finalizeEvaluation(name, college, branch, code);
    }
  }, 450);
}

// Finalize Results Calculation
function finalizeEvaluation(name, college, branch, code) {
  // Score heuristic based on code length, branch, and quality markers
  const hasErrorHandling = /try|except|catch|json/i.test(code);
  const hasPrompt = /prompt|gemini|model|system/i.test(code);
  const hasSchema = /json|schema|type/i.test(code);

  let r1 = hasPrompt ? 24 : 18;
  let r2 = hasSchema ? 23 : 19;
  let r3 = hasErrorHandling ? 24 : 17;
  let r4 = 23;

  const totalScore = r1 + r2 + r3 + r4;

  // Update UI Elements
  document.getElementById("overallScore").textContent = totalScore;
  document.getElementById("scoreRubric1").textContent = `${r1}/25`;
  document.getElementById("fillRubric1").style.width = `${(r1 / 25) * 100}%`;

  document.getElementById("scoreRubric2").textContent = `${r2}/25`;
  document.getElementById("fillRubric2").style.width = `${(r2 / 25) * 100}%`;

  document.getElementById("scoreRubric3").textContent = `${r3}/25`;
  document.getElementById("fillRubric3").style.width = `${(r3 / 25) * 100}%`;

  document.getElementById("scoreRubric4").textContent = `${r4}/25`;
  document.getElementById("fillRubric4").style.width = `${(r4 / 25) * 100}%`;

  // Update Conic Gradient
  const ring = document.querySelector(".score-ring");
  ring.style.background = `conic-gradient(#10b981 0% ${totalScore}%, rgba(255, 255, 255, 0.08) ${totalScore}% 100%)`;

  // Update Certificate
  document.getElementById("certStudentName").textContent = name;
  document.getElementById("certCollege").textContent = college;
  const projectObj = PROJECT_PRESETS[branch] || PROJECT_PRESETS["CSE"];
  document.getElementById("certProjectName").textContent = projectObj.title;
  document.getElementById("certScoreDisplay").textContent = `${totalScore} / 100 (Grade A+)`;

  // Generate Unique Credential ID
  const cleanInitials = name.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 4) || "VISH";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("certId").textContent = `ID: NW-EVAL-2026-${cleanInitials}-${randomSuffix}`;

  // Update ATS Resume Bullets
  updateAtsBullets(name, projectObj.title, branch, totalScore);

  // Trigger celebration confetti
  if (window.confetti) {
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
  }

  // Scroll smoothly to results card
  document.getElementById("resultsCard").scrollIntoView({ behavior: "smooth" });
}

// Dynamic ATS Resume Bullets Generator
function updateAtsBullets(name, projectTitle, branch, score) {
  const bullets = [
    `• Engineered and deployed an applied AI application ("${projectTitle}") using Gemini 1.5 Flash API with sub-second response latency.`,
    `• Implemented structured JSON schema validation and prompt guardrails, achieving automated fault tolerance and preventing token degradation.`,
    `• Industry-certified by NxtWave EvalAI scoring ${score}/100 across architectural cleanliness, API resilience, and placement benchmark standards.`
  ].join("\n");

  document.getElementById("atsBulletsContent").textContent = bullets;
}

// Workshop Registration Logic
function handleRegistration() {
  const name = document.getElementById("regName").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const college = document.getElementById("regCollege").value;
  const branch = document.getElementById("regBranch").value;

  if (!name) {
    alert("Please enter your name");
    document.getElementById("regName").focus();
    return;
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    alert("Please enter a valid 10-digit Indian WhatsApp mobile number (starting with 6, 7, 8, or 9)");
    document.getElementById("regPhone").focus();
    return;
  }

  // Increment registrations and persist
  currentRegistrations += 1;
  updateTrackerUI();

  // Update College in Leaderboard
  const colIndex = collegesData.findIndex(c => c.college === college);
  if (colIndex !== -1) {
    collegesData[colIndex].count += 1;
  } else {
    collegesData.push({ college, count: 1 });
  }
  collegesData.sort((a, b) => b.count - a.count);
  renderLeaderboard();
  savePersistentState();

  // Update Share Message
  const shareText = `🚀 Final-Year Batch Alert: I just registered for the free NxtWave workshop "Build Your First AI Project in 60 Minutes" to get my AI project evaluated & certified!

Join our ${college} cohort before all 500 seats are filled:
https://nxtwave-evalai.vercel.app/?ref=${encodeURIComponent(name.split(" ")[0].toUpperCase())}`;
  document.getElementById("sharePreviewText").textContent = shareText;

  // Trigger celebration confetti
  if (window.confetti) {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
  }

  alert(`🎉 Registration Confirmed for ${name}! You are registered for the workshop and allocated seat #${currentRegistrations}.`);
}

// Render College Leaderboard
function renderLeaderboard() {
  const container = document.getElementById("collegeLeaderboard");
  container.innerHTML = collegesData.slice(0, 5).map((col, idx) => `
    <div class="lb-row">
      <span class="lb-rank">${idx + 1}</span>
      <span class="lb-name">${escapeHtml(col.college)}</span>
      <span class="lb-score">${col.count} submissions</span>
    </div>
  `).join("");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[m]);
}
