document.addEventListener('DOMContentLoaded', () => {

  // ── Developer Easter Egg ──
  console.log('%cHey developer 👀 — if you\'re snooping around, just know that Dipali means the world to Pinkesh. Don\'t mess with the code. 😄 — Pinkesh', 'color:#d4a853;font-size:15px;font-weight:bold;background:#0e0c0a;padding:10px 16px;border-radius:6px;');

  // ── Stars ──
  const starsLayer = document.getElementById('stars-layer');
  for (let i = 0; i < 90; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const sz = Math.random() * 1.8 + 0.5;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}vw;top:${Math.random()*100}vh;--dur:${(Math.random()*3+1.5).toFixed(2)}s;animation-delay:${(Math.random()*3).toFixed(2)}s`;
    starsLayer.appendChild(s);
  }

  // ── Petal Canvas ──
  const canvas = document.getElementById('petals-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const PETAL_COUNT = 28;
  const petals = Array.from({ length: PETAL_COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 7 + 3,
    vy: Math.random() * 0.6 + 0.3,
    vx: (Math.random() - 0.5) * 0.4,
    spin: (Math.random() - 0.5) * 0.03,
    angle: Math.random() * Math.PI * 2,
    opacity: Math.random() * 0.5 + 0.2,
    hue: Math.random() > 0.5 ? '#e8a090' : '#d4a853',
  }));

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.hue;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animPetals() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.y * 0.015) * 0.3;
      p.angle += p.spin;
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
      if (p.x > W + 20) p.x = -20;
      if (p.x < -20) p.x = W + 20;
      drawPetal(p);
    });
    requestAnimationFrame(animPetals);
  }
  animPetals();

  // ── Custom Cursor ──
  const cursorEl = document.getElementById('cursor');
  const trail    = document.getElementById('cursor-trail');
  document.addEventListener('mousemove', e => {
    cursorEl.style.left = e.clientX + 'px';
    cursorEl.style.top  = e.clientY + 'px';
    trail.style.left    = e.clientX + 'px';
    trail.style.top     = e.clientY + 'px';
  });

  // ── Reveal on scroll ──
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  // ── Days Known Counter ──
  function calcDays() {
    const start = new Date('2023-12-21');
    const now   = new Date();
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  }

  function animateCounter(el, target, duration = 2000) {
    let startTs = null;
    function step(ts) {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target).toString().padStart(3, '0');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toString().padStart(3, '0');
    }
    requestAnimationFrame(step);
  }

  const daysCountEl = document.getElementById('days-count');
  let counterAnimated = false;
  if (daysCountEl) {
    const counterObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counterAnimated) {
        counterAnimated = true;
        animateCounter(daysCountEl, calcDays());
        counterObs.disconnect();
      }
    }, { threshold: 0.3 });
    counterObs.observe(daysCountEl.closest('.days-counter'));
  }

  // ── Music Toggle ──
  const bgMusic  = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('music-toggle');
  const iconOn   = document.getElementById('music-icon-on');
  const iconOff  = document.getElementById('music-icon-off');
  let musicPlaying = false;

  function setMusicState(playing) {
    musicPlaying = playing;
    musicBtn.classList.toggle('playing', playing);
    iconOn.style.display  = playing ? 'block' : 'none';
    iconOff.style.display = playing ? 'none'  : 'block';
  }
  setMusicState(false);

  musicBtn.addEventListener('click', () => {
    if (musicPlaying) {
      bgMusic.pause();
      setMusicState(false);
    } else {
      bgMusic.volume = 0.25;
      bgMusic.play().catch(() => {});
      setMusicState(true);
    }
  });

  // ── Landing open ──
  const landing = document.getElementById('landing');
  const main    = document.getElementById('main');
  const openBtn = document.getElementById('open-btn');

  openBtn.addEventListener('click', () => {
    bgMusic.volume = 0.25;
    bgMusic.play().then(() => setMusicState(true)).catch(() => {});

    landing.classList.add('exit');
    setTimeout(() => {
      landing.style.display = 'none';
      main.classList.remove('hidden');
      document.querySelectorAll('.hero-section .reveal').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 200);
      });
    }, 1400);

    // Fireworks burst on open
    setTimeout(() => {
      const colors = ['#d4a853', '#f0c97a', '#c7546a', '#e8728a', '#f5ede0'];
      [0.2, 0.5, 0.8].forEach((x, i) => {
        setTimeout(() => {
          confetti({ particleCount: 40, angle: 90, spread: 80, origin: { x, y: 0.5 }, colors, gravity: 0.8, scalar: 0.9 });
        }, i * 300);
      });
    }, 800);
  });

  // ── Letter typing ──
  const letterText = `Some people walk into your life so quietly, without any announcement, and yet at some point you realize the friendship just... stuck.

That's what happened with us.

We've had days — many of them — where we didn't talk at all. No messages, no calls. And somehow when we do pick up again, nothing's changed. That's a rare thing, Dipali. That's what real friendship feels like.

From barely speaking on the same bus during college, to a DM after that December 2023 trip that somehow opened a whole chapter — I'm genuinely glad it happened.

You motivate me when I feel low. You make things feel less heavy. There's a calm, sweet energy to you that just makes everything feel okay.

You're genuinely one of the most beautiful souls I've met — and I mean that in every possible sense.

I'm really grateful our paths crossed.

So here's to more random chats, more bakchodi, more laughs — and hopefully, meeting a whole lot more.

I love you, Dipali.
And yes — as your best friend. Always.`;

  let letterStarted = false;
  const letterSection = document.querySelector('.letter-section');
  const letterObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !letterStarted) {
      letterStarted = true;
      typeText(letterText);
      letterObs.disconnect();
    }
  }, { threshold: 0.2 });
  letterObs.observe(letterSection);

  function typeText(text) {
    const output    = document.getElementById('typed-output');
    const sig       = document.getElementById('letter-sig');
    const typeCursor = document.createElement('span');
    typeCursor.className = 'type-cursor';
    output.appendChild(typeCursor);

    const lines = text.split('\n');
    let lIdx = 0, cIdx = 0;
    let currentEl = null;

    function tick() {
      if (lIdx >= lines.length) {
        typeCursor.remove();
        sig.classList.remove('hidden');
        setTimeout(() => sig.classList.add('show'), 50);
        return;
      }
      const line = lines[lIdx];
      if (cIdx === 0) {
        if (line === '') {
          output.insertBefore(document.createElement('br'), typeCursor);
          output.insertBefore(document.createElement('br'), typeCursor);
          lIdx++; cIdx = 0;
          setTimeout(tick, 60);
          return;
        }
        currentEl = document.createElement('span');
        output.insertBefore(currentEl, typeCursor);
      }
      if (cIdx < line.length) {
        currentEl.textContent += line[cIdx];
        cIdx++;
        setTimeout(tick, line[cIdx - 1] === ',' || line[cIdx - 1] === '.' ? 55 : 22);
      } else {
        lIdx++; cIdx = 0;
        setTimeout(tick, 40);
      }
    }
    tick();
  }

  // ── Photo Lightbox ──
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lb-img');
  const lbCaption  = document.getElementById('lb-caption');
  const lbClose    = document.getElementById('lightbox-close');
  const lbPrev     = document.getElementById('lightbox-prev');
  const lbNext     = document.getElementById('lightbox-next');
  const lbBackdrop = lightbox.querySelector('.lb-backdrop');

  const frames = Array.from(document.querySelectorAll('.film-frame'));
  let currentLbIdx = 0;

  function openLightbox(idx) {
    currentLbIdx = idx;
    const frame = frames[idx];
    const img   = frame.querySelector('img');
    lbImg.src   = img.src;
    lbCaption.textContent = frame.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 400);
  }

  function navigateLightbox(dir) {
    currentLbIdx = (currentLbIdx + dir + frames.length) % frames.length;
    const frame = frames[currentLbIdx];
    const img   = frame.querySelector('img');
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = img.src;
      lbCaption.textContent = frame.dataset.caption || '';
      lbImg.style.opacity = '1';
    }, 180);
  }

  lbImg.style.transition = 'opacity 0.2s ease';

  frames.forEach((frame, i) => {
    frame.addEventListener('click', (e) => {
      if (isDraggingFilm) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      openLightbox(i);
    });
    frame.style.cursor = 'none';
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => navigateLightbox(-1));
  lbNext.addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  let lbTouchStartX = 0;
  lightbox.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - lbTouchStartX;
    if (Math.abs(dx) > 50) navigateLightbox(dx < 0 ? 1 : -1);
  });

  // ── Film Strip Drag Scroll ──
  const filmStrip = document.querySelector('.film-strip');
  let isDown = false, isDraggingFilm = false, startX, scrollLeft;
  
  filmStrip.addEventListener('mousedown', e => {
    isDown = true;
    isDraggingFilm = false;
    startX = e.pageX - filmStrip.offsetLeft;
    scrollLeft = filmStrip.scrollLeft;
  });
  filmStrip.addEventListener('mouseleave', () => isDown = false);
  filmStrip.addEventListener('mouseup',    () => isDown = false);
  filmStrip.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - filmStrip.offsetLeft;
    const walk = (x - startX) * 1.4;
    filmStrip.scrollLeft = scrollLeft - walk;
    if (Math.abs(walk) > 5) isDraggingFilm = true;
  });

  // ── Candle Blow-Out ──
  const candleHint  = document.getElementById('candle-hint');
  const candleWish  = document.getElementById('candle-wish');
  const candleWraps = document.querySelectorAll('.candle-wrap');
  let blownCount    = 0;
  const totalCandles = 5;

  function blowCandle(i) {
    const flame = document.getElementById(`flame-${i}`);
    if (!flame || flame.classList.contains('out')) return;

    flame.classList.add('out');
    blownCount++;

    // Smoke puff
    const wrap  = candleWraps[i];
    const puff  = document.createElement('div');
    puff.className = 'smoke-puff';
    wrap.appendChild(puff);
    setTimeout(() => puff.remove(), 1300);

    const remaining = totalCandles - blownCount;
    if (remaining > 0) {
      candleHint.textContent = remaining === 1 ? `One more to go... 🕯️` : `${remaining} candles left ✨`;
    } else {
      candleHint.classList.add('hidden');
      setTimeout(() => {
        candleWish.classList.remove('hidden');
        const colors = ['#d4a853', '#f0c97a', '#c7546a', '#e8728a', '#f5ede0', '#fff'];
        const end = Date.now() + 3500;
        (function wishFrame() {
          confetti({ particleCount: 6, angle: 60,  spread: 70, origin: { x: 0 }, colors, gravity: 0.7 });
          confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors, gravity: 0.7 });
          if (Date.now() < end) requestAnimationFrame(wishFrame);
        })();
      }, 400);
    }
  }

  candleWraps.forEach((wrap, i) => {
    wrap.addEventListener('click', () => blowCandle(i));
  });

  // ── Easter Egg — 🌸 stamp ──
  const stamp     = document.getElementById('letter-stamp');
  const toast     = document.getElementById('easter-toast');
  const easterMsg = document.getElementById('easter-msg');
  let stampClicks  = 0;
  let toastTimeout = null;

  const easterMessages = [
    '🌸 You found the secret!',
    '✨ Pinkesh knew you\'d click this...',
    '💛 Keep going, 3 more times...',
    '🌙 Getting warmer...',
    '🎉 You\'re so curious — just like a cat!',
    '🌸 Secret: Pinkesh thinks you\'re the coolest person he knows.',
    '💌 And the most beautiful. Obviously. 🫶',
    '✦ Stop clicking and go enjoy the rest of the page!',
    '😂 Seriously though. Go scroll down.',
    '🌸 ok fine. I love you. Bye. 🥺'
  ];

  function showToast(msg) {
    easterMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  stamp.addEventListener('click', () => {
    stampClicks++;
    const idx = Math.min(stampClicks - 1, easterMessages.length - 1);
    showToast(easterMessages[idx]);

    if (stampClicks === 6) {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.45 },
        colors: ['#d4a853', '#f0c97a', '#e8a090', '#f5ede0'],
        scalar: 0.8
      });
    }
  });

  // ── Surprise Button ──
  const surpriseBtn = document.getElementById('surprise-btn');
  const finalMsg    = document.getElementById('final-msg');
  const finTrigger  = document.getElementById('finale-trigger');

  surpriseBtn.addEventListener('click', () => {
    finTrigger.style.transition = 'opacity 0.4s, transform 0.4s';
    finTrigger.style.opacity    = '0';
    finTrigger.style.transform  = 'scale(0.9)';
    setTimeout(() => { finTrigger.style.display = 'none'; }, 400);
    finalMsg.classList.remove('hidden');
    setTimeout(() => finalMsg.classList.add('show'), 50);

    const colors = ['#d4a853', '#f0c97a', '#c7546a', '#e8728a', '#f5ede0'];
    const end = Date.now() + 6000;
    (function frame() {
      confetti({ particleCount: 6, angle: 60,  spread: 65, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 65, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 120, spread: 120, origin: { y: 0.5 }, colors, gravity: 0.6, scalar: 1.1 });

    bgMusic.volume = 0.45;
  });

});