var currentConfig = null;
var currentStep = 1;
var previewTab = 1;

function editorPanel() {
  return document.getElementById("editor-panel");
}

function previewEl() {
  return document.getElementById("constructor-preview");
}

function screenTabs() {
  return document.getElementById("screen-tabs");
}

function imagePicker(stepKey, field, current) {
  var options = IMAGE_OPTIONS[stepKey] || [];
  var html =
    '<div class="field"><label>Картинка на экране</label><div class="image-picker">';
  for (var i = 0; i < options.length; i++) {
    var src = options[i];
    var selected = src === current ? " selected" : "";
    html +=
      '<button type="button" class="image-option' +
      selected +
      '" data-image="' +
      src +
      '" aria-label="Выбрать картинку">';
    html += '<img src="' + src + '" alt="">';
    html += "</button>";
  }
  html += "</div></div>";
  return html;
}

function renderStep1() {
  var panel = editorPanel();
  if (!panel) return;

  panel.innerHTML =
    "" +
    "<h2>Настрой первые экраны приглашения</h2>" +
    '<p class="editor-hint">Тексты и картинки для шагов 1 и 2, которые увидит приглашённый</p>' +
    '<h3 class="editor-subtitle">Экран 1 — приглашение</h3>' +
    imagePicker("step1", "screen1", currentConfig.screen1.image) +
    '<div class="field"><label>Заголовок</label><textarea id="s1-title" rows="2">' +
    currentConfig.screen1.title +
    "</textarea></div>" +
    '<div class="field"><label>Кнопка «Да»</label><input type="text" id="s1-yes" value="' +
    currentConfig.screen1.yesText +
    '"></div>' +
    '<div class="field"><label>Кнопка «Нет»</label><input type="text" id="s1-no" value="' +
    currentConfig.screen1.noText +
    '"></div>' +
    '<div class="field"><label>Анимация «Да»</label><div class="radio-group">' +
    '<label class="radio-option"><input type="radio" name="yesAnim" value="hearts" ' +
    (currentConfig.screen1.yesAnim === "hearts" ? "checked" : "") +
    "><div><strong>Тряска и взрыв</strong><span>Тряска, исчезновение и взрыв сердец</span></div></label>" +
    '<label class="radio-option"><input type="radio" name="yesAnim" value="none" ' +
    (currentConfig.screen1.yesAnim === "none" ? "checked" : "") +
    "><div><strong>Без анимации</strong></div></label>" +
    "</div></div>" +
    '<div class="field"><label>Анимация «Нет»</label><div class="radio-group">' +
    '<label class="radio-option"><input type="radio" name="noAnim" value="kiss" ' +
    (currentConfig.screen1.noAnim === "kiss" ? "checked" : "") +
    "><div><strong>Поцелуй</strong><span>Кнопка прячется за поцелуем</span></div></label>" +
    '<label class="radio-option"><input type="radio" name="noAnim" value="shrink" ' +
    (currentConfig.screen1.noAnim === "shrink" ? "checked" : "") +
    "><div><strong>Уменьшение</strong><span>С каждым нажатием всё меньше</span></div></label>" +
    '<label class="radio-option"><input type="radio" name="noAnim" value="run" ' +
    (currentConfig.screen1.noAnim === "run" ? "checked" : "") +
    "><div><strong>Убегание</strong><span>Кнопка убегает от курсора</span></div></label>" +
    '<label class="radio-option"><input type="radio" name="noAnim" value="none" ' +
    (currentConfig.screen1.noAnim === "none" ? "checked" : "") +
    "><div><strong>Без анимации</strong></div></label>" +
    "</div></div>" +
    '<h3 class="editor-subtitle">Экран 2 — подтверждение</h3>' +
    imagePicker("step2", "screen2", currentConfig.screen2.image) +
    '<div class="field"><label>Заголовок</label><input type="text" id="s2-title" value="' +
    currentConfig.screen2.title +
    '"></div>' +
    '<div class="field"><label>Подзаголовок</label><input type="text" id="s2-subtitle" value="' +
    currentConfig.screen2.subtitle +
    '"></div>' +
    '<div class="field"><label>Кнопка подтверждения</label><input type="text" id="s2-confirm" value="' +
    currentConfig.screen2.confirmText +
    '"></div>' +
    '<div class="editor-nav"><span></span><button class="btn btn-primary" id="next-step">Продолжить</button></div>';

  bindStep1Events();
}

