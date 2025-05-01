document.addEventListener("DOMContentLoaded", () => {
  const contactBtn = document.getElementById("contactBtn");
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".close");
  const cancelModal = document.getElementById("cancelModal");

  contactBtn.addEventListener("click", () => modal.style.display = "flex");
  closeBtn.addEventListener("click", () => modal.style.display = "none");
  cancelModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  const counters = document.querySelectorAll("[data-count]");
  counters.forEach(el => {
    const target = +el.dataset.count;
    let count = 0;
    const step = Math.ceil(target / 50);
    const interval = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count === target) clearInterval(interval);
    }, 50);
  });

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
          btn.addEventListener("click", () => {
            const idx = +btn.dataset.index;
            const correct = questions[current].answer;
            if (idx === correct) {
              btn.classList.add("correct");
              btn.textContent += " 😄";
              score++;
            } else {
              btn.classList.add("wrong");
              btn.textContent += " 😢";
              document.querySelector(`.quiz-option[data-index='${correct}']`).classList.add("correct");
            }
            document.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);
            setTimeout(() => {
              current++;
              if (current < questions.length) showQuestion();
              else showResult();
            }, 1500);
          });
        });
      }

      function showResult() {
        container.innerHTML = `
          <div class="quiz-result">
            <h3>Вы набрали ${score} из ${questions.length}</h3>
            <div class="confetti">🎉🎉🎉</div>
            <button id="finalContact" class="btn btn-primary">Записаться</button>
          </div>
        `;
        document.getElementById("finalContact").addEventListener("click", () => modal.style.display = "flex");
      }

      showQuestion();
    })
    .catch(() => {
      document.getElementById("quiz-container").innerHTML = "<p>Ошибка загрузки квиза.</p>";
    });
});

function scrollToQuiz() {
  document.getElementById("quiz").scrollIntoView({ behavior: 'smooth' });
}