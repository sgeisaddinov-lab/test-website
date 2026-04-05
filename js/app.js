/* ── motolocs chablais — scroll-driven site ──────────────────────────────── */
"use strict";

const FRAME_COUNT  = 260;          // actual frames on disk
const TOTAL_FRAMES = FRAME_COUNT * 2 - 1; // ping-pong: 1→260→1 = 519 virtual frames
const FRAME_SPEED  = 1.0;          // 1.0 = uses full scroll range
const IMAGE_SCALE  = 0.92;         // portrait contain mode — slight padding

// ── State ─────────────────────────────────────────────────────────────────
const frames = new Array(FRAME_COUNT).fill(null);
let currentFrame = 0;
let loadedCount = 0;
let bgColor = "#0c0b09";
let bgSampleCounter = 0;

// ── DOM refs ──────────────────────────────────────────────────────────────
const loaderEl    = document.getElementById("loader");
const loaderBar   = document.getElementById("loader-bar");
const loaderPct   = document.getElementById("loader-percent");
const canvasWrap  = document.getElementById("canvas-wrap");
const canvas      = document.getElementById("canvas");
const ctx         = canvas.getContext("2d");
const heroSection = document.getElementById("hero");
const scrollContainer = document.getElementById("scroll-container");
const marqueeWrap = null; // marquee removed
const darkOverlay = document.getElementById("dark-overlay");

// ── Canvas resize ─────────────────────────────────────────────────────────
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width  = window.innerWidth  + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.scale(dpr, dpr);
  drawFrame(currentFrame);
}
window.addEventListener("resize", resizeCanvas);

// ── Background color sampling ─────────────────────────────────────────────
function sampleBgColor(img) {
  const offscreen = document.createElement("canvas");
  offscreen.width  = img.naturalWidth;
  offscreen.height = img.naturalHeight;
  const oc = offscreen.getContext("2d");
  oc.drawImage(img, 0, 0);
  const w = img.naturalWidth, h = img.naturalHeight;
  const corners = [
    oc.getImageData(0, 0, 2, 2).data,
    oc.getImageData(w - 2, 0, 2, 2).data,
    oc.getImageData(0, h - 2, 2, 2).data,
    oc.getImageData(w - 2, h - 2, 2, 2).data,
  ];
  let r = 0, g = 0, b = 0;
  corners.forEach(d => { r += d[0]; g += d[1]; b += d[2]; });
  r = Math.round(r / 4); g = Math.round(g / 4); b = Math.round(b / 4);
  bgColor = `rgb(${r},${g},${b})`;
}

// ── Ping-pong index resolver ──────────────────────────────────────────────
// Virtual index 0–190 → forward, 191–380 → reverse
function resolveFrame(virtualIndex) {
  if (virtualIndex < FRAME_COUNT) return virtualIndex;
  return TOTAL_FRAMES - virtualIndex; // mirrors back: 191→190, 192→189 …
}

// ── Draw frame ────────────────────────────────────────────────────────────
function drawFrame(index) {
  const img = frames[resolveFrame(index)];
  if (!img) return;
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  // Portrait video: scale by height (Math.min), fill side bars with sampled bg color
  const scale = Math.min(cw / iw, ch / ih) * IMAGE_SCALE;
  const dw = iw * scale, dh = ih * scale;
  const dx = (cw - dw) / 2, dy = (ch - dh) / 2;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);

  bgSampleCounter++;
  if (bgSampleCounter % 20 === 0 && img) sampleBgColor(img);
}

// ── Frame preloader ───────────────────────────────────────────────────────
function loadFrame(i) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      frames[i] = img;
      loadedCount++;
      const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
      if (loaderBar)  loaderBar.style.width  = pct + "%";
      if (loaderPct)  loaderPct.textContent  = pct + "%";
      resolve();
    };
    img.onerror = () => { loadedCount++; resolve(); };
    img.src = `frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;
  });
}

async function preloadFrames() {
  // Phase 1: first 15 frames for fast first paint
  const phase1 = Array.from({ length: Math.min(15, FRAME_COUNT) }, (_, i) => loadFrame(i));
  await Promise.all(phase1);

  // Draw first frame and start the site
  resizeCanvas();
  drawFrame(0);
  startSite();

  // Phase 2: remaining frames in background
  const phase2 = [];
  for (let i = 15; i < FRAME_COUNT; i++) phase2.push(loadFrame(i));
  await Promise.all(phase2);
}

// ── Lenis smooth scroll ───────────────────────────────────────────────────
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ── Hero entrance ─────────────────────────────────────────────────────────
function animateHeroIn() {
  const tl = gsap.timeline({ delay: 0.3 });
  tl.to(".hero-badge",      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
    .to(".hero-byline",     { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }, "-=0.2")
    .to(".hero-heading",    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
    .to(".hero-tagline",    { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.4")
    .to(".hero-buttons",    { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
    .to(".scroll-indicator",{ opacity: 1, duration: 0.6 }, "-=0.2");
}

// ── Hero → canvas transition (circle-wipe) ────────────────────────────────
function initHeroTransition() {
  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate(self) {
      const p = self.progress;
      // Hero fades out quickly
      heroSection.style.opacity = String(Math.max(0, 1 - p * 18));
      // Canvas reveals via expanding circle
      const wipeProgress = Math.min(1, Math.max(0, (p - 0.01) / 0.07));
      const radius = wipeProgress * 80;
      canvasWrap.style.clipPath = `circle(${radius}% at 50% 50%)`;
    },
  });
}

// ── Frame-to-scroll binding ───────────────────────────────────────────────
function initFrameScroll() {
  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate(self) {
      const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
      const index = Math.min(Math.floor(accelerated * TOTAL_FRAMES), TOTAL_FRAMES - 1);
      if (index !== currentFrame) {
        currentFrame = index;
        requestAnimationFrame(() => drawFrame(currentFrame));
      }
    },
  });
}

// ── Marquee — removed ─────────────────────────────────────────────────────
function initMarquee() {}

// ── Dark overlay (for stats section) ─────────────────────────────────────
function initDarkOverlay(enterPct, leavePct) {
  const enter = enterPct / 100;
  const leave = leavePct / 100;
  const fadeRange = 0.03;
  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate(self) {
      const p = self.progress;
      let opacity = 0;
      if (p >= enter - fadeRange && p < enter)        opacity = (p - (enter - fadeRange)) / fadeRange;
      else if (p >= enter && p < leave)               opacity = 0.9;
      else if (p >= leave && p <= leave + fadeRange)  opacity = 0.9 * (1 - (p - leave) / fadeRange);
      darkOverlay.style.opacity = String(opacity);
    },
  });
}

// ── Section animation system ──────────────────────────────────────────────
function positionSection(section) {
  const enter = parseFloat(section.dataset.enter);
  const leave  = parseFloat(section.dataset.leave);
  const midPct = (enter + leave) / 2;
  const scrollH = scrollContainer.scrollHeight;
  section.style.top = (midPct / 100 * scrollH) + "px";
}

function setupSectionAnimation(section) {
  const type    = section.dataset.animation;
  const persist = section.dataset.persist === "true";
  const enter   = parseFloat(section.dataset.enter) / 100;
  const leave   = parseFloat(section.dataset.leave) / 100;

  const children = section.querySelectorAll(
    ".section-label, .section-heading, .section-body, .section-note, .cta-button, .stat"
  );

  // Build entrance timeline
  const tl = gsap.timeline({ paused: true });
  switch (type) {
    case "fade-up":
      tl.from(children, { y: 50, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" });
      break;
    case "slide-left":
      tl.from(children, { x: -80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" });
      break;
    case "slide-right":
      tl.from(children, { x: 80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" });
      break;
    case "scale-up":
      tl.from(children, { scale: 0.85, opacity: 0, stagger: 0.12, duration: 1.0, ease: "power2.out" });
      break;
    case "rotate-in":
      tl.from(children, { y: 40, rotation: 3, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" });
      break;
    case "stagger-up":
      tl.from(children, { y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" });
      break;
    case "clip-reveal":
      tl.from(children, {
        clipPath: "inset(100% 0 0 0)", opacity: 0, stagger: 0.15, duration: 1.2, ease: "power4.inOut",
      });
      break;
    default:
      tl.from(children, { opacity: 0, duration: 0.8 });
  }

  const fadeZone = 0.05;
  let played = false;

  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: false,
    onUpdate(self) {
      const p = self.progress;
      const inRange = p >= enter - fadeZone && p <= leave + fadeZone;

      if (inRange && !played) {
        section.classList.add("is-visible");
        tl.play();
        played = true;
      }

      if (!inRange && played && !persist) {
        tl.reverse();
        played = false;
        setTimeout(() => section.classList.remove("is-visible"), 800);
      }

      // Fade section opacity at edges (not for persist sections)
      if (!persist) {
        let opacity = 1;
        if (p < enter) {
          opacity = Math.max(0, (p - (enter - fadeZone)) / fadeZone);
        } else if (p > leave) {
          opacity = Math.max(0, 1 - (p - leave) / fadeZone);
        }
        section.style.opacity = String(opacity);
      } else if (played) {
        section.classList.add("is-visible");
        section.style.opacity = "1";
      }
    },
  });
}

// ── Counter animations ────────────────────────────────────────────────────
function initCounters() {
  const statSection = document.querySelector(".section-stats");
  const enter = parseFloat(statSection.dataset.enter) / 100;
  let played = false;

  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: false,
    onUpdate(self) {
      if (self.progress >= enter && !played) {
        played = true;
        document.querySelectorAll(".stat-number").forEach(el => {
          const target   = parseFloat(el.dataset.value);
          const decimals = parseInt(el.dataset.decimals || "0");
          const snapVal  = decimals === 0 ? Math.max(1, Math.floor(target / 80)) : 0.01;
          gsap.to(el, {
            textContent: target,
            duration: 2.2,
            ease: "power2.out",
            snap: { textContent: snapVal },
          });
        });
      }
      if (self.progress < enter - 0.02) played = false;
    },
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────
function startSite() {
  // Hide loader
  gsap.to(loaderEl, {
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    onComplete: () => { loaderEl.style.display = "none"; },
  });

  gsap.registerPlugin(ScrollTrigger);
  initLenis();

  // Position sections before setting up scroll triggers
  document.querySelectorAll(".scroll-section").forEach(positionSection);

  animateHeroIn();
  initHeroTransition();
  initFrameScroll();
  initMarquee();
  initDarkOverlay(57, 72); // matches stats section data-enter/leave
  initCounters();

  document.querySelectorAll(".scroll-section").forEach(setupSectionAnimation);

  ScrollTrigger.refresh();
}

// ── Init ──────────────────────────────────────────────────────────────────
preloadFrames();
