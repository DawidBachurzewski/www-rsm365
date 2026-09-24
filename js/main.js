/* RSM365 — main.js
   Nawigacja, pasek postępu, scroll-reveal, liczniki, efekt 3D tilt,
   oś procesu, sloty godzinowe formularza oraz szklana kula-sieć 3D (Three.js). */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- rok w stopce ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- header: stan po przewinięciu + pasek postępu ---------- */
const header = document.querySelector(".site-header");
const progressBar = document.getElementById("scrollProgress");
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    updateProcess();
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- mobilne menu ---------- */
const navToggle = document.getElementById("navToggle");
function setNav(open) {
  header.classList.toggle("nav-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
}
navToggle.addEventListener("click", () => setNav(!header.classList.contains("nav-open")));
document.querySelectorAll(".main-nav a").forEach((link) => link.addEventListener("click", () => setNav(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });
document.addEventListener("click", (e) => {
  if (header.classList.contains("nav-open") && !header.contains(e.target)) setNav(false);
});

/* ---------- aktywny link w menu ---------- */
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]:not(.main-nav__cta)')];
const sectionMap = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
const navIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((l) => l.classList.remove("is-active"));
      const link = sectionMap.get(entry.target.id);
      if (link) link.classList.add("is-active");
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id], .hero").forEach((s) => navIO.observe(s));

/* ---------- scroll reveal z opóźnieniem kaskadowym ---------- */
const revealGroups = [
  ".pain-card", ".service-card", ".pillar", ".process-step", ".diff-card",
  ".industries-list li", ".team-card", ".contact-steps li",
];
const singles = [
  ".section-head", ".cta-band__inner", ".about-copy", ".history-card",
  ".kontakt-copy > h2", ".kontakt-copy > .section-lead", ".booking-form", ".industries__label",
];
revealGroups.forEach((sel) => {
  const items = document.querySelectorAll(sel);
  items.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.matches(sel));
    el.style.setProperty("--i", String(siblings.indexOf(el) % 6));
    el.classList.add("reveal");
  });
});
singles.forEach((sel) => document.querySelectorAll(sel).forEach((el) => el.classList.add("reveal")));

const revealIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealIO.observe(el));

/* ---------- liczniki w hero ---------- */
function countUp(el) {
  const target = Number(el.dataset.count);
  if (prefersReducedMotion) { el.textContent = String(target); return; }
  const duration = 1600;
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(frame);
  }
  el.textContent = "0";
  requestAnimationFrame(frame);
}
setTimeout(() => document.querySelectorAll("[data-count]").forEach(countUp), 650);

/* ---------- efekt 3D tilt + poświata pod kursorem ---------- */
if (finePointer && !prefersReducedMotion) {
  const MAX = 6; // stopnie — subtelnie
  document.querySelectorAll(".tilt").forEach((card) => {
    let raf = null;
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.classList.add("is-tilting");
        card.style.setProperty("--ry", `${(px - 0.5) * MAX * 2}deg`);
        card.style.setProperty("--rx", `${(0.5 - py) * MAX * 2}deg`);
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      });
    });
    card.addEventListener("pointerleave", () => {
      if (raf) cancelAnimationFrame(raf);
      card.classList.remove("is-tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

/* ---------- oś procesu wypełniana podczas przewijania ---------- */
const processEl = document.getElementById("process");
const processFill = document.getElementById("processFill");
const processSteps = processEl ? [...processEl.querySelectorAll(".process-step")] : [];
function updateProcess() {
  if (!processEl) return;
  const r = processEl.getBoundingClientRect();
  const vh = window.innerHeight;
  const p = Math.min(Math.max((vh * 0.8 - r.top) / (r.height + vh * 0.35), 0), 1);
  if (processFill) processFill.parentElement.style.setProperty("--p", p.toFixed(3));
  processSteps.forEach((step, i) => step.classList.toggle("is-active", p >= i / processSteps.length + 0.02));
}
if (prefersReducedMotion && processFill) {
  processFill.parentElement.style.setProperty("--p", "1");
  processSteps.forEach((s) => s.classList.add("is-active"));
}
onScroll();

/* ---------- formularz rezerwacji: dni robocze + sloty godzinowe ---------- */
const dateInput = document.getElementById("f-date");
const timeSelect = document.getElementById("f-time");
const dateHint = document.getElementById("dateHint");

const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 17;
const SLOT_MINUTES = 30;

const pad = (n) => String(n).padStart(2, "0");

function isWeekend(dateStr) {
  if (!dateStr) return false;
  const day = new Date(dateStr + "T00:00:00").getDay(); // 0 = niedziela, 6 = sobota
  return day === 0 || day === 6;
}

function nextWeekday(date) {
  const d = new Date(date);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d;
}

const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function populateTimeSlots() {
  timeSelect.innerHTML = '<option value="" disabled selected>Wybierz godzinę</option>';
  for (let h = BUSINESS_START_HOUR; h < BUSINESS_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      const opt = document.createElement("option");
      opt.value = opt.textContent = `${pad(h)}:${pad(m)}`;
      timeSelect.appendChild(opt);
    }
  }
}
if (timeSelect) populateTimeSlots();

if (dateInput) {
  dateInput.min = toISODate(nextWeekday(new Date()));
  dateInput.value = "";
  dateInput.addEventListener("input", () => {
    if (isWeekend(dateInput.value)) {
      dateHint.textContent = "Wybrany dzień to weekend — wybierz proszę dzień roboczy (pon.–pt.).";
      dateHint.style.color = "#c2410c";
      dateInput.setCustomValidity("Wybierz dzień roboczy (pon.–pt.)");
    } else {
      dateHint.textContent = "Dostępne terminy: poniedziałek–piątek, 9:00–17:00.";
      dateHint.style.color = "";
      dateInput.setCustomValidity("");
    }
  });
}

const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    if (dateInput && isWeekend(dateInput.value)) {
      e.preventDefault();
      dateInput.focus();
    }
  });
}

