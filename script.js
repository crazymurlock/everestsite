document.addEventListener("DOMContentLoaded", () => {
  const contactBtn = document.getElementById("contactBtn");
  const corpBtn = document.getElementById("corpBtn");
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".close");
  const cancelModal = document.getElementById("cancelModal");
  const flag = document.querySelector(".flag-img");
  const progressBar = document.querySelector(".progress-bar");
  const headerContent = document.querySelector(".header-content");

  if (contactBtn) contactBtn.addEventListener("click", () => modal.style.display = "flex");
  if (corpBtn) corpBtn.addEventListener("click", () => modal.style.display = "flex");
  if (closeBtn) closeBtn.addEventListener("click", () => modal.style.display = "none");
  if (cancelModal) cancelModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  // Flag movement on scroll
  window.addEventListener("scroll", () => {
    if (flag && headerContent) {
      const maxTranslate = headerContent.clientWidth - flag.clientWidth - 20;
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      
    const translateX = Math.min(Math.max(scrollPercent * maxTranslate, 0), maxTranslate);
    flag.style.transform = `translateX(${translateX}px)`;
    if (progressBar) progressBar.style.transform = `translateX(${translateX}px)`;

    }
  });

  // Animate counters when visible
  const aboutSection = document.getElementById("about");
  let countersAnimated = false;
  const observer = new IntersectionObserver(entries => {
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
        observer.unobserve(aboutSection);
      }
    });
  }, { threshold: 0.5 });
  if (aboutSection) observer.observe(aboutSection);

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
              ${q.options.map((opt,i)=>`<button class="quiz-option" data-index="${i}">${opt}</button>`).join("")}
            </div>
          </div>`;
        container.querySelectorAll(".quiz-option").forEach(btn=>{
          btn.addEventListener("click",()=>{
            const idx=+btn.dataset.index, correct=q.answer;
            if(idx===correct){btn.classList.add("correct");btn.textContent+=" 😄";score++;}
            else{btn.classList.add("wrong");btn.textContent+=" 😢";const cBtn=container.querySelector(`.quiz-option[data-index="${correct}"]`);if(cBtn) cBtn.classList.add("correct");}
            container.querySelectorAll(".quiz-option").forEach(b=>b.disabled=true);
            setTimeout(()=>{current++;current<questions.length?showQuestion():showResult();},1500);
          });
        });
      }
      function showResult(){
        container.innerHTML=`
          <div class="quiz-result">
            <h3>Вы набрали ${score} из ${questions.length}</h3>
            <div class="confetti">🎉🎉🎉</div>
            <button id="finalContact" class="btn btn-primary">Записаться</button>
          </div>`;
        document.getElementById("finalContact").addEventListener("click",()=>modal.style.display="flex");
      }
      showQuestion();
    })
    .catch(()=>{
      const container=document.getElementById("quiz-container");
      if(container) container.innerHTML="<p>Ошибка загрузки квиза.</p>";
    });
});
function scrollToQuiz(){
  const el=document.getElementById("quiz");
  if(el) el.scrollIntoView({behavior:'smooth'});
}
