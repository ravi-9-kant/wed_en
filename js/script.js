// ==========================================
// WEDDING INVITATION INTERACTIVE SCRIPTS
// Ravi Kant & Apurva - 23 & 24 November 2026
// ==========================================

const langToggle = document.getElementById('langToggle');
const musicToggle = document.getElementById('musicToggle');
const bgAudio = document.getElementById('bgAudio');
const body = document.body;

const coverStage = document.getElementById('coverStage');
const openInviteBtn = document.getElementById('openInviteBtn');
const notepadPage = document.getElementById('notepadPage');
const celebrationLayer = document.getElementById('celebrationLayer');
const contentSection = document.getElementById('contentSection');

// Countdown target: 24 Nov 2026 at 18:00 PM (Baraat time)
const dateTarget = new Date('2026-11-24T18:00:00');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function pad(num) {
  return String(num).padStart(2, '0');
}

function updateCountdown() {
  const diff = dateTarget - new Date();

  if (diff <= 0) {
    if (daysEl) daysEl.textContent = '00';
    if (hoursEl) hoursEl.textContent = '00';
    if (minutesEl) minutesEl.textContent = '00';
    if (secondsEl) secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (daysEl) daysEl.textContent = pad(days);
  if (hoursEl) hoursEl.textContent = pad(hours);
  if (minutesEl) minutesEl.textContent = pad(minutes);
  if (secondsEl) secondsEl.textContent = pad(seconds);
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================
// LANGUAGE TOGGLE (HINDI / ENGLISH)
// ==========================================
function setLanguage(mode) {
  const english = mode === 'en';
  body.classList.toggle('hindi-mode', !english);

  document.querySelectorAll('.english-only').forEach(el => el.classList.toggle('hidden', !english));
  document.querySelectorAll('.hindi-only').forEach(el => el.classList.toggle('hidden', english));

  if (langToggle) {
    langToggle.textContent = english ? 'हि' : 'EN';
    langToggle.setAttribute('aria-label', english ? 'Switch to Hindi' : 'Switch to English');
  }
  if (musicToggle) {
    musicToggle.setAttribute('aria-label', english ? 'Play music' : 'संगीत चलाएँ');
  }
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    setLanguage(body.classList.contains('hindi-mode') ? 'en' : 'hi');
  });
}

// Default based on document lang attribute or html
const initialLang = (document.documentElement.lang === 'en' && !body.classList.contains('hindi-mode')) ? 'en' : 'hi';
setLanguage(initialLang);

// ==========================================
// BACKGROUND MUSIC & AUDIO GLOW SYNC
// ==========================================
function updateAudioButtonState(isPlaying) {
  if (isPlaying) {
    musicToggle.textContent = '❚❚';
    musicToggle.setAttribute('aria-pressed', 'true');
    musicToggle.classList.add('playing');
  } else {
    musicToggle.textContent = '♫';
    musicToggle.setAttribute('aria-pressed', 'false');
    musicToggle.classList.remove('playing');
  }
}

async function tryAutoplay() {
  try {
    await bgAudio.play();
    updateAudioButtonState(true);
  } catch (error) {
    updateAudioButtonState(false);
  }
}

musicToggle.addEventListener('click', async () => {
  if (bgAudio.paused) {
    try {
      await bgAudio.play();
      updateAudioButtonState(true);
    } catch (error) {
      updateAudioButtonState(false);
    }
  } else {
    bgAudio.pause();
    updateAudioButtonState(false);
  }
});

let wasPlayingBeforeHide = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (!bgAudio.paused) {
      wasPlayingBeforeHide = true;
      bgAudio.pause();
      updateAudioButtonState(false);
    } else {
      wasPlayingBeforeHide = false;
    }
  } else {
    if (wasPlayingBeforeHide) {
      bgAudio.play().then(() => {
        updateAudioButtonState(true);
      }).catch(error => {
        console.log('Autoplay blocked upon returning to tab', error);
      });
    }
  }
});

