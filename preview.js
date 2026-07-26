function renderScreen1(config, interactive = false) {
  const s = config.screen1;
  const noClass = interactive ? 'btn-no interactive-no' : 'btn-no';
  const yesClass = interactive ? 'btn-yes interactive-yes' : 'btn-yes';
  return `
    <div class="screen-content" data-screen="1">
      ${renderIllustration(s.image)}
      <h2>${s.title.replace(/\\n/g, '<br>')}</h2>
      <div class="btn-row">
        <button class="btn ${yesClass}">${s.yesText}</button>
        <button class="btn ${noClass}">${s.noText}</button>
      </div>
    </div>`;
}

function renderScreen2(config) {
  const s = config.screen2;
  return `
    <div class="screen-content" data-screen="2">
      ${renderIllustration(s.image)}
      <h2>${s.title}</h2>
      <p class="screen-subtitle">${s.subtitle}</p>
      <button class="btn btn-yes interactive-confirm">${s.confirmText}</button>
    </div>`;
}

function renderScreen3(config, values = {}) {
  const s = config.screen3;
  const disabled = !values.date || !values.time ? 'disabled' : '';
  return `
    <div class="screen-content" data-screen="3">
      ${renderIllustration(s.image)}
      <h2>${s.title}</h2>
      <div class="date-fields">
        <input type="date" class="date-input" value="${values.date || ''}">
        <input type="time" class="time-input" value="${values.time || '19:30'}">
      </div>
      <button class="btn btn-primary date-submit" ${disabled}>${s.buttonText}</button>
    </div>`;
}

function renderScreen4(config, selected = null) {
  const s = config.screen4;
  const cards = s.dishes.map((d, i) => `
    <div class="food-card ${selected === i ? 'selected' : ''}" data-index="${i}">
      <span class="emoji">${d.emoji}</span>
      <span class="name">${d.name}</span>
    </div>`).join('');
  return `
    <div class="screen-content" data-screen="4">
      <h2>${s.title}</h2>
      <p class="screen-subtitle">${s.subtitle}</p>
      <div class="food-grid">${cards}</div>
    </div>`;
}

function renderScreen5(config, vars = {}) {
  const s = config.screen5;
  const desc = fillTemplate(s.description, vars);
  const image = vars.foodEmoji
    ? null
    : s.image;
  const illus = vars.foodEmoji
    ? `<div class="illus emoji-only">${vars.foodEmoji}</div>`
    : renderIllustration(image);
  return `
    <div class="screen-content" data-screen="5">
      ${illus}
      <h2>${s.title}</h2>
      <p class="screen-subtitle">${desc}</p>
    </div>`;
}

function renderPreview(config, screen, extra = {}) {
  switch (screen) {
    case 1: return renderScreen1(config, extra.interactive);
    case 2: return renderScreen2(config);
    case 3: return renderScreen3(config, extra);
    case 4: return renderScreen4(config, extra.selected);
    case 5: return renderScreen5(config, extra);
    default: return renderScreen1(config);
  }
}

// ===== АНИМАЦИИ =====

function burstHearts(container) {
  const overlay = document.createElement('div');
  overlay.className = 'hearts-burst';
  const heartSrc = '/meeting/heart2.webp';
  for (let i = 0; i < 14; i++) {
    const h = document.createElement('img');
    h.className = 'heart-particle';
    h.src = heartSrc;
    h.alt = '';
    h.style.left = `${10 + Math.random() * 70}%`;
    h.style.top = `${35 + Math.random() * 35}%`;
    h.style.animationDelay = `${Math.random() * 0.35}s`;
    h.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
    overlay.appendChild(h);
  }
  container.appendChild(overlay);
  setTimeout(() => overlay.remove(), 1400);
}

function showKiss(container) {
  const kiss = document.createElement('div');
  kiss.className = 'kiss-overlay';
  kiss.innerHTML = `<img src="/meeting/kiss.webp" alt="" class="kiss-img">`;
  container.appendChild(kiss);
  setTimeout(() => kiss.remove(), 900);
}

function playYesAnimation(container, onDone) {
  const heart = document.createElement('img');
  heart.className = 'yes-heart-flash';
  heart.src = '/meeting/heart.webp';
  heart.alt = '';
  container.appendChild(heart);

  container.classList.add('shake');
  burstHearts(container);

  setTimeout(() => {
    heart.remove();
    container.classList.remove('shake');
    if (onDone) onDone();
  }, 700);
}

function setupNoButton(btn, anim, container, onYesFallback) {
  let clicks = 0;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (anim === 'kiss') {
      showKiss(container);
    } else if (anim === 'shrink') {
      clicks++;
      const scale = Math.max(0.15, 1 - clicks * 0.18);
      btn.style.setProperty('--scale', scale);
      btn.classList.add('shrink');
      if (scale <= 0.2 && onYesFallback) onYesFallback();
    } else if (anim === 'run') {
      moveNoButton(btn);
      btn.classList.add('runaway');
    }
  });

  if (anim === 'run') {
    btn.addEventListener('mouseenter', () => moveNoButton(btn));
    btn.addEventListener('touchstart', () => moveNoButton(btn), { passive: true });
  }
}

function moveNoButton(btn) {
  const x = (Math.random() - 0.5) * 140;
  const y = (Math.random() - 0.5) * 90;
  btn.style.transform = `translate(${x}px, ${y}px)`;
}

// Делаем функции глобальными
window.renderScreen1 = renderScreen1;
window.renderScreen2 = renderScreen2;
window.renderScreen3 = renderScreen3;
window.renderScreen4 = renderScreen4;
window.renderScreen5 = renderScreen5;
window.renderPreview = renderPreview;
window.burstHearts = burstHearts;
window.showKiss = showKiss;
window.playYesAnimation = playYesAnimation;
window.setupNoButton = setupNoButton;
window.moveNoButton = moveNoButton;