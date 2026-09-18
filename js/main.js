/* RSM365 — main.js
   Nawigacja mobilna, scroll-reveal, generowanie slotów godzinowych
   dla formularza rezerwacji oraz lekka animacja sieci 3D w hero (Three.js). */

/* ---------- rok w stopce ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- mobilne menu ---------- */
const header = document.querySelector(".site-header");
const navToggle = document.getElementById("navToggle");
navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- scroll reveal ---------- */
const revealTargets = document.querySelectorAll(
  ".card, .pillar, .process-step, .diff-card, .industries-list li, .team-card, .history-card"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.01, rootMargin: "0px 0px -20px 0px" }
);
revealTargets.forEach((el) => io.observe(el));

/* ---------- formularz rezerwacji: dni robocze + sloty godzinowe ---------- */
const dateInput = document.getElementById("f-date");
const timeSelect = document.getElementById("f-time");
const dateHint = document.getElementById("dateHint");

const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 17;
const SLOT_MINUTES = 30;

function pad(n) {
  return String(n).padStart(2, "0");
}

function isWeekend(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0 = niedziela, 6 = sobota
  return day === 0 || day === 6;
}

function nextWeekday(date) {
  const d = new Date(date);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function populateTimeSlots() {
  timeSelect.innerHTML = '<option value="" disabled selected>Wybierz godzinę</option>';
  for (let h = BUSINESS_START_HOUR; h < BUSINESS_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      const label = `${pad(h)}:${pad(m)}`;
      const opt = document.createElement("option");
      opt.value = label;
      opt.textContent = label;
      timeSelect.appendChild(opt);
    }
  }
}
populateTimeSlots();

if (dateInput) {
  const today = nextWeekday(new Date());
  dateInput.min = toISODate(today);
  dateInput.value = "";

  dateInput.addEventListener("input", () => {
    if (isWeekend(dateInput.value)) {
      dateHint.textContent =
        "Wybrany dzień to weekend — wybierz proszę dzień roboczy (pon.–pt.).";
      dateHint.style.color = "#c2410c";
      dateInput.setCustomValidity("Wybierz dzień roboczy (pon.–pt.)");
    } else {
      dateHint.textContent = "Dostępne terminy: poniedziałek–piątek, 9:00–17:00.";
      dateHint.style.color = "";
      dateInput.setCustomValidity("");
    }
  });
}

/* ---------- delikatna walidacja przed wysyłką ---------- */
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    if (dateInput && isWeekend(dateInput.value)) {
      e.preventDefault();
      dateInput.focus();
      return;
    }
  });
}

/* ---------- 3D sieć w tle hero (Three.js) ---------- */
(async function initHero3D() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  let THREE;
  try {
    THREE = await import(
      "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
    );
  } catch (err) {
    return; // brak sieci / CDN niedostępne — hero działa bez animacji
  }

  const hero = canvas.closest(".hero");
  let width = hero.clientWidth;
  let height = hero.clientHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.set(0, 0, 9);

  const group = new THREE.Group();
  scene.add(group);

  const NODE_COUNT = 46;
  const RADIUS = 4.4;
  const nodePositions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = RADIUS * (0.55 + Math.random() * 0.45);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    nodePositions.push(new THREE.Vector3(x, y, z));
  }

  const nodeGeometry = new THREE.BufferGeometry().setFromPoints(nodePositions);
  const nodeMaterial = new THREE.PointsMaterial({
    color: 0x9061f0,
    size: 0.09,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(nodeGeometry, nodeMaterial);
  group.add(points);

  const lineVertices = [];
  const MAX_DIST = 2.1;
  for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < MAX_DIST) {
        lineVertices.push(
          nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
          nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
        );
      }
    }
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineVertices, 3)
  );
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x2dd4bf,
    transparent: true,
    opacity: 0.18,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  group.add(lines);

  group.rotation.x = 0.15;

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener("resize", resize);

  let raf;
  function animate() {
    raf = requestAnimationFrame(animate);
    group.rotation.y += 0.0016;
    group.rotation.x += (mouseY * 0.15 - group.rotation.x) * 0.02;
    group.rotation.z += (mouseX * 0.08 - group.rotation.z) * 0.02;
    renderer.render(scene, camera);
  }
  animate();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else animate();
  });
})();
