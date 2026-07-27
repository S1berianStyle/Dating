function renderScreen1(config, interactive) {
  var s = config.screen1;
  var noClass = interactive ? "btn-no interactive-no" : "btn-no";
  var yesClass = interactive ? "btn-yes interactive-yes" : "btn-yes";
  return (
    '<div class="screen-content" data-screen="1">' +
    renderIllustration(s.image) +
    "<h2>" +
    s.title.replace(/\n/g, "<br>") +
    "</h2>" +
    '<div class="btn-row">' +
    '<button class="btn ' +
    yesClass +
    '">' +
    s.yesText +
    "</button>" +
    '<button class="btn ' +
    noClass +
    '">' +
    s.noText +
    "</button>" +
    "</div></div>"
  );
}

function renderScreen2(config) {
  var s = config.screen2;
  return (
    '<div class="screen-content" data-screen="2">' +
    renderIllustration(s.image) +
    "<h2>" +
    s.title +
    "</h2>" +
    '<p class="screen-subtitle">' +
    s.subtitle +
    "</p>" +
    '<button class="btn btn-yes interactive-confirm">' +
    s.confirmText +
    "</button>" +
    "</div>"
  );
}

function renderScreen3(config, values) {
  values = values || {};
  var s = config.screen3;
  var disabled = !values.date || !values.time ? "disabled" : "";
  return (
    '<div class="screen-content" data-screen="3">' +
    renderIllustration(s.image) +
    "<h2>" +
    s.title +
    "</h2>" +
    '<div class="date-fields">' +
    '<input type="date" class="date-input" value="' +
    (values.date || "") +
    '">' +
    '<input type="time" class="time-input" value="' +
    (values.time || "19:30") +
    '">' +
    "</div>" +
    '<button class="btn btn-primary date-submit" ' +
    disabled +
    ">" +
    s.buttonText +
    "</button>" +
    "</div>"
  );
}

function renderScreen4(config, selected) {
  var s = config.screen4;
  var cards = "";
  for (var i = 0; i < s.dishes.length; i++) {
    var d = s.dishes[i];
    var sel = selected === i ? " selected" : "";
    cards +=
      '<div class="food-card' +
      sel +
      '" data-index="' +
      i +
      '">' +
      '<span class="emoji">' +
      d.emoji +
      "</span>" +
      '<span class="name">' +
      d.name +
      "</span>" +
      "</div>";
  }
  return (
    '<div class="screen-content" data-screen="4">' +
    "<h2>" +
    s.title +
    "</h2>" +
    '<p class="screen-subtitle">' +
    s.subtitle +
    "</p>" +
    '<div class="food-grid">' +
    cards +
    "</div>" +
    "</div>"
  );
}

function renderScreen5(config, vars) {
  vars = vars || {};
  var s = config.screen5;
  var desc = fillTemplate(s.description, vars);
  var illus = vars.foodEmoji
    ? '<div class="illus emoji-only">' + vars.foodEmoji + "</div>"
    : renderIllustration(s.image);
  return (
    '<div class="screen-content" data-screen="5">' +
    illus +
    "<h2>" +
    s.title +
    "</h2>" +
    '<p class="screen-subtitle">' +
    desc +
    "</p>" +
    "</div>"
  );
}

function renderPreview(config, screen, extra) {
  extra = extra || {};
  switch (screen) {
    case 1:
      return renderScreen1(config, extra.interactive);
    case 2:
      return renderScreen2(config);
    case 3:
      return renderScreen3(config, extra);
    case 4:
      return renderScreen4(config, extra.selected);
    case 5:
      return renderScreen5(config, extra);
    default:
      return renderScreen1(config);
  }
}

function burstHearts(container) {
  var overlay = document.createElement("div");
  overlay.className = "hearts-burst";
  for (var i = 0; i < 14; i++) {
    var h = document.createElement("img");
    h.className = "heart-particle";
    h.src = "meeting/heart2.webp";
    h.alt = "";
    h.style.left = 10 + Math.random() * 70 + "%";
    h.style.top = 35 + Math.random() * 35 + "%";
    h.style.animationDelay = Math.random() * 0.35 + "s";
    h.style.transform = "rotate(" + (Math.random() * 40 - 20) + "deg)";
    overlay.appendChild(h);
  }
  container.appendChild(overlay);
  setTimeout(function () {
    overlay.remove();
  }, 1400);
}

function showKiss(container) {
  var kiss = document.createElement("div");
  kiss.className = "kiss-overlay";
  kiss.innerHTML = '<img src="meeting/kiss.webp" alt="" class="kiss-img">';
  container.appendChild(kiss);
  setTimeout(function () {
    kiss.remove();
  }, 900);
}

function playYesAnimation(container, onDone) {
  var heart = document.createElement("img");
  heart.className = "yes-heart-flash";
  heart.src = "meeting/heart.webp";
  heart.alt = "";
  container.appendChild(heart);
  container.classList.add("shake");
  burstHearts(container);
  setTimeout(function () {
    heart.remove();
    container.classList.remove("shake");
    if (onDone) onDone();
  }, 700);
}

function setupNoButton(btn, anim, container, onYesFallback) {
  var clicks = 0;
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (anim === "kiss") {
      showKiss(container);
    } else if (anim === "shrink") {
      clicks++;
      var scale = Math.max(0.15, 1 - clicks * 0.18);
      btn.style.setProperty("--scale", scale);
      btn.classList.add("shrink");
      if (scale <= 0.2 && onYesFallback) onYesFallback();
    } else if (anim === "run") {
      moveNoButton(btn);
      btn.classList.add("runaway");
    }
  });
  if (anim === "run") {
    btn.addEventListener("mouseenter", function () {
      moveNoButton(btn);
    });
    btn.addEventListener(
      "touchstart",
      function () {
        moveNoButton(btn);
      },
      { passive: true }
    );
  }
}

function moveNoButton(btn) {
  var x = (Math.random() - 0.5) * 140;
  var y = (Math.random() - 0.5) * 90;
  btn.style.transform = "translate(" + x + "px, " + y + "px)";
}

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
