// ----- ข้อมูล routine (อัปเดตใหม่) -----
const routines = {
  morning: [
    { id: "cleanser", label: "ล้างหน้า – Whipped Mousse Facial Foam" },
    { id: "oil-matte", label: "OIL MATTE SERUM (ควบคุมความมัน)" },
    { id: "moist", label: "MOISTURIZING GEL (เพิ่มความชุ่มชื้น)" },
    { id: "acne-gel", label: "(ถ้ามีสิวอักเสบ → แต้ม Acne Gel Concentrate)", optional: true },
  ],
  night: [
    { id: "cleanser", label: "ล้างหน้า – Whipped Mousse Facial Foam" },
    { id: "niacinamide", label: "Niacinamide 10% + NAG 8% (เซรั่มใส + คุมมัน)" },
    { id: "essence", label: "Completed Recover Night Essence (ไนท์เอสเซนส์ฟื้นฟูผิว)" },
    { id: "spot", label: "แต้มสิว: Acne Gel Concentrate + Overnight SOS Spot Corrector" },
    { id: "scar", label: "Dragon's Blood Acne Scar Gel (เจลลดรอยสิวหลังสิวแห้ง)" },
  ],
};

let active = "morning";
let checked = {};

const stepsEl = document.getElementById("steps");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// ----- แสดง steps -----
function renderSteps() {
  stepsEl.innerHTML = "";
  const routine = routines[active];
  routine.forEach((step, i) => {
    const div = document.createElement("div");
    div.className = "p-3 bg-pink-100 rounded-xl shadow flex items-center gap-3";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked[step.id] || false;
    checkbox.className = "h-5 w-5 accent-pink-500 cursor-pointer";
    checkbox.addEventListener("change", () => {
      checked[step.id] = checkbox.checked;
      saveState();
      updateProgress();
    });

    const label = document.createElement("label");
    label.textContent = `${i + 1}. ${step.label}`;
    if (step.optional) label.textContent += " (ตัวเลือก)";
    label.className = "flex-1 text-sm";

    div.appendChild(checkbox);
    div.appendChild(label);
    stepsEl.appendChild(div);
  });

  updateProgress();
}

// ----- อัปเดต progress -----
function updateProgress() {
  const routine = routines[active];
  const total = routine.length;
  const done = routine.filter((s) => checked[s.id]).length;
  const pct = Math.round((done / total) * 100);
  progressText.textContent = `${done}/${total} ขั้นตอน · ${pct}%`;
  progressBar.style.width = `${pct}%`;
}

// ----- สลับ routine -----
document.getElementById("morningBtn").addEventListener("click", () => {
  active = "morning";
  saveState();
  renderSteps();
});
document.getElementById("nightBtn").addEventListener("click", () => {
  active = "night";
  saveState();
  renderSteps();
});

// ----- รีเซ็ต -----
document.getElementById("resetBtn").addEventListener("click", () => {
  checked = {};
  saveState();
  renderSteps();
});

// ----- LocalStorage -----
function saveState() {
  localStorage.setItem("routine-state", JSON.stringify({ active, checked }));
}
function loadState() {
  const raw = localStorage.getItem("routine-state");
  if (!raw) return;
  try {
    const { active: a, checked: c } = JSON.parse(raw);
    if (a) active = a;
    if (c) checked = c;
  } catch {}
}

// ----- เริ่มทำงาน -----
loadState();
renderSteps();

// ----- ลงทะเบียน Service Worker สำหรับ PWA -----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("Service Worker registered"))
      .catch((err) => console.log("Service Worker registration failed:", err));
  });
}