function bindStep1Events() {
  var panel = editorPanel();
  if (!panel) return;

  // Выбор изображений
  var pickers = panel.querySelectorAll(".image-picker");
  if (pickers[0]) {
    var opts = pickers[0].querySelectorAll(".image-option");
    for (var i = 0; i < opts.length; i++) {
      (function (opt) {
        opt.addEventListener("click", function () {
          currentConfig.screen1.image = opt.dataset.image;
          updatePreview();
          renderStep1();
        });
      })(opts[i]);
    }
  }
  if (pickers[1]) {
    var opts2 = pickers[1].querySelectorAll(".image-option");
    for (var j = 0; j < opts2.length; j++) {
      (function (opt) {
        opt.addEventListener("click", function () {
          currentConfig.screen2.image = opt.dataset.image;
          updatePreview();
          renderStep1();
        });
      })(opts2[j]);
    }
  }

  // Текстовые поля
  var fields = [
    { id: "s1-title", obj: currentConfig.screen1, key: "title" },
    { id: "s1-yes", obj: currentConfig.screen1, key: "yesText" },
    { id: "s1-no", obj: currentConfig.screen1, key: "noText" },
    { id: "s2-title", obj: currentConfig.screen2, key: "title" },
    { id: "s2-subtitle", obj: currentConfig.screen2, key: "subtitle" },
    { id: "s2-confirm", obj: currentConfig.screen2, key: "confirmText" },
  ];
  for (var k = 0; k < fields.length; k++) {
    (function (f) {
      var el = document.getElementById(f.id);
      if (el) {
        el.addEventListener("input", function () {
          f.obj[f.key] = el.value;
          updatePreview();
        });
      }
    })(fields[k]);
  }

  // Радиокнопки анимаций
  var yesRadios = panel.querySelectorAll('input[name="yesAnim"]');
  for (var r = 0; r < yesRadios.length; r++) {
    yesRadios[r].addEventListener("change", function () {
      currentConfig.screen1.yesAnim = this.value;
    });
  }
  var noRadios = panel.querySelectorAll('input[name="noAnim"]');
  for (var s = 0; s < noRadios.length; s++) {
    noRadios[s].addEventListener("change", function () {
      currentConfig.screen1.noAnim = this.value;
    });
  }

  // Кнопка "Продолжить"
  var nextBtn = document.getElementById("next-step");
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      currentStep = 2;
      renderStep();
    });
  }
}

function renderStep2() {
  var panel = editorPanel();
  if (!panel) return;

  panel.innerHTML =
    "" +
    "<h2>Экран выбора даты и времени</h2>" +
    '<p class="editor-hint">Заголовок и кнопка для шага, где приглашённый выбирает дату и время</p>' +
    imagePicker("step3", "screen3", currentConfig.screen3.image) +
    '<div class="field"><label>Заголовок</label><input type="text" id="s3-title" value="' +
    currentConfig.screen3.title +
    '"></div>' +
    '<div class="field"><label>Текст кнопки</label><input type="text" id="s3-btn" value="' +
    currentConfig.screen3.buttonText +
    '"></div>' +
    '<div class="editor-nav"><button class="btn btn-ghost" id="prev-step">← Назад</button><button class="btn btn-primary" id="next-step">Продолжить</button></div>';

  // Выбор изображения
  var opts = panel.querySelectorAll(".image-option");
  for (var i = 0; i < opts.length; i++) {
    (function (opt) {
      opt.addEventListener("click", function () {
        currentConfig.screen3.image = opt.dataset.image;
        updatePreview();
        renderStep2();
      });
    })(opts[i]);
  }

  // Текстовые поля
  var titleEl = document.getElementById("s3-title");
  if (titleEl) {
    titleEl.addEventListener("input", function () {
      currentConfig.screen3.title = this.value;
      updatePreview();
    });
  }
  var btnEl = document.getElementById("s3-btn");
  if (btnEl) {
    btnEl.addEventListener("input", function () {
      currentConfig.screen3.buttonText = this.value;
      updatePreview();
    });
  }

  // Кнопки
  var prevBtn = document.getElementById("prev-step");
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      currentStep = 1;
      renderStep();
    });
  }
  var nextBtn = document.getElementById("next-step");
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      currentStep = 3;
      renderStep();
    });
  }
}

