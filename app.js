function showSection(id) {
  var sections = ["landing", "constructor", "result"];
  for (var i = 0; i < sections.length; i++) {
    var el = document.getElementById(sections[i]);
    if (el) {
      if (sections[i] === id) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
  }
}

function onInviteCreated(cfg) {
  try {
    var encoded = encodeConfig(cfg);
    console.log("Длина закодированной строки:", encoded.length);

    var currentUrl = window.location.href;
    var base = currentUrl.substring(0, currentUrl.lastIndexOf("/") + 1);
    var link = base + "invite.html?d=" + encodeURIComponent(encoded);

    console.log("Ссылка:", link);
    console.log("Длина ссылки:", link.length);

    var linkInput = document.getElementById("invite-link");
    if (linkInput) {
      linkInput.value = link;
    }
    showSection("result");
  } catch (e) {
    console.error("Ошибка при создании ссылки:", e);
    alert("Ошибка при создании ссылки. Проверьте консоль.");
  }
}

window.onInviteCreated = onInviteCreated;

function initApp() {
  // Кнопка "Создать приглашение" на лендинге
  var startBtn = document.getElementById("start-create");
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      showSection("constructor");
      if (typeof window.initConstructor === "function") {
        window.initConstructor();
      }
    });
  }

  // Кнопка "Копировать"
  var copyBtn = document.getElementById("copy-link");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var input = document.getElementById("invite-link");
      if (!input) return;
      input.select();
      try {
        document.execCommand("copy");
        copyBtn.textContent = "Скопировано!";
        setTimeout(function () {
          copyBtn.textContent = "Копировать";
        }, 2000);
      } catch (e) {
        alert("Скопируйте ссылку вручную: " + input.value);
      }
    });
  }

  // Кнопка "Открыть приглашение"
  var openBtn = document.getElementById("open-invite");
  if (openBtn) {
    openBtn.addEventListener("click", function () {
      var input = document.getElementById("invite-link");
      if (input && input.value) {
        window.open(input.value, "_blank");
      }
    });
  }

  // Кнопка "Создать ещё одно"
  var anotherBtn = document.getElementById("create-another");
  if (anotherBtn) {
    anotherBtn.addEventListener("click", function () {
      showSection("constructor");
      if (typeof window.initConstructor === "function") {
        window.initConstructor();
      }
    });
  }

  // Логотипы для возврата на главную
  var logoIds = ["logo-home", "logo-home-2"];
  for (var i = 0; i < logoIds.length; i++) {
    var el = document.getElementById(logoIds[i]);
    if (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        showSection("landing");
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", initApp);
