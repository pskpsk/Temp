const startDate = new Date('2026-01-01T00:00:00');
const targetDate = new Date('2026-07-05T13:00:00');

let showRemaining = false;

const title = document.getElementById('toggleTitle');
const progressCircle = document.querySelector('.progress-ring-circle');
const progressText = document.getElementById('progressText');
const tickSound = document.getElementById('tickSound');
let soundEnabled = false;

document.body.addEventListener('click', () => {

  if (!soundEnabled) {

    tickSound.play()
      .then(() => {
        tickSound.pause();
        tickSound.currentTime = 0;
        soundEnabled = true;
      })
      .catch(() => {});

  }

}, { once: true });

const radius = 90;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

title.addEventListener('click', () => {

  showRemaining = !showRemaining;

  title.textContent = showRemaining
    ? 'Remaining Time'
    : 'Elapsed Time';

  updateTimer();
});

let previousValues = {
  days: '',
  hours: '',
  minutes: '',
  seconds: ''
};

function blinkIfChanged(id, newValue) {

  const element = document.getElementById(id);

  if (previousValues[id] !== newValue) {

    element.classList.remove('blink');

    void element.offsetWidth;

    element.classList.add('blink');

    previousValues[id] = newValue;
  }

  element.textContent =
    String(newValue).padStart(2, '0');
}

function updateProgress(now) {

  const totalDuration = targetDate - startDate;

  let progress;

  if (showRemaining) {

    const remaining = targetDate - now;

    progress = (remaining / totalDuration) * 100;

  } else {

    const elapsed = now - startDate;

    progress = (elapsed / totalDuration) * 100;
  }

  progress = Math.min(Math.max(progress, 0), 100);

  const offset =
    circumference - (progress / 100) * circumference;

  progressCircle.style.strokeDashoffset = offset;

  progressText.textContent =
    `${progress.toFixed(1)}%`;
}

function updateTimer() {

  const now = new Date();

  let diff;

  if (showRemaining) {
    diff = targetDate - now;
  } else {
    diff = now - startDate;
  }

  if (diff < 0) diff = 0;

  const totalSeconds = Math.floor(diff / 1000);

  const days =
    Math.floor(totalSeconds / (24 * 60 * 60));

  const hours =
    Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);

  const minutes =
    Math.floor((totalSeconds % 3600) / 60);

  const seconds =
    totalSeconds % 60;

  blinkIfChanged('days', days);
blinkIfChanged('hours', hours);
blinkIfChanged('minutes', minutes);
blinkIfChanged('seconds', seconds);
  if (soundEnabled) {

  tickSound.currentTime = 0;
  tickSound.volume = 0.08;

  tickSound.pause();
tickSound.currentTime = 0;

const playPromise = tickSound.play();

if (playPromise !== undefined) {
  playPromise.catch(() => {});
}
}
  
  updateProgress(now);
}

updateTimer();

setInterval(updateTimer, 1000);