function renderStep3() {
  var panel = editorPanel();
  if (!panel) return;

  var dishesHtml = "";
  for (var i = 0; i < currentConfig.screen4.dishes.length; i++) {
    var d = currentConfig.screen4.dishes[i];
    var open = i === 0 ? " open" : "";
    dishesHtml +=
      '<details class="dish-item"' +
      open +
      ">" +
      "<summary>Блюдо " +
      (i + 1) +
      " — " +
      d.name +
      ' <button type="button" class="btn-delete" data-index="' +
      i +
      '">Удалить</button></summary>' +
      '<div class="dish-row">' +
      '<input class="dish-emoji-input" data-index="' +
      i +
      '" value="' +
      d.emoji +
      '" maxlength="4">' +
      '<input type="text" data-index="' +
      i +
      '" data-field="name" value="' +
      d.name +
      '" style="flex:1">' +
      "</div></details>";
  }

  panel.innerHTML =
    "" +
    "<h2>Настрой экран выбора блюда</h2>" +
    '<p class="editor-hint">От 3 до 6 вариантов</p>' +
    '<div class="field"><label>Заголовок</label><input type="text" id="s4-title" value="' +
    currentConfig.screen4.title +
    '"></div>' +
    '<div class="field"><label>Подзаголовок</label><input type="text" id="s4-subtitle" value="' +
    currentConfig.screen4.subtitle +
    '"></div>' +
    '<div class="dish-list" id="dish-list">' +
    dishesHtml +
    "</div>" +
    '<button class="btn btn-secondary" id="add-dish" style="margin-top:12px;width:100%">+ Добавить блюдо</button>' +
    '<div class="editor-nav"><button class="btn btn-ghost" id="prev-step">← Назад</button><button class="btn btn-primary" id="next-step">Продолжить</button></div>';

  // Заголовки
  var titleEl = document.getElementById("s4-title");
  if (titleEl) {
    titleEl.addEventListener("input", function () {
      currentConfig.screen4.title = this.value;
      updatePreview();
    });
  }
  var subEl = document.getElementById("s4-subtitle");
  if (subEl) {
    subEl.addEventListener("input", function () {
      currentConfig.screen4.subtitle = this.value;
      updatePreview();
    });
  }

  // Блюда - эмодзи
  var emojiInputs = panel.querySelectorAll(".dish-emoji-input");
  for (var e = 0; e < emojiInputs.length; e++) {
    (function (inp) {
      inp.addEventListener("input", function () {
        var idx = parseInt(inp.dataset.index);
        if (currentConfig.screen4.dishes[idx]) {
          currentConfig.screen4.dishes[idx].emoji = inp.value;
          updatePreview();
        }
      });
    })(emojiInputs[e]);
  }

  // Блюда - названия
  var nameInputs = panel.querySelectorAll('[data-field="name"]');
  for (var n = 0; n < nameInputs.length; n++) {
    (function (inp) {
      inp.addEventListener("input", function () {
        var idx = parseInt(inp.dataset.index);
        if (currentConfig.screen4.dishes[idx]) {
          currentConfig.screen4.dishes[idx].name = inp.value;
          updatePreview();
        }
      });
    })(nameInputs[n]);
  }

  // Удаление блюда
  var deleteBtns = panel.querySelectorAll(".btn-delete");
  for (var d = 0; d < deleteBtns.length; d++) {
    (function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        if (currentConfig.screen4.dishes.length <= 3) return;
        var idx = parseInt(btn.dataset.index);
        currentConfig.screen4.dishes.splice(idx, 1);
        renderStep3();
        updatePreview();
      });
    })(deleteBtns[d]);
  }

  // Добавление блюда
  var addBtn = document.getElementById("add-dish");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      if (currentConfig.screen4.dishes.length >= 6) return;
      currentConfig.screen4.dishes.push({ emoji: "🍰", name: "Десерт" });
      renderStep3();
      updatePreview();
    });
  }

  // Кнопки навигации
  var prevBtn = document.getElementById("prev-step");
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      currentStep = 2;
      renderStep();
    });
  }
  var nextBtn = document.getElementById("next-step");
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      currentStep = 4;
      renderStep();
    });
  }
}

