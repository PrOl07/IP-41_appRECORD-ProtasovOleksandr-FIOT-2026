
"use strict";

/* =========================================================
   1. ПЕРЕМИКАННЯ МІЖ ЛАБОРАТОРНИМИ РОБОТАМИ
   ========================================================= */

function openLab(event, labId) {
    // Знаходимо всі лабораторні роботи
    const labs = document.querySelectorAll(".lab-content");

    // Приховуємо всі лабораторні роботи
    labs.forEach(function (lab) {
        lab.classList.remove("active");
    });

    // Знімаємо активний стан з усіх кнопок
    const buttons = document.querySelectorAll(".tab-button");

    buttons.forEach(function (button) {
        button.classList.remove("active");
    });

    // Відкриваємо вибрану лабораторну роботу
    const selectedLab = document.getElementById(labId);

    if (selectedLab) {
        selectedLab.classList.add("active");

        // Позначаємо вибрану кнопку як активну
        if (event && event.currentTarget) {
            event.currentTarget.classList.add("active");
        }

        // Повертаємо сторінку до початку вибраної роботи
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    } else {
        console.warn(
            "Лабораторну роботу з ID '" + labId + "' не знайдено."
        );
    }
}

// Робимо функцію доступною для onclick в HTML
window.openLab = openLab;


/* =========================================================
   2. ВНУТРІШНЯ НАВІГАЦІЯ МІЖ РОЗДІЛАМИ
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Знаходимо посилання внутрішньої навігації
    const navigationLinks = document.querySelectorAll(
        ".side-navigation a[href^='#']"
    );

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            // Ігноруємо порожні посилання
            if (!targetId || targetId === "#") {
                return;
            }

            const targetSection = document.querySelector(targetId);

            // Якщо цільовий розділ існує на сторінці
            if (targetSection) {
                event.preventDefault();

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                // Оновлюємо адресу посилання без стрибка сторінки
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, "", targetId);
                }

                // Позначаємо вибране посилання
                navigationLinks.forEach(function (item) {
                    item.classList.remove("active");
                });

                link.classList.add("active");
            }
        });
    });


    /* =========================================================
       3. ДЕМОНСТРАЦІЙНА ФОРМА
       ========================================================= */

    const exampleForm = document.querySelector(".example-form");

    if (exampleForm) {
        exampleForm.addEventListener("submit", function (event) {
            // Не перезавантажуємо сторінку після відправлення
            event.preventDefault();

            // Перевіряємо стандартні HTML-обмеження полів
            if (!exampleForm.checkValidity()) {
                exampleForm.reportValidity();
                return;
            }

            // Отримуємо значення полів форми
            const nameField = exampleForm.querySelector("#name");
            const emailField = exampleForm.querySelector("#email");
            const messageField = exampleForm.querySelector("#message");

            const name = nameField ? nameField.value.trim() : "";
            const email = emailField ? emailField.value.trim() : "";
            const message = messageField
                ? messageField.value.trim()
                : "";

            // Додаткова перевірка заповнення
            if (!name || !email || !message) {
                showFormMessage(
                    exampleForm,
                    "Будь ласка, заповніть усі поля форми.",
                    "error"
                );
                return;
            }

            // Перевіряємо формат електронної пошти
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                showFormMessage(
                    exampleForm,
                    "Введіть коректну адресу електронної пошти.",
                    "error"
                );
                return;
            }

            // Демонструємо успішне проходження перевірки
            showFormMessage(
                exampleForm,
                "Дякуємо, " + name +
                "! Форму успішно перевірено.",
                "success"
            );

            // Очищаємо поля після успішної перевірки
            exampleForm.reset();
        });
    }


    /* =========================================================
       4. ОБРОБКА ПОСИЛАНЬ ІЗ DATA-TARGET
       ========================================================= */

    // Підтримуємо кнопки, які перемикають розділи
    // за допомогою атрибута data-target.
    const targetButtons = document.querySelectorAll("[data-target]");

    targetButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const targetId = button.getAttribute("data-target");

            if (!targetId) {
                return;
            }

            // Підтримуємо формати "topic" та "#topic"
            const normalizedId = targetId.startsWith("#")
                ? targetId
                : "#" + targetId;

            const target = document.querySelector(normalizedId);

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

});


/* =========================================================
   5. ВІДОБРАЖЕННЯ ПОВІДОМЛЕНЬ ФОРМИ
   ========================================================= */

function showFormMessage(form, message, type) {
    // Знаходимо вже створений блок повідомлення
    let messageElement = form.querySelector(".form-message");

    // Якщо блоку ще немає, створюємо його
    if (!messageElement) {
        messageElement = document.createElement("p");
        messageElement.className = "form-message";

        messageElement.setAttribute("role", "status");
        messageElement.setAttribute("aria-live", "polite");

        form.appendChild(messageElement);
    }

    // Встановлюємо текст повідомлення
    messageElement.textContent = message;

    // Оновлюємо клас для стилізації
    messageElement.classList.remove(
        "form-message-success",
        "form-message-error"
    );

    if (type === "success") {
        messageElement.classList.add("form-message-success");
    } else {
        messageElement.classList.add("form-message-error");
    }
}