/* ---------- szklana kula-sieć 3D w hero (Three.js) ---------- */
(async function initOrb() {
  const canvas = document.getElementById("heroCanvas");
  const wrap = canvas && canvas.closest(".hero-visual");
  if (!canvas || !wrap) return;

  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  } catch (err) {
    return; // brak CDN — zostaje statyczna kula CSS
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  } catch (err) {
    return; // brak WebGL — zostaje statyczna kula CSS
  }

  const isSmall = window.innerWidth < 720;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 0, 6.9);

  const root = new THREE.Group();
  root.rotation.set(0.35, 0, -0.18);
  scene.add(root);
  const orb = new THREE.Group();
  root.add(orb);

  const R = 1.6;
  const cViolet = new THREE.Color(0x7c3aed);
  const cBlue = new THREE.Color(0x3b82f6);
  const cTeal = new THREE.Color(0x14b8a6);

  // miękka, okrągła tekstura punktu
  function makeSprite() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.35, "rgba(255,255,255,.85)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const sprite = makeSprite();

  // punkty rozłożone równomiernie (spirala Fibonacciego)
  const N = isSmall ? 150 : 230;
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push(new THREE.Vector3(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R));
  }
  const colorFor = (v) => {
    const t = (v.y / R + 1) / 2;
    return t > 0.5 ? cBlue.clone().lerp(cViolet, (t - 0.5) * 2) : cTeal.clone().lerp(cBlue, t * 2);
  };

  const pGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const pCol = new Float32Array(N * 3);
  pts.forEach((v, i) => { const c = colorFor(v); pCol.set([c.r, c.g, c.b], i * 3); });
  pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.085, map: sprite, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false,
  }));
  orb.add(points);

  // krawędzie: każdy punkt łączymy z 3 najbliższymi sąsiadami
  const edges = [];
  const seen = new Set();
  for (let i = 0; i < N; i++) {
    const d = [];
    for (let j = 0; j < N; j++) if (i !== j) d.push([pts[i].distanceToSquared(pts[j]), j]);
    d.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < 3; k++) {
      const j = d[k][1];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
    }
  }
  const lPos = new Float32Array(edges.length * 6);
  const lCol = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => {
    lPos.set([pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z], k * 6);
    const ca = colorFor(pts[a]); const cb = colorFor(pts[b]);
    lCol.set([ca.r, ca.g, ca.b, cb.r, cb.g, cb.b], k * 6);
  });
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute("position", new THREE.BufferAttribute(lPos, 3));
  lGeo.setAttribute("color", new THREE.BufferAttribute(lCol, 3));
  orb.add(new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.32, depthWrite: false,
  })));

  // szklana powłoka — efekt Fresnela (świecąca krawędź)
  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.965, 64, 64),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uA: { value: cViolet }, uB: { value: cTeal } },
      vertexShader: `
        varying vec3 vN; varying vec3 vV; varying float vY;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          vY = normal.y;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uA; uniform vec3 uB;
        varying vec3 vN; varying vec3 vV; varying float vY;
        void main() {
          float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.4);
          vec3 col = mix(uB, uA, smoothstep(-0.8, 0.8, vY));
          float spec = pow(max(dot(reflect(-normalize(vec3(-0.6, 0.8, 0.6)), vN), vV), 0.0), 24.0);
          float a = f * 0.55 + 0.035 + spec * 0.35;
          gl_FragColor = vec4(mix(col, vec3(1.0), spec * 0.8), a);
        }`,
    })
  );
  orb.add(glass);

  // orbity z satelitami
  const orbits = [];
  function addOrbit(radius, tiltX, tiltZ, color, speed) {
    const g = new THREE.Group();
    g.rotation.set(tiltX, 0, tiltZ);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.005, 6, 220),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.45 })
    );
    g.add(ring);
    const sat = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color, transparent: true, depthWrite: false }));
    sat.scale.setScalar(0.2);
    g.add(sat);
    root.add(g);
    orbits.push({ sat, radius, speed, phase: Math.random() * Math.PI * 2 });
  }
  addOrbit(2.02, Math.PI / 2.3, 0.35, 0x9061f0, 0.35);
  addOrbit(2.28, Math.PI / 1.8, -0.5, 0x2dd4bf, -0.22);

  // impulsy danych biegnące po krawędziach
  const PULSES = isSmall ? 8 : 14;
  const pulses = [];
  for (let i = 0; i < PULSES; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: sprite, color: i % 3 === 0 ? 0xf2994a : 0x14b8a6, transparent: true, depthWrite: false,
    }));
    s.scale.setScalar(0.14);
    orb.add(s);
    pulses.push({ s, e: edges[(Math.random() * edges.length) | 0], t: Math.random(), v: 0.5 + Math.random() * 0.8 });
  }
  const tmp = new THREE.Vector3();

  // rozmiar
  function resize() {
    const w = wrap.clientWidth; const h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(wrap);

  // ruch myszy (parallax)
  let tx = 0, ty = 0;
  if (finePointer) {
    window.addEventListener("pointermove", (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
      ty = (e.clientY / window.innerHeight - 0.5) * 0.35;
    }, { passive: true });
  }

  const clock = new THREE.Clock();
  function step(dt, time) {
    orb.rotation.y += dt * 0.12;
    root.rotation.y += (tx - root.rotation.y) * 0.04;
    root.rotation.x += (0.35 + ty - root.rotation.x) * 0.04;
    orb.position.y = Math.sin(time * 0.8) * 0.05;
    orbits.forEach((o) => {
      const a = o.phase + time * o.speed;
      o.sat.position.set(Math.cos(a) * o.radius, Math.sin(a) * o.radius, 0);
    });
    pulses.forEach((p) => {
      p.t += dt * p.v;
      if (p.t >= 1) {
        const end = p.e[1];
        const next = edges.filter((e) => e[0] === end || e[1] === end);
        const pick = next[(Math.random() * next.length) | 0] || edges[(Math.random() * edges.length) | 0];
        p.e = pick[0] === end ? pick : [pick[1], pick[0]];
        p.t = 0;
      }
      tmp.copy(pts[p.e[0]]).lerp(pts[p.e[1]], p.t);
      p.s.position.copy(tmp);
      p.s.material.opacity = Math.sin(p.t * Math.PI) * 0.95;
    });
  }

  let visible = true;
  let running = false;
  function loop() {
    if (!visible || document.hidden) { running = false; return; }
    running = true;
    const dt = Math.min(clock.getDelta(), 0.05);
    step(dt, clock.elapsedTime);
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  function start() { if (!running && !prefersReducedMotion) { clock.getDelta(); loop(); } }

  if (prefersReducedMotion) {
    step(0, 1.2);
    renderer.render(scene, camera); // jedna statyczna klatka
  } else {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }).observe(wrap);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });
    start();
  }
  wrap.classList.add("is-ready");
})();