function renderStep4() {
  var panel = editorPanel();
  if (!panel) return;

  panel.innerHTML =
    "" +
    "<h2>Финальный экран</h2>" +
    '<p class="editor-hint">В описании {date}, {time} и {food} автоматически подставят выбор приглашённого</p>' +
    imagePicker("step3", "screen5", currentConfig.screen5.image) +
    '<div class="field"><label>Заголовок</label><input type="text" id="s5-title" value="' +
    currentConfig.screen5.title +
    '"></div>' +
    '<div class="field"><label>Описание</label><textarea id="s5-desc" rows="3">' +
    currentConfig.screen5.description +
    "</textarea></div>" +
    '<div class="editor-nav"><button class="btn btn-ghost" id="prev-step">← Назад</button><button class="btn btn-primary" id="create-invite">Создать приглашение ❤️</button></div>';

  // Выбор изображения
  var opts = panel.querySelectorAll(".image-option");
  for (var i = 0; i < opts.length; i++) {
    (function (opt) {
      opt.addEventListener("click", function () {
        currentConfig.screen5.image = opt.dataset.image;
        updatePreview();
        renderStep4();
      });
    })(opts[i]);
  }

  // Заголовок
  var titleEl = document.getElementById("s5-title");
  if (titleEl) {
    titleEl.addEventListener("input", function () {
      currentConfig.screen5.title = this.value;
      updatePreview();
    });
  }

  // Описание
  var descEl = document.getElementById("s5-desc");
  if (descEl) {
    descEl.addEventListener("input", function () {
      currentConfig.screen5.description = this.value;
      updatePreview();
    });
  }

  // Назад
  var prevBtn = document.getElementById("prev-step");
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      currentStep = 3;
      renderStep();
    });
  }

  // Создать приглашение
  var createBtn = document.getElementById("create-invite");
  if (createBtn) {
    createBtn.addEventListener("click", function () {
      if (typeof window.onInviteCreated === "function") {
        window.onInviteCreated(currentConfig);
      } else {
        alert("Ошибка: функция создания не найдена. Обновите страницу.");
      }
    });
  }
}

function updateProgress() {
  var dotMap = { 1: 1, 2: 2, 3: 3, 4: 4 };
  var activeDot = dotMap[currentStep] || 1;

  var dots = document.querySelectorAll(".dot");
  for (var i = 0; i < dots.length; i++) {
    var step = parseInt(dots[i].dataset.step);
    dots[i].classList.toggle("active", step === activeDot);
    dots[i].classList.toggle("done", step < activeDot);
  }

  var fill = document.getElementById("progress-fill");
  if (fill) {
    fill.style.width = ((activeDot - 1) / 4) * 100 + "%";
  }
}

function updatePreview() {
  var el = previewEl();
  if (!el) return;

  if (currentStep <= 2) {
    var tabs = screenTabs();
    if (tabs) tabs.classList.remove("hidden");
    el.innerHTML = renderPreview(currentConfig, previewTab);
  } else {
    var tabs2 = screenTabs();
    if (tabs2) tabs2.classList.add("hidden");
    el.innerHTML = renderPreview(currentConfig, currentStep);
  }
}

function renderStep() {
  updatePreview();
  updateProgress();

  if (currentStep === 1) renderStep1();
  else if (currentStep === 2) renderStep2();
  else if (currentStep === 3) renderStep3();
  else if (currentStep === 4) renderStep4();
}

function initConstructor() {
  currentStep = 1;
  previewTab = 1;
  currentConfig = cloneConfig();

  // Настройка вкладок
  var tabs = screenTabs();
  if (tabs) {
    var tabBtns = tabs.querySelectorAll(".tab");
    for (var i = 0; i < tabBtns.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          previewTab = parseInt(btn.dataset.tab);
          var allTabs = tabs.querySelectorAll(".tab");
          for (var j = 0; j < allTabs.length; j++) {
            allTabs[j].classList.toggle(
              "active",
              parseInt(allTabs[j].dataset.tab) === previewTab
            );
          }
          updatePreview();
        });
      })(tabBtns[i]);
    }
  }

  renderStep();
}

// Делаем функции глобальными
window.initConstructor = initConstructor;
window.currentConfig = currentConfig;
