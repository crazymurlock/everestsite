document.addEventListener("DOMContentLoaded", () => {
  // Modal open/close
  const contactBtn = document.getElementById("contactBtn");
  const signupQuiz = document.getElementById("signupQuiz");
  const tryPlay = document.getElementById("tryPlay");
  const corpBtn = document.getElementById("corpBtn");
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".close");
  const cancelModal = document.getElementById("cancelModal");

  [contactBtn, signupQuiz, corpBtn].forEach(btn => {
    if (btn) btn.addEventListener("click", () => modal.style.display = "flex");
  });
  if (closeBtn) closeBtn.addEventListener("click", () => modal.style.display = "none");
  if (cancelModal) cancelModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  // Counters animation
  const aboutSection = document.getElementById("about");
  let countersAnimated = false;
  if (aboutSection) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!countersAnimated && entry.isIntersecting) {
          countersAnimated = true;
          document.querySelectorAll("[data-count]").forEach(el => {
            const target = +el.dataset.count;
            let count = 0;
            const step = Math.ceil(target / 50);
            const interval = setInterval(() => {
              count = Math.min(count + step, target);
              el.textContent = count;
              if (count === target) clearInterval(interval);
            }, 50);
          });
        }
      });
    }, { threshold: 0.5 }).observe(aboutSection);
  }

  // Quiz logic
  fetch("questions.json")
    .then(res => res.json())
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
          </div>`;
        container.querySelectorAll(".quiz-option").forEach(btn => {
          btn.addEventListener("click", () => {
            const idx = +btn.dataset.index, correct = q.answer;
            if (idx === correct) {
              btn.classList.add("correct");
              btn.textContent += " 😄";
              score++;
            } else {
              btn.classList.add("wrong");
              btn.textContent += " 😢";
              const correctBtn = container.querySelector(`.quiz-option[data-index="${correct}"]`);
              if (correctBtn) correctBtn.classList.add("correct");
            }
            container.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);
            setTimeout(() => current < questions.length - 1 ? showQuestion() : showResult(), 1500);
          });
        });
      }
      function showResult() {
        container.innerHTML = `
          <div class="quiz-result">
            <h3>Вы набрали ${score} из ${questions.length}</h3>
            <div class="confetti">🎉🎉🎉</div>
            <button id="finalContact" class="btn btn-primary">Записаться</button>
          </div>`;
        document.getElementById("finalContact")?.addEventListener("click", () => modal.style.display = "flex");
      }
      showQuestion();
    });

  // Photo slider controls
  const track = document.querySelector(".photo-slider-track");
  const prev = document.querySelector(".slider-btn.prev");
  const next = document.querySelector(".slider-btn.next");
  if (track && prev && next) {
    const cardWidth = document.querySelector(".photo-card").clientWidth + 16;
    prev.addEventListener("click", () => track.scrollBy({ left: -cardWidth, behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: cardWidth, behavior: "smooth" }));
  }
});