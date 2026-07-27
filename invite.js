(function () {
  var params = new URLSearchParams(window.location.search);
  var encoded = params.get("d");
  console.log("Получен параметр d:", encoded);
  if (encoded) {
    try {
      encoded = decodeURIComponent(encoded);
      console.log(
        "После decodeURIComponent:",
        encoded.substring(0, 50) + "..."
      );
    } catch (e) {
      console.log("Не удалось декодировать URI");
    }
  }
  var config = encoded ? decodeConfig(encoded) : null;
  console.log("Декодированная конфигурация:", config);
  var screen = document.getElementById("invite-screen");
  if (!config) {
    screen.innerHTML =
      '<div class="screen-content"><h2>Приглашение не найдено 😔</h2><p class="screen-subtitle">Ссылка повреждена или устарела</p></div>';
    return;
  }
  var step = 1;
  var answers = { date: "", time: "", food: "", foodEmoji: "" };
  function goTo(next) {
    step = next;
    render();
  }
  function sendToTelegram(answers) {
    var token = "8936051544:AAGakRRtXc3QpH6OP_kUqe7xJTZ0SUa8GOM";
    var chatId = 123456789;
    var text =
      "🎉 НОВЫЙ ОТВЕТ НА ПРИГЛАШЕНИЕ! 🎉\n\n" +
      "📅 Дата: " +
      answers.date +
      "\n" +
      "⏰ Время: " +
      answers.time +
      "\n" +
      "🍽 Блюдо: " +
      answers.food +
      " " +
      (answers.foodEmoji || "") +
      "\n" +
      "🔗 Ссылка: " +
      window.location.href;
    var url = "https://api.telegram.org/bot" + token + "/sendMessage";
    console.log("📤 Отправка в Telegram...");
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "HTML" }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Ответ от Telegram:", data);
        if (data.ok) {
          console.log("✅ Ответ отправлен в Telegram!");
          showNotification("Уведомление отправлено! ❤️");
        } else {
          console.log("❌ Ошибка:", data.description);
          showNotification("Ошибка отправки уведомления 😔");
        }
      })
      .catch((error) => {
        console.error("❌ Ошибка отправки:", error);
        showNotification("Ошибка соединения 😔");
      });
  }
  function showNotification(text) {
    var notification = document.createElement("div");
    notification.style.cssText =
      "position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);" +
      "background: #eb6990; color: white; padding: 16px 32px;" +
      "border-radius: 60px; font-family: Comfortaa, sans-serif;" +
      "font-weight: 600; font-size: 16px; z-index: 9999;" +
      "box-shadow: 0 8px 24px rgba(235, 105, 144, 0.4);" +
      "animation: slideUp 0.5s ease;";
    notification.textContent = text;
    document.body.appendChild(notification);
    setTimeout(function () {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.5s";
      setTimeout(function () {
        notification.remove();
      }, 500);
    }, 3000);
  }
  function render() {
    screen.innerHTML = "";
    if (step === 1) {
      screen.innerHTML = renderScreen1(config, true);
      var yesBtn = screen.querySelector(".interactive-yes");
      var noBtn = screen.querySelector(".interactive-no");
      if (yesBtn) {
        yesBtn.addEventListener("click", function () {
          if (config.screen1.yesAnim === "hearts") {
            playYesAnimation(screen, function () {
              goTo(2);
            });
          } else {
            goTo(2);
          }
        });
      }
      if (noBtn) {
        setupNoButton(noBtn, config.screen1.noAnim, screen, function () {
          goTo(2);
        });
      }
    } else if (step === 2) {
      screen.innerHTML = renderScreen2(config);
      var confirmBtn = screen.querySelector(".interactive-confirm");
      if (confirmBtn) {
        confirmBtn.addEventListener("click", function () {
          goTo(3);
        });
      }
    } else if (step === 3) {
      screen.innerHTML = renderScreen3(config, answers);
      var dateInput = screen.querySelector(".date-input");
      var timeInput = screen.querySelector(".time-input");
      var submitBtn = screen.querySelector(".date-submit");
      function checkInputs() {
        if (dateInput && timeInput && submitBtn) {
          submitBtn.disabled = !dateInput.value || !timeInput.value;
        }
      }
      if (dateInput) dateInput.addEventListener("input", checkInputs);
      if (timeInput) timeInput.addEventListener("input", checkInputs);
      setTimeout(checkInputs, 50);
      if (submitBtn) {
        submitBtn.addEventListener("click", function () {
          if (dateInput && timeInput && dateInput.value && timeInput.value) {
            answers.date = formatDate(dateInput.value);
            answers.time = timeInput.value;
            goTo(4);
          }
        });
      }
    } else if (step === 4) {
      screen.innerHTML = renderScreen4(config);
      var cards = screen.querySelectorAll(".food-card");
      for (var i = 0; i < cards.length; i++) {
        (function (card, index) {
          card.addEventListener("click", function () {
            var dish = config.screen4.dishes[index];
            if (dish) {
              answers.food = dish.name;
              answers.foodEmoji = dish.emoji;
              sendToTelegram(answers);
              var allCards = screen.querySelectorAll(".food-card");
              for (var j = 0; j < allCards.length; j++) {
                allCards[j].classList.remove("selected");
              }
              card.classList.add("selected");
              setTimeout(function () {
                goTo(5);
              }, 400);
            }
          });
        })(cards[i], i);
      }
    } else if (step === 5) {
      screen.innerHTML = renderScreen5(config, answers);
      var response = document.createElement("div");
      response.className = "response-card";
      response.innerHTML =
        "<strong>Твой ответ:</strong><br>" +
        "📅 " +
        (answers.date || "не выбрана") +
        " в " +
        (answers.time || "не выбрано") +
        "<br>" +
        "🍽 " +
        (answers.food || "не выбрано") +
        "<br><br>" +
        '<button class="btn btn-primary" id="copy-response" style="width:100%">Скопировать ответ</button>';
      var content = screen.querySelector(".screen-content");
      if (content) {
        content.appendChild(response);
      }
      var copyBtn = document.getElementById("copy-response");
      if (copyBtn) {
        copyBtn.addEventListener("click", function () {
          var text =
            "Я согласна! " +
            (answers.date || "дата") +
            " в " +
            (answers.time || "время") +
            ", хочу " +
            (answers.food || "блюдо") +
            " ❤️";
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
              .writeText(text)
              .then(function () {
                copyBtn.textContent = "Скопировано!";
                setTimeout(function () {
                  copyBtn.textContent = "Скопировать ответ";
                }, 2000);
              })
              .catch(function () {
                fallbackCopy(text, copyBtn);
              });
          } else {
            fallbackCopy(text, copyBtn);
          }
        });
      }
    }
  }
  function fallbackCopy(text, btn) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    btn.textContent = "Скопировано!";
    setTimeout(function () {
      btn.textContent = "Скопировать ответ";
    }, 2000);
  }
  render();
})();
