document.addEventListener("DOMContentLoaded", () => {
  const contactBtn = document.getElementById("contactBtn");
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".close");
  const cancelModal = document.getElementById("cancelModal");
  const contactTriggers = [contactBtn];

  // Обработка открытия модалки
  contactTriggers.forEach(btn => {
    if (btn) btn.onclick = () => modal.style.display = "flex";
  });
  if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
  if (cancelModal) cancelModal.onclick = () => modal.style.display = "none";
  window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; }

  // Анимированные счётчики
  const counters = document.querySelectorAll("[data-count]");
  counters.forEach(el => {
    const target = +el.dataset.count;
    let count = 0;
    const interval = setInterval(() => {
      if (count >= target) {
        clearInterval(interval);
        el.textContent = target;
      } else {
        count += Math.ceil(target / 50);
        el.textContent = count;
      }
    }, 50);
  });

  // Загрузка квиза
  fetch("questions.json")
    .then(r => r.json())
    .then(questions => {
      let current = 0, score = 0;
      const container = document.getElementById("quiz-container");

      function showQuestion() {
        const q = questions[current];
        container.innerHTML = `
          <div class="quiz-card">
            <h3 class="quiz-question">${q.question}</h3>
            <div class="quiz-options">
              ${q.options.map((opt, i) => `<button class="quiz-option" data-index="${i}">${opt}</button>`).join("")}
            </div>
          </div>
        `;

        document.querySelectorAll(".quiz-option").forEach(btn => {
          btn.onclick = () => {
            const idx = +btn.dataset.index;
            const correct = q.answer;
            if (idx === correct) {
              btn.classList.add("correct");
              btn.innerHTML += " 😄";
              score++;
            } else {
              btn.classList.add("wrong");
              btn.innerHTML += " 😢";
              document.querySelector(`.quiz-option[data-index='${correct}']`).classList.add("correct");
            }
            document.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);
            setTimeout(() => {
              current++;
              if (current < questions.length) showQuestion();
              else showResult();
            }, 1500);
          };
        });
      }

      function showResult() {
        container.innerHTML = \`
          <div class="quiz-result">
            <h3>Вы набрали \${score} из \${questions.length}</h3>
            <div class="confetti">🎉🎉🎉</div>
            <button id="finalContact">Записаться</button>
          </div>\`;
        document.getElementById("finalContact").onclick = () => modal.style.display = "flex";
      }

      showQuestion();
    })
    .catch(err => {
      const container = document.getElementById("quiz-container");
      if (container) container.innerHTML = "<p>Ошибка загрузки квиза.</p>";
    });
});

function scrollToQuiz() {
  document.getElementById("quiz").scrollIntoView({ behavior: 'smooth' });
}