// ==========================================
// 3D CELEBRATION SHOWER (MARIGOLD & GOLDEN PARTICLES)
// ==========================================
function createCelebrationBurst() {
  const flowerSymbols = ['❀', '❁', '✿', '🌸'];
  const sparkleSymbols = ['✦', '✨', '★'];
  const isMobile = window.innerWidth < 640;
  const totalCount = isMobile ? 20 : 38;

  for (let i = 0; i < totalCount; i++) {
    const el = document.createElement('div');
    el.className = 'celebration-item';

    const randType = Math.random();
    if (randType < 0.45) {
      // Real Marigold Petal
      el.classList.add('marigold-petal');
      const img = document.createElement('img');
      img.src = 'assets/images/marigold.png';
      img.alt = '';
      el.appendChild(img);
    } else if (randType < 0.75) {
      // Golden Sparkle
      el.classList.add('sparkle-symbol');
      el.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
      el.style.fontSize = `${14 + Math.random() * 14}px`;
    } else {
      // Flower Glyph
      el.classList.add('flower-symbol');
      el.textContent = flowerSymbols[Math.floor(Math.random() * flowerSymbols.length)];
      el.style.fontSize = `${18 + Math.random() * 12}px`;
    }

    const startX = Math.random() * 100;
    const duration = 2.6 + Math.random() * 1.8;
    const delay = Math.random() * 0.7;

    el.style.left = `${startX}vw`;
    el.style.top = `${-20 - Math.random() * 30}px`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;

    celebrationLayer.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, (duration + delay + 0.3) * 1000);
  }
}

// Gentle ambient marigold fall during viewing (lightweight symbols on mobile)
setInterval(() => {
  if (document.hidden || !contentSection || contentSection.classList.contains('hidden')) return;
  const isMobile = window.innerWidth < 640;
  const count = isMobile ? 1 : 2;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'celebration-item flower-symbol';
    el.textContent = ['🌸', '❀', '✿'][Math.floor(Math.random() * 3)];
    el.style.left = `${Math.random() * 92}vw`;
    el.style.top = `-30px`;
    el.style.animationDuration = `${isMobile ? 3.5 : 5 + Math.random() * 2}s`;
    celebrationLayer.appendChild(el);
    setTimeout(() => el.remove(), 5500);
  }
}, 4500);

// ==========================================
// FEATURE 2: INTERACTIVE AKSHAT & PUSHPA ASHIRWAD (BLESSINGS ON TAP)
// ==========================================
const ashirwadContainer = document.getElementById('ashirwadContainer');

