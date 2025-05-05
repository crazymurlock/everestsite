document.addEventListener("DOMContentLoaded", () => {
  const contactBtn = document.getElementById("contactBtn");
  const signupQuiz = document.getElementById("signupQuiz");
  const tryPlay = document.getElementById("tryPlay");
  const corpBtn = document.getElementById("corpBtn");
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".close");
  const cancelModal = document.getElementById("cancelModal");
  const flag = document.querySelector(".flag-img");
  const progressBar = document.querySelector(".progress-bar");
  const headerContent = document.querySelector(".header-content");

  [contactBtn, signupQuiz, corpBtn].forEach(btn => {
    if (btn) btn.addEventListener("click", () => modal.style.display = "flex");
  });
  if (closeBtn) closeBtn.addEventListener("click", () => modal.style.display = "none");
  if (cancelModal) cancelModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

  window.addEventListener("scroll", () => {
    if (flag && progressBar && headerContent) {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const headerWidth = headerContent.clientWidth;
      const translateX = scrollPercent * headerWidth;
      flag.style.transform = `translateX(${translateX}px)`;
      progressBar.style.width = `${translateX}px`;
      flag.style.opacity = scrollPercent > 0 ? "1" : "0";
    }
  });

  const aboutSection = document.getElementById("about");
  let countersAnimated = false;
  if (aboutSection) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!countersAnimated && entry.isIntersecting) {
          countersAnimated = true;
          document.querySelectorAll("[data-count]").forEach(el => {
            const target = +el.dataset.count;
            let count=0;
            const step = Math.ceil(target/50);
            const interval = setInterval(() => {
              count = Math.min(count+step, target);
              el.textContent = count;
              if (count===target) clearInterval(interval);
            }, 50);
          });
        }
      });
    }, {threshold: 0.5}).observe(aboutSection);
  }

  fetch("questions.json").then(r=>r.json()).then(questions=>{
    let current=0, score=0;
    const container=document.getElementById("quiz-container");
    function showQuestion(){
      const q=questions[current];
      container.innerHTML=`<div class="quiz-card">
            <h3 class="quiz-question">${q.question}</h3>
            <div class="quiz-options">${q.options.map((o,i)=>`<button class="quiz-option" data-index="${i}">${o}</button>`).join("")}</div>
          </div>`;
      container.querySelectorAll(".quiz-option").forEach(btn=>{
        btn.addEventListener("click",()=>{
          const idx=+btn.dataset.index, correct=q.answer;
          if(idx===correct){btn.classList.add("correct");btn.textContent+=" 😄";score++;} 
          else {btn.classList.add("wrong");btn.textContent+=" 😢"; container.querySelector(`.quiz-option[data-index="${correct}"]`)?.classList.add("correct");}
          container.querySelectorAll(".quiz-option").forEach(b=>b.disabled=true);
          setTimeout(()=> current<questions.length-1 ? showQuestion() : showResult(), 1500);
        });
      });
    }
    function showResult(){
      container.innerHTML=`<div class="quiz-result"><h3>Вы набрали ${score} из ${questions.length}</h3><div class="confetti">🎉🎉🎉</div><button id="finalContact" class="btn btn-primary">Записаться</button></div>`;
      document.getElementById("finalContact")?.addEventListener("click",()=>modal.style.display="flex");
    }
    showQuestion();
  });

  tryPlay?.addEventListener("click",()=>scrollToQuiz());

  const track=document.querySelector(".slider-track");
  const prevBtn=document.querySelector(".slider-btn.prev");
  const nextBtn=document.querySelector(".slider-btn.next");
  if(track && prevBtn && nextBtn){
    const cardWidth=document.querySelector(".team-card").clientWidth+32;
    prevBtn.onclick=()=>track.scrollBy({left:-cardWidth,behavior:"smooth"});
    nextBtn.onclick=()=>track.scrollBy({left:cardWidth,behavior:"smooth"});
  }

  // Photo slider controls
  const photoTrack = document.querySelector('.photo-slider-track');
  const photoPrev = document.querySelector('.slider-btn.photo-prev');
  const photoNext = document.querySelector('.slider-btn.photo-next');
  if (photoTrack && photoPrev && photoNext) {
    const cardWidth = document.querySelector('.photo-card').clientWidth + 16;
    photoPrev.addEventListener('click', () => {
      photoTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
    photoNext.addEventListener('click', () => {
      photoTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

});

function scrollToQuiz(){
  document.getElementById("quiz")?.scrollIntoView({behavior:"smooth"});
}
