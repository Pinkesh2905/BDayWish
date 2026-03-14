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
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    trail.style.left  = mx + 'px';
    trail.style.top   = my + 'px';
  });

  // ── Reveal on scroll ──
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  // ── Landing open ──
  const landing  = document.getElementById('landing');
  const main     = document.getElementById('main');
  const openBtn  = document.getElementById('open-btn');
  const bgMusic  = document.getElementById('bgMusic');

  openBtn.addEventListener('click', () => {
    bgMusic.volume = 0.25;
    bgMusic.play().catch(() => {});
    landing.classList.add('exit');
    setTimeout(() => {
      landing.style.display = 'none';
      main.classList.remove('hidden');
      // Trigger hero reveals
      document.querySelectorAll('.hero-section .reveal').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 200);
      });
    }, 1400);
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
    const output = document.getElementById('typed-output');
    const sig    = document.getElementById('letter-sig');
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    output.appendChild(cursor);

    const lines = text.split('\n');
    let lIdx = 0, cIdx = 0;
    let currentEl = null;

    function tick() {
      if (lIdx >= lines.length) {
        cursor.remove();
        sig.classList.remove('hidden');
        setTimeout(() => sig.classList.add('show'), 50);
        return;
      }
      const line = lines[lIdx];
      if (cIdx === 0) {
        if (line === '') {
          output.insertBefore(document.createElement('br'), cursor);
          output.insertBefore(document.createElement('br'), cursor);
          lIdx++; cIdx = 0;
          setTimeout(tick, 60);
          return;
        }
        currentEl = document.createElement('span');
        output.insertBefore(currentEl, cursor);
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

  // ── Film strip drag scroll ──
  const filmStrip = document.querySelector('.film-strip');
  let isDown = false, startX, scrollLeft;
  filmStrip.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX - filmStrip.offsetLeft; scrollLeft = filmStrip.scrollLeft;
  });
  filmStrip.addEventListener('mouseleave', () => isDown = false);
  filmStrip.addEventListener('mouseup', () => isDown = false);
  filmStrip.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - filmStrip.offsetLeft;
    filmStrip.scrollLeft = scrollLeft - (x - startX) * 1.4;
  });

  // ── Surprise button ──
  const surpriseBtn = document.getElementById('surprise-btn');
  const finalMsg    = document.getElementById('final-msg');
  const finTrigger  = document.getElementById('finale-trigger');

  surpriseBtn.addEventListener('click', () => {
    finTrigger.style.transition = 'opacity 0.4s, transform 0.4s';
    finTrigger.style.opacity = '0';
    finTrigger.style.transform = 'scale(0.9)';
    setTimeout(() => { finTrigger.style.display = 'none'; }, 400);
    finalMsg.classList.remove('hidden');
    setTimeout(() => finalMsg.classList.add('show'), 50);

    // Confetti burst
    const end = Date.now() + 5000;
    const colors = ['#d4a853', '#f0c97a', '#c7546a', '#e8728a', '#f5ede0'];
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    bgMusic.volume = 0.45;
  });

});