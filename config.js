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
    "assets/foto-meeting/step1/1.webp",
    "assets/foto-meeting/step1/2.webp",
    "assets/foto-meeting/step1/3.webp",
  ],
  step2: [
    "assets/foto-meeting/step2/1.webp",
    "assets/foto-meeting/step2/2.webp",
    "assets/foto-meeting/step2/3.webp",
  ],
  step3: [
    "assets/foto-meeting/step3/1.webp",
    "assets/foto-meeting/step3/2.webp",
    "assets/foto-meeting/step3/3.webp",
    "assets/foto-meeting/step3/4.webp",
  ],
};

const DEFAULT_CONFIG = {
  screen1: {
    image: IMAGE_OPTIONS.step1[0],
    title: "Ты пойдешь со мной\nна свидание?",
    yesText: "Да",
    noText: "Нет",
    yesAnim: "hearts",
    noAnim: "kiss",
  },
  screen2: {
    image: IMAGE_OPTIONS.step2[0],
    title: "Подожди, ты действительно сказала да?",
    subtitle: 'Я был готов что скажешь "нет" ахах',
    confirmText: "Да Да дА",
  },
  screen3: {
    image: IMAGE_OPTIONS.step3[2],
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
    title: "Рад то что не отказалась.",
    description: "Будь готова к {date} в {time}, я приеду за тобой",
  },
};

function cloneConfig(cfg = DEFAULT_CONFIG) {
  return JSON.parse(JSON.stringify(cfg));
}

function encodeConfig(config) {
  try {
    var json = JSON.stringify(config);
    // Кодируем в URI компонент
    var encoded = encodeURIComponent(json);
    // Преобразуем в base64
    return btoa(encoded);
  } catch (e) {
    console.error("encodeConfig error:", e);
    return "";
  }
}

function decodeConfig(encoded) {
  try {
    // Декодируем base64
    var decoded = atob(encoded);
    // Декодируем URI компонент
    var json = decodeURIComponent(decoded);
    return JSON.parse(json);
  } catch (e) {
    console.error("decodeConfig error:", e);
    // Пробуем альтернативный метод
    try {
      var json = decodeURIComponent(escape(atob(encoded)));
      return JSON.parse(json);
    } catch (e2) {
      console.error("Альтернативный метод тоже не сработал:", e2);
      return null;
    }
  }
}

function migrateLegacyConfig(config) {
  if (!config) return;
  if (config.screen1?.emoji && !config.screen1.image) {
    config.screen1.image = IMAGE_OPTIONS.step1[0];
    delete config.screen1.emoji;
  }
  if (config.screen2?.emoji && !config.screen2.image) {
    config.screen2.image = IMAGE_OPTIONS.step2[0];
    delete config.screen2.emoji;
  }
  if (config.screen3?.emoji && !config.screen3.image) {
    config.screen3.image = IMAGE_OPTIONS.step3[2];
    delete config.screen3.emoji;
  }
  if (config.screen5?.emoji && !config.screen5.image) {
    config.screen5.image = "meeting/e1.webp";
    delete config.screen5.emoji;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}.${y}`;
}

function fillTemplate(text, vars) {
  return text
    .replace(/\{date\}/g, vars.date || "...")
    .replace(/\{time\}/g, vars.time || "...")
    .replace(/\{food\}/g, vars.food || "...");
}

function renderIllustration(src, alt = "") {
  if (!src) return "";
  return `<img class="illus-img" src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
}

// Делаем всё глобально доступным
window.ASSETS = ASSETS;
window.IMAGE_OPTIONS = IMAGE_OPTIONS;
window.DEFAULT_CONFIG = DEFAULT_CONFIG;
window.cloneConfig = cloneConfig;
window.encodeConfig = encodeConfig;
window.decodeConfig = decodeConfig;
window.formatDate = formatDate;
window.fillTemplate = fillTemplate;
window.renderIllustration = renderIllustration;
