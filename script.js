/* ==========================================================================
   Birthday Surprise Interactive Script
   Enhanced with 3D Photo Showcase, Sparkle Trail & Lightbox Modal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  const modalOverlay = document.getElementById('modalOverlay');
  const questionButtons = document.getElementById('questionButtons');
  const deniedView = document.getElementById('deniedView');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const btnRetry = document.getElementById('btnRetry');
  const celebrationContainer = document.getElementById('celebrationContainer');
  const photoFrame = document.getElementById('photoFrame');
  const photoCard = document.getElementById('photoCard');
  const titleText = document.getElementById('titleText');
  const nameText = document.getElementById('nameText');
  const subtitleText = document.getElementById('subtitleText');
  const actionBar = document.querySelector('.action-bar');
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundText = document.querySelector('.sound-text');
  
  // Lightbox Elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  // Canvas Sizing
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  // ---------------- STARFIELD PARTICLES ----------------
  let stars = [];
  function initStars() {
    stars = [];
    for (let i = 0; i < 110; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 1.8 : 2.8,
        alpha: Math.random(),
        speed: 0.005 + Math.random() * 0.015
      });
    }
  }

  function drawStars() {
    for (let star of stars) {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0.2) {
        star.speed = -star.speed;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ---------------- SPARKLE CURSOR/TOUCH TRAIL ----------------
  let sparkles = [];
  function addSparkle(x, y) {
    for (let i = 0; i < 2; i++) {
      sparkles.push({
        x: x + (Math.random() - 0.5) * 15,
        y: y + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        size: Math.random() * 4 + 2,
        color: ['#ffd166', '#ff4d6d', '#4cc9f0', '#ffffff'][Math.floor(Math.random() * 4)],
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02
      });
    }
  }

  function drawSparkles() {
    for (let i = sparkles.length - 1; i >= 0; i--) {
      let sp = sparkles[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= sp.decay;

      if (sp.alpha <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = sp.alpha;
      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    addSparkle(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      addSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  // ---------------- CONFETTI PARTICLES ----------------
  const confettiColors = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#c77dff', '#ff9f1c'];
  let confetti = [];
  function initConfetti() {
    confetti = [];
    for (let i = 0; i < 85; i++) {
      confetti.push({
        x: Math.random() * width,
        y: Math.random() * -height,
        size: Math.random() * 6 + 4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: Math.random() * 0.05 + 0.02
      });
    }
  }

  function drawConfetti() {
    for (let c of confetti) {
      c.y += c.speedY;
      c.angle += c.angularSpeed;
      c.x += Math.sin(c.angle) * 1.5;

      if (c.y > height + 20) {
        c.y = -20;
        c.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size, c.size, c.size * 2);
      ctx.restore();
    }
  }

  // ---------------- FLOATING HEARTS ----------------
  const heartColors = ['#ff4d6d', '#ff85a1', '#ffb3c6', '#c77dff'];
  let hearts = [];
  function initHearts() {
    hearts = [];
    for (let i = 0; i < 18; i++) {
      hearts.push(createHeartObj(Math.random() * width, height + Math.random() * 200));
    }
  }

  function createHeartObj(x, y) {
    return {
      x: x,
      y: y,
      size: Math.random() * 16 + 14,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      speed: Math.random() * 1.6 + 1,
      drift: Math.random() * 0.03,
      angle: Math.random() * Math.PI * 2
    };
  }

  function drawHeartShape(cx, cy, size, color) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    const topCurveHeight = size * 0.3;
    ctx.moveTo(cx, cy + topCurveHeight);

    ctx.bezierCurveTo(cx, cy, cx - size / 2, cy, cx - size / 2, cy + topCurveHeight);
    ctx.bezierCurveTo(cx - size / 2, cy + (size + topCurveHeight) / 2, cx, cy + size, cx, cy + size);
    ctx.bezierCurveTo(cx, cy + size, cx + size / 2, cy + (size + topCurveHeight) / 2, cx + size / 2, cy + topCurveHeight);
    ctx.bezierCurveTo(cx + size / 2, cy, cx, cy, cx, cy + topCurveHeight);

    ctx.closePath();
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  }

  function drawHearts() {
    for (let h of hearts) {
      h.y -= h.speed;
      h.angle += h.drift;
      h.x += Math.sin(h.angle) * 0.8;

      if (h.y < -60) {
        h.y = height + 50;
        h.x = Math.random() * width;
      }

      drawHeartShape(h.x, h.y, h.size, h.color);
    }
  }

  // ---------------- BURST HEARTS ON CLICK ----------------
  let burstHearts = [];
  function createBurst(clickX, clickY, count = 10) {
    for (let i = 0; i < count; i++) {
      burstHearts.push({
        x: clickX,
        y: clickY,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 2,
        size: Math.random() * 14 + 10,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        alpha: 1
      });
    }
  }

  function drawBurstHearts() {
    for (let i = burstHearts.length - 1; i >= 0; i--) {
      let b = burstHearts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.15; // gravity
      b.alpha -= 0.018;

      if (b.alpha <= 0) {
        burstHearts.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = b.alpha;
      drawHeartShape(b.x, b.y, b.size, b.color);
      ctx.restore();
    }
  }

  window.addEventListener('click', (e) => {
    if (!modalOverlay.classList.contains('hidden')) return;
    if (lightboxModal && !lightboxModal.classList.contains('hidden')) return;
    createBurst(e.clientX, e.clientY);
  });

  // ---------------- ANIMATION LOOP ----------------
  let animationStarted = false;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawStars();
    drawSparkles();

    if (animationStarted) {
      drawConfetti();
      drawHearts();
      drawBurstHearts();
    }

    requestAnimationFrame(animate);
  }

  initStars();
  initConfetti();
  initHearts();
  animate();

  // ---------------- MODAL LOGIC ----------------
  btnYes.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    celebrationContainer.classList.remove('hidden');
    animationStarted = true;
    startCelebration();
  });

  btnNo.addEventListener('click', () => {
    questionButtons.classList.add('hidden');
    deniedView.classList.remove('hidden');
  });

  btnRetry.addEventListener('click', () => {
    deniedView.classList.add('hidden');
    questionButtons.classList.remove('hidden');
  });

  // ---------------- 3D PHOTO FRAME TILT EFFECT ----------------
  photoFrame.addEventListener('mousemove', (e) => {
    const rect = photoFrame.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / rect.height) * 20;
    const rotateY = (x / rect.width) * 20;

    photoCard.style.transform = `scale(1.06) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  photoFrame.addEventListener('mouseleave', () => {
    photoCard.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
  });

  // ---------------- LIGHTBOX MODAL HANDLERS ----------------
  photoFrame.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxModal.classList.remove('hidden');
    createBurst(window.innerWidth / 2, window.innerHeight / 2, 25);
  });

  function closeLightbox() {
    lightboxModal.classList.add('hidden');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // ---------------- TYPING EFFECT ----------------
  const message1 = "HAPPY BIRTHDAY";
  const message2 = "JAMEELA 💫";
  let idx1 = 0;
  let idx2 = 0;

  function startCelebration() {
    setTimeout(() => {
      photoFrame.classList.add('visible');
    }, 200);

    setTimeout(typeTitle, 600);
    setTimeout(startGlow, 600);
  }

  function typeTitle() {
    if (idx1 <= message1.length) {
      titleText.textContent = message1.slice(0, idx1);
      idx1++;
      setTimeout(typeTitle, 120);
    } else {
      setTimeout(typeName, 200);
    }
  }

  function typeName() {
    if (idx2 <= message2.length) {
      nameText.textContent = message2.slice(0, idx2);
      idx2++;
      setTimeout(typeName, 150);
    } else {
      subtitleText.classList.add('visible');
      actionBar.classList.add('visible');
    }
  }

  // ---------------- GLOW EFFECT ----------------
  const titleColors = ["#ff4d6d", "#ff758f", "#ffb3c6", "#ff758f"];
  const nameColors = ["#ffd166", "#ffe08a", "#fff0b3", "#ffe08a"];
  let glowState = 0;

  function startGlow() {
    titleText.style.color = titleColors[glowState % titleColors.length];
    nameText.style.color = nameColors[glowState % nameColors.length];
    glowState++;
    setTimeout(startGlow, 300);
  }

  // ---------------- SYNTHESIZED HAPPY BIRTHDAY SONG ----------------
  let audioCtx = null;
  let isPlaying = false;
  let currentTimer = null;

  soundToggle.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (isPlaying) {
      stopSong();
    } else {
      playSong();
    }
  });

  function stopSong() {
    isPlaying = false;
    if (currentTimer) clearTimeout(currentTimer);
    soundToggle.classList.remove('playing');
    soundIcon.textContent = '🎵';
    soundText.textContent = 'Play Song';
  }

  function playSong() {
    isPlaying = true;
    soundToggle.classList.add('playing');
    soundIcon.textContent = '⏸️';
    soundText.textContent = 'Pause Song';

    const notes = [
      { f: 264, d: 0.4 }, { f: 264, d: 0.4 }, { f: 297, d: 0.8 }, { f: 264, d: 0.8 }, { f: 352, d: 0.8 }, { f: 330, d: 1.2 },
      { f: 264, d: 0.4 }, { f: 264, d: 0.4 }, { f: 297, d: 0.8 }, { f: 264, d: 0.8 }, { f: 396, d: 0.8 }, { f: 352, d: 1.2 },
      { f: 264, d: 0.4 }, { f: 264, d: 0.4 }, { f: 528, d: 0.8 }, { f: 440, d: 0.8 }, { f: 352, d: 0.8 }, { f: 330, d: 0.8 }, { f: 297, d: 0.8 },
      { f: 466, d: 0.4 }, { f: 466, d: 0.4 }, { f: 440, d: 0.8 }, { f: 352, d: 0.8 }, { f: 396, d: 0.8 }, { f: 352, d: 1.4 }
    ];

    let index = 0;
    function playNext() {
      if (!isPlaying) return;
      if (index >= notes.length) {
        index = 0;
      }

      const note = notes[index];
      playTone(note.f, note.d * 0.9);
      index++;
      currentTimer = setTimeout(playNext, note.d * 1000);
    }

    playNext();
  }

  function playTone(freq, duration) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.error(e);
    }
  }
});
