const langToggle = document.getElementById('langToggle');
const musicToggle = document.getElementById('musicToggle');
const bgAudio = document.getElementById('bgAudio');
const body = document.body;

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
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

setInterval(updateCountdown, 1000);
updateCountdown();

function setLanguage(mode) {
  const english = mode === 'en';
  body.classList.toggle('hindi-mode', !english);

  document.querySelectorAll('.english-only').forEach(el => el.classList.toggle('hidden', !english));
  document.querySelectorAll('.hindi-only').forEach(el => el.classList.toggle('hidden', english));

  langToggle.textContent = english ? 'हि' : 'EN';
  langToggle.setAttribute('aria-label', english ? 'Switch to Hindi' : 'Switch to English');
  musicToggle.setAttribute('aria-label', english ? 'Play music' : 'संगीत चलाएँ');
}

langToggle.addEventListener('click', () => {
  setLanguage(body.classList.contains('hindi-mode') ? 'en' : 'hi');
});

async function tryAutoplay() {
  try {
    await bgAudio.play();
    musicToggle.textContent = '❚❚';
    musicToggle.setAttribute('aria-pressed', 'true');
  } catch (error) {
    musicToggle.textContent = '♫';
    musicToggle.setAttribute('aria-pressed', 'false');
  }
}

musicToggle.addEventListener('click', async () => {
  if (bgAudio.paused) {
    try {
      await bgAudio.play();
      musicToggle.textContent = '❚❚';
      musicToggle.setAttribute('aria-pressed', 'true');
    } catch (error) {}
  } else {
    bgAudio.pause();
    musicToggle.textContent = '♫';
    musicToggle.setAttribute('aria-pressed', 'false');
  }
});

function createCelebration() {
  const symbols = ['✿', '❀', '❁', '✦', '❤'];
  for (let i = 0; i < 34; i++) {
    const el = document.createElement('span');
    el.className = 'celebration-flower';
    el.textContent = symbols[i % symbols.length];
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `${-10 - Math.random() * 20}px`;
    el.style.fontSize = `${18 + Math.random() * 16}px`;
    el.style.animationDuration = `${2.4 + Math.random() * 1.6}s`;
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    celebrationLayer.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }
}

function openInvite() {
  openInviteBtn.classList.add('hidden');
  
  // Trigger CSS transform rotateX to flip upwards
  notepadPage.classList.add('open');

  if (bgAudio.paused) {
    tryAutoplay();
  }

  // Wait for the flip animation to finish (0.9s defined in CSS)
  setTimeout(() => {
    document.getElementById('coverStage').style.display = 'none'; 
    createCelebration();
    contentSection.classList.remove('hidden'); 
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, 900);
}

openInviteBtn.addEventListener('click', openInvite);

// Default to Hindi
setLanguage('hi');

let wasPlayingBeforeHide = false;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (!bgAudio.paused) {
      wasPlayingBeforeHide = true;
      bgAudio.pause();
      musicToggle.textContent = '♫';
      musicToggle.setAttribute('aria-pressed', 'false');
    } else {
      wasPlayingBeforeHide = false;
    }
  } else {
    if (wasPlayingBeforeHide) {
      bgAudio.play().then(() => {
        musicToggle.textContent = '❚❚';
        musicToggle.setAttribute('aria-pressed', 'true');
      }).catch(error => {
        console.log("Autoplay blocked upon returning to tab", error);
      });
    }
  }
});
