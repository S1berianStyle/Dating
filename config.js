const ASSETS = {
  logo: "meeting/tolkoteplo2.svg",
  videoPoster: "meeting/video-poster.webp",
  heart: "meeting/heart.webp",
  heart2: "meeting/heart2.webp",
  kiss: "meeting/kiss.webp",
  socialBadge: "meeting/social-badge.png",
};

const IMAGE_OPTIONS = {
  step1: [
    "meeting/step1/1.webp",
    "meeting/step1/2.webp",
    "meeting/step1/3.webp",
  ],
  step2: [
    "meeting/step2/1.webp",
    "meeting/step2/2.webp",
    "meeting/step2/3.webp",
  ],
  step3: [
    "meeting/step3/1.webp",
    "meeting/step3/2.webp",
    "meeting/step3/3.webp",
    "meeting/step3/4.webp",
  ],
};

const DEFAULT_CONFIG = {
  screen1: {
    image: "meeting/step1/1.webp",
    title: "Ты пойдешь со мной\nна свидание?",
    yesText: "Да ❤️",
    noText: "Нет",
    yesAnim: "hearts",
    noAnim: "kiss",
  },
  screen2: {
    image: "meeting/step2/1.webp",
    title: "Подожди, ты действительно сказала да?",
    subtitle: 'Я был готов что скажешь "нет" ахах',
    confirmText: "Да Да дА ❤️",
  },
  screen3: {
    image: "meeting/step3/3.webp",
    title: "И так... Когда ты свободна?",
    buttonText: "Выбери дату ❤️",
  },
  screen4: {
    title: "Что ты хочешь?",
    subtitle: "Выбери что тебе в кайф",
    dishes: [
      { emoji: "🍕", name: "Пицца" },
      { emoji: "🍣", name: "Суши" },
      { emoji: "🍔", name: "Бургер" },
      { emoji: "🍝", name: "Паста" },
      { emoji: "🍜", name: "Ролтон" },
      { emoji: "🍲", name: "Рамен" },
    ],
  },
  screen5: {
    image: "meeting/e1.webp",
    title: "Рад что не отказалась ❤️",
    description: "Будь готова к {date} в {time}, я приеду за тобой",
  },
};

function cloneConfig(cfg) {
  return JSON.parse(JSON.stringify(cfg || DEFAULT_CONFIG));
}

function encodeConfig(config) {
  try {
    var json = JSON.stringify(config);
    var encoded = encodeURIComponent(json);
    return btoa(encoded);
  } catch (e) {
    console.error("encodeConfig error:", e);
    return "";
  }
}

function decodeConfig(encoded) {
  try {
    var decoded = atob(encoded);
    var json = decodeURIComponent(decoded);
    return JSON.parse(json);
  } catch (e) {
    console.error("decodeConfig error:", e);
    try {
      var json = decodeURIComponent(escape(atob(encoded)));
      return JSON.parse(json);
    } catch (e2) {
      console.error("Альтернативный метод тоже не сработал:", e2);
      return null;
    }
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  var parts = dateStr.split("-");
  return parts.length === 3
    ? parts[2] + "." + parts[1] + "." + parts[0]
    : dateStr;
}

function fillTemplate(text, vars) {
  return text
    .replace(/\{date\}/g, vars.date || "...")
    .replace(/\{time\}/g, vars.time || "...")
    .replace(/\{food\}/g, vars.food || "...");
}

function renderIllustration(src, alt) {
  if (!src) return "";
  return (
    '<img class="illus-img" src="' +
    src +
    '" alt="' +
    (alt || "") +
    '" loading="lazy" decoding="async">'
  );
}

window.ASSETS = ASSETS;
window.IMAGE_OPTIONS = IMAGE_OPTIONS;
window.DEFAULT_CONFIG = DEFAULT_CONFIG;
window.cloneConfig = cloneConfig;
window.encodeConfig = encodeConfig;
window.decodeConfig = decodeConfig;
window.formatDate = formatDate;
window.fillTemplate = fillTemplate;
window.renderIllustration = renderIllustration;