function createAshirwadBlessing(clientX, clientY) {
  if (!ashirwadContainer) return;

  // 1. Golden Divine Ripple
  const ripple = document.createElement('div');
  ripple.className = 'ashirwad-ripple';
  ripple.style.left = `${clientX}px`;
  ripple.style.top = `${clientY}px`;
  ashirwadContainer.appendChild(ripple);
  setTimeout(() => ripple.remove(), 800);

  // 2. Akshat (Sacred Yellow/Golden Holy Rice Grains)
  const akshatCount = 5;
  for (let i = 0; i < akshatCount; i++) {
    const grain = document.createElement('div');
    grain.className = 'ashirwad-akshat';
    grain.style.left = `${clientX}px`;
    grain.style.top = `${clientY}px`;

    const angle = (Math.PI * 2 * i) / akshatCount + (Math.random() - 0.5) * 0.7;
    const distance = 35 + Math.random() * 45;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance + 20;
    const rot = -180 + Math.random() * 360;

    grain.style.setProperty('--tx', `${tx}px`);
    grain.style.setProperty('--ty', `${ty}px`);
    grain.style.setProperty('--rot', `${rot}deg`);
    grain.style.animationDelay = `${Math.random() * 0.1}s`;

    ashirwadContainer.appendChild(grain);
    setTimeout(() => grain.remove(), 1700);
  }

  // 3. Pushpa (Sacred Flower Petals)
  const pushpaSymbols = ['🌸', '❀', '✿'];
  const pushpaCount = 3;
  for (let j = 0; j < pushpaCount; j++) {
    const petal = document.createElement('div');
    petal.className = 'ashirwad-pushpa';
    petal.textContent = pushpaSymbols[j % pushpaSymbols.length];
    petal.style.left = `${clientX}px`;
    petal.style.top = `${clientY}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance * 0.6;
    const rot = -90 + Math.random() * 180;

    petal.style.setProperty('--tx', `${tx}px`);
    petal.style.setProperty('--ty', `${ty}px`);
    petal.style.setProperty('--rot', `${rot}deg`);
    petal.style.animationDelay = `${Math.random() * 0.12}s`;

    ashirwadContainer.appendChild(petal);
    setTimeout(() => petal.remove(), 2000);
  }
}

// Mobile-optimized tap blessing (never triggers during swipe/scroll!)
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let lastBlessingTime = 0;

document.addEventListener('touchstart', (e) => {
  if (e.touches && e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const dt = Date.now() - touchStartTime;
  if (dt < 300 && e.changedTouches && e.changedTouches.length === 1) {
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    if (dx < 12 && dy < 12) {
      // Deliberate clean tap, not a scroll!
      const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      if (target && (target.closest('a') || target.closest('button') || target.closest('.venue-map-link'))) return;
      const now = Date.now();
      if (now - lastBlessingTime > 450) {
        lastBlessingTime = now;
        createAshirwadBlessing(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    }
  }
}, { passive: true });

document.addEventListener('click', (e) => {
  // Desktop mouse clicks only (touch clicks already handled by touchend)
  if (e.pointerType === 'touch') return;
  if (e.target.closest('a') || e.target.closest('button')) return;
  const now = Date.now();
  if (now - lastBlessingTime > 400) {
    lastBlessingTime = now;
    createAshirwadBlessing(e.clientX, e.clientY);
  }
});

// ==========================================
// 3D OPENING UNVEIL ANIMATION
// ==========================================
let inviteAlreadyOpened = false;

function openInvite() {
  if (inviteAlreadyOpened) return;
  inviteAlreadyOpened = true;

  if (openInviteBtn) {
    openInviteBtn.style.pointerEvents = 'none';
    openInviteBtn.classList.add('hidden');
  }
  
  if (notepadPage) {
    notepadPage.style.animation = 'none';
    notepadPage.classList.add('opening');
  }

  if (bgAudio && bgAudio.paused) {
    tryAutoplay();
  }

  createCelebrationBurst();

  setTimeout(() => {
    if (coverStage) coverStage.style.display = 'none';
    if (contentSection) {
      contentSection.classList.remove('hidden');
      contentSection.classList.add('revealed');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1000);
}

window.openInvite = openInvite;

if (openInviteBtn) {
  openInviteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openInvite();
  });
  openInviteBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openInvite();
  });
}

// Clicking anywhere on the cover card also opens the invite seamlessly
if (notepadPage) {
  notepadPage.addEventListener('click', () => {
    openInvite();
  });
}

// 3D Tilt for Event Cards on hover (desktop only with fine mouse pointer)
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.card-3d').forEach(card => {
    const inner = card.querySelector('.card-3d-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      if (e.target.closest('.venue-map-link')) {
        inner.style.transform = 'translateY(-3px)';
        return;
      }
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = '';
    });
  });
}

// Explicit reliable Google Map link handler
document.querySelectorAll('.venue-map-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.stopPropagation();
    const href = link.getAttribute('href');
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
      e.preventDefault();
    }
  });
});

// ==========================================
// AMBIENT FESTIVE DIYA SPARKS CANVAS (SILKY 60FPS NO-FLICKER)
// ==========================================
(function initFestiveCanvas() {
  const canvas = document.getElementById('festiveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0;
  let particles = [];
  const isMobile = window.innerWidth < 640;
  const particleCount = isMobile ? 12 : 24;

  let lastW = 0;
  function resize() {
    const newW = window.innerWidth;
    const newH = window.innerHeight;
    // CRUCIAL: Do NOT re-size canvas on mobile URL-bar scroll collapses (prevents white screen flickering!)
    if (!width || Math.abs(newW - lastW) > 20 || Math.abs(newH - height) > 160) {
      width = canvas.width = newW;
      height = canvas.height = newH;
      lastW = newW;
    }
  }
  window.addEventListener('resize', resize);
  resize();

  class SparkleParticle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * (width || window.innerWidth);
      this.y = initial ? Math.random() * (height || window.innerHeight) : (height || window.innerHeight) + 10;
      this.size = 1.0 + Math.random() * 2.2;
      this.speedY = 0.35 + Math.random() * 0.7;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.alpha = 0.15 + Math.random() * 0.55;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
      this.hue = 40 + Math.random() * 15;
    }
    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.3 + this.speedX;
      this.alpha += Math.sin(Date.now() * this.pulseSpeed * 0.01) * 0.012;

      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }
    draw() {
      // High-performance clean draw without expensive shadowBlur filter passes
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 95%, 65%, ${Math.max(0.05, Math.min(0.75, this.alpha))})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new SparkleParticle());
  }

  function animate() {
    if (!document.hidden && width > 0) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
