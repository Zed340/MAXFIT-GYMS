/* =========================================================
   MAXFIT GYMS ABUJA — Platform Logic
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const MEDIA = window.MAXFIT_MEDIA || {};

  /* ---------- HERO + MEDIA INIT ---------- */
  const heroImage = document.getElementById('heroImage');
  if (heroImage && MEDIA.hero) {
    window.maxfitImg(heroImage, MEDIA.hero.src, MEDIA.hero.fallback);
  }

  /* ---------- SCROLL PROGRESS + NAV SPY ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const navSectionLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-mobile a[href^="#"]');
  const spySections = [...document.querySelectorAll('section[id], footer[id]')];

  function onScrollUI(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress && docHeight > 0) {
      scrollProgress.style.width = `${Math.min(100, (scrollTop / docHeight) * 100)}%`;
    }
    let current = '';
    spySections.forEach(sec => {
      if (scrollTop >= sec.offsetTop - 120) current = sec.id;
    });
    navSectionLinks.forEach(link => {
      const id = link.getAttribute('href')?.slice(1);
      link.classList.toggle('is-active', id === current);
    });
  }
  window.addEventListener('scroll', onScrollUI, { passive: true });
  onScrollUI();

  /* ---------- PRELOADER ---------- */
  window.addEventListener('load', () => {
    setTimeout(()=> document.getElementById('preloader').classList.add('done'), 500);
  });
  setTimeout(()=> document.getElementById('preloader')?.classList.add('done'), 1800);

  /* ---------- NAV SCROLL STATE ---------- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  });

  const burger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  burger.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ---------- SCROLL REVEAL (AOS-lite) ---------- */
  const revealEls = document.querySelectorAll('[data-aos]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countIO.observe(c));

  function animateCount(el){
    const target = parseInt(el.dataset.count, 10);
    const dur = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + (target >= 1000 ? '+' : '');
    }
    requestAnimationFrame(tick);
  }

  /* =========================================================
     SCROLL RAIL ARROWS — trainers, stories, exercise reels
     Clicking an arrow scrolls the rail by one card-width.
     Reel arrows never open the video modal — they only move the rail.
  ========================================================= */
  function wireRailArrows(railEl, leftBtn, rightBtn, options = {}){
    if (!railEl || !leftBtn || !rightBtn) return;

    const { autoScroll = false, intervalMs = 4500, loop = true } = options;

    function cardWidth(){
      const firstCard = railEl.firstElementChild;
      if (!firstCard) return railEl.clientWidth * 0.8;
      const gap = parseFloat(getComputedStyle(railEl).gap) || 16;
      return firstCard.getBoundingClientRect().width + gap;
    }

    function updateArrowState(){
      const maxScroll = railEl.scrollWidth - railEl.clientWidth - 2;
      leftBtn.classList.toggle('is-disabled', !loop && railEl.scrollLeft <= 2);
      rightBtn.classList.toggle('is-disabled', !loop && railEl.scrollLeft >= maxScroll);
    }

    function scrollNext(){
      const maxScroll = railEl.scrollWidth - railEl.clientWidth - 2;
      if (railEl.scrollLeft >= maxScroll - 2) {
        railEl.scrollTo({ left: loop ? 0 : maxScroll, behavior: 'smooth' });
      } else {
        railEl.scrollBy({ left: cardWidth(), behavior: 'smooth' });
      }
    }

    function scrollPrev(){
      const maxScroll = railEl.scrollWidth - railEl.clientWidth - 2;
      if (railEl.scrollLeft <= 2) {
        if (loop) railEl.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        railEl.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
      }
    }

    leftBtn.addEventListener('click', () => {
      scrollPrev();
      if (autoScroll) pauseAuto(6000);
    });
    rightBtn.addEventListener('click', () => {
      scrollNext();
      if (autoScroll) pauseAuto(6000);
    });

    railEl.addEventListener('scroll', updateArrowState, { passive: true });
    window.addEventListener('resize', updateArrowState);
    setTimeout(updateArrowState, 400);
    updateArrowState();

    if (!autoScroll) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let paused = false;
    let pauseTimer = null;
    let autoTimer = null;

    function pauseAuto(ms){
      paused = true;
      clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => { paused = false; }, ms);
    }

    function startAuto(){
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (paused || document.hidden) return;
        scrollNext();
      }, intervalMs);
    }

    railEl.addEventListener('mouseenter', () => { paused = true; });
    railEl.addEventListener('mouseleave', () => { paused = false; });
    railEl.addEventListener('touchstart', () => pauseAuto(5000), { passive: true });
    railEl.addEventListener('wheel', () => pauseAuto(5000), { passive: true });

    const railIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startAuto();
        else clearInterval(autoTimer);
      });
    }, { threshold: 0.25 });
    railIO.observe(railEl);
    startAuto();
  }

  /* =========================================================
     CORE FEATURE #1 — AI-ASSISTED FITNESS SEARCH
  ========================================================= */
  const aiInput = document.getElementById('aiInput');
  const aiGo = document.getElementById('aiGo');
  const aiClose = document.getElementById('aiClose');
  const aiResult = document.getElementById('aiResult');
  const aiResultBody = document.getElementById('aiResultBody');
  const aiScanText = document.getElementById('aiScanText');
  const aiMic = document.getElementById('aiMic');
  const aiSearch = document.getElementById('aiSearch');
  const aiVoiceStudio = document.getElementById('aiVoiceStudio');
  const aiVoiceStatus = document.getElementById('aiVoiceStatus');
  const aiVoiceTranscript = document.getElementById('aiVoiceTranscript');
  const aiWaveform = document.getElementById('aiWaveform');
  const chips = document.querySelectorAll('.chip');

  /* Build voice waveform bars */
  if (aiWaveform) {
    for (let i = 0; i < 16; i++) {
      const bar = document.createElement('span');
      bar.className = 'wave-bar';
      bar.style.animationDelay = `${i * 0.06}s`;
      aiWaveform.appendChild(bar);
    }
  }

  /* Keyboard shortcut — / focuses AI search */
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== aiInput) {
      e.preventDefault();
      aiInput.focus();
      aiSearch?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (e.key === 'Escape') {
      aiResult?.classList.remove('show');
      stopVoiceUI();
    }
  });

  // Rotating placeholder examples
  const placeholders = [
    "I want to lose 10kg…",
    "I need a workout for football…",
    "I want to build muscle…",
    "I need beginner workouts…",
    "I want to improve my endurance…"
  ];
  let phIdx = 0;
  setInterval(() => {
    if (document.activeElement !== aiInput && aiInput.value === '') {
      phIdx = (phIdx + 1) % placeholders.length;
      aiInput.placeholder = placeholders[phIdx];
    }
  }, 2600);

  // Knowledge base for AI matching
  const goalProfiles = {
    fatloss: {
      key: 'fatloss', label: 'Fat Loss',
      program: 'MAXBURN Fat Loss Program', trainer: 'Coach Ada Eze — Fat Loss Specialist',
      plan: 'Pro Plan (₦35,000/mo)', schedule: '5 days/week — HIIT, Strength Circuits, Cardio',
      nutrition: 'Calorie-deficit plan, high protein, low refined carbs'
    },
    muscle: {
      key: 'muscle', label: 'Muscle Gain',
      program: 'MAXBUILD Hypertrophy Program', trainer: 'Coach Tunde Bello — Strength Coach',
      plan: 'Elite Plan (₦65,000/mo)', schedule: '6 days/week — Push/Pull/Legs split',
      nutrition: 'Calorie surplus, 1.8g protein/kg bodyweight, post-workout carbs'
    },
    football: {
      key: 'football', label: 'Football Performance',
      program: 'MAXSPEED Football Conditioning', trainer: 'Coach Chidi Obi — Performance Coach',
      plan: 'Elite Plan (₦65,000/mo)', schedule: '5 days/week — Speed, Agility, Match Fitness',
      nutrition: 'Carb-cycling for match days, electrolyte + hydration focus'
    },
    beginner: {
      key: 'beginner', label: 'Beginner Fitness',
      program: 'MAXSTART Foundations Program', trainer: 'Coach Funmi Lawal — Beginner Specialist',
      plan: 'Basic Plan (₦15,000/mo)', schedule: '3 days/week — Full-body fundamentals',
      nutrition: 'Balanced macros, simple meal structure, hydration habit-building'
    },
    endurance: {
      key: 'endurance', label: 'Endurance',
      program: 'MAXENDURE Cardio Conditioning', trainer: 'Coach Ifeoma Nnaji — Endurance Coach',
      plan: 'Pro Plan (₦35,000/mo)', schedule: '4–5 days/week — Zone 2 cardio + intervals',
      nutrition: 'Carb-timed fueling, anti-inflammatory foods, recovery nutrition'
    },
    general: {
      key: 'general', label: 'General Fitness',
      program: 'MAXFIT Total Conditioning', trainer: 'Coach Bola Hassan — General Fitness Coach',
      plan: 'Basic Plan (₦15,000/mo)', schedule: '3–4 days/week — Balanced full-body training',
      nutrition: 'Whole-food balanced diet, consistent hydration'
    }
  };

  function matchGoal(text){
    const t = text.toLowerCase();
    if (/football|soccer|match|pitch/.test(t)) return goalProfiles.football;
    if (/lose|fat|weight loss|slim|cut/.test(t)) return goalProfiles.fatloss;
    if (/muscle|bulk|gain|strength|bigger/.test(t)) return goalProfiles.muscle;
    if (/beginner|start|new to|never trained/.test(t)) return goalProfiles.beginner;
    if (/endurance|stamina|cardio|run|marathon/.test(t)) return goalProfiles.endurance;
    return goalProfiles.general;
  }

  function calcMatchScore(text, profile){
    const t = text.toLowerCase();
    const keywords = {
      fatloss: ['lose', 'fat', 'weight', 'slim', 'cut', 'kg'],
      muscle: ['muscle', 'bulk', 'gain', 'strength', 'bigger', 'hypertrophy'],
      football: ['football', 'soccer', 'match', 'pitch', 'agility'],
      beginner: ['beginner', 'start', 'new', 'never'],
      endurance: ['endurance', 'stamina', 'cardio', 'run', 'marathon'],
      general: ['fitness', 'health', 'train', 'workout']
    };
    const words = keywords[profile.key] || keywords.general;
    const hits = words.filter(w => t.includes(w)).length;
    return Math.min(98, 82 + hits * 4 + Math.floor(text.length / 20));
  }

  function stopVoiceUI(){
    aiSearch?.classList.remove('listening');
    aiMic?.classList.remove('listening');
    aiVoiceStudio?.setAttribute('hidden', '');
  }

  function runAISearch(query){
    if (!query || !query.trim()) {
      aiInput.focus();
      return;
    }
    stopVoiceUI();
    const profile = matchGoal(query);
    const score = calcMatchScore(query, profile);
    aiResult.classList.add('show');
    aiResultBody.innerHTML = '';
    aiScanText.textContent = 'ANALYZING GOAL…';

    const lines = [
      ['Detected Goal', profile.label],
      ['Recommended Program', profile.program],
      ['Recommended Trainer', profile.trainer],
      ['Suggested Membership', profile.plan],
      ['Weekly Schedule', profile.schedule],
      ['Nutrition Guidance', profile.nutrition]
    ];

    const dashOffset = 188 - (188 * score / 100);

    setTimeout(() => {
      aiScanText.textContent = 'MATCH COMPLETE ✓';
      const header = document.createElement('div');
      header.className = 'ai-match-header';
      header.innerHTML = `
        <div class="ai-match-ring">
          <svg viewBox="0 0 64 64"><circle class="ring-bg" cx="32" cy="32" r="28"/>
          <circle class="ring-fg" cx="32" cy="32" r="28" stroke-dasharray="188" stroke-dashoffset="${dashOffset}"/>
          </svg>
          <strong>${score}%</strong>
        </div>
        <div class="ai-match-meta">
          <h4>${profile.label} Match</h4>
          <p>AI confidence based on your goal description</p>
        </div>
      `;
      aiResultBody.appendChild(header);
      lines.forEach((line, i) => {
        const row = document.createElement('div');
        row.className = 'result-line';
        row.style.animationDelay = `${i * 0.12}s`;
        row.innerHTML = `<span class="rl-k">${line[0]}</span><span class="rl-v">${line[1]}</span>`;
        aiResultBody.appendChild(row);
      });
      const cta = document.createElement('div');
      cta.className = 'result-card-cta';
      cta.innerHTML = `
        <a href="#book" class="btn btn-primary btn-sm">Book ${profile.trainer.split('—')[0].trim()}</a>
        <a href="#plans" class="btn btn-outline btn-sm">View ${profile.plan.split('(')[0].trim()}</a>
      `;
      aiResultBody.appendChild(cta);
    }, 900);

    aiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  aiGo.addEventListener('click', () => runAISearch(aiInput.value));
  aiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') runAISearch(aiInput.value); });
  aiClose.addEventListener('click', () => { aiResult.classList.remove('show'); stopVoiceUI(); });

  // Voice input — live waveform, interim transcript, Web Speech API
  let activeRec = null;
  aiMic.addEventListener('click', () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      aiVoiceStudio?.removeAttribute('hidden');
      aiVoiceStatus.textContent = 'Voice not supported — type your goal or use keyboard mic';
      aiInput.focus();
      return;
    }
    if (activeRec) {
      activeRec.stop();
      return;
    }

    const rec = new SpeechRec();
    activeRec = rec;
    rec.lang = 'en-NG';
    rec.interimResults = true;
    rec.continuous = false;

    aiSearch?.classList.add('listening');
    aiMic.classList.add('listening');
    aiVoiceStudio?.removeAttribute('hidden');
    aiVoiceStatus.textContent = 'LISTENING — speak your fitness goal…';
    aiVoiceTranscript.textContent = '';

    rec.onresult = (e) => {
      let interim = '';
      let finalText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else interim += t;
      }
      aiVoiceTranscript.textContent = finalText || interim;
      if (finalText) {
        aiInput.value = finalText.trim();
        aiVoiceStatus.textContent = 'PROCESSING…';
      }
    };
    rec.onend = () => {
      activeRec = null;
      aiMic.classList.remove('listening');
      aiSearch?.classList.remove('listening');
      const text = aiInput.value.trim();
      if (text) {
        aiVoiceStatus.textContent = 'GOAL CAPTURED ✓';
        runAISearch(text);
      } else {
        aiVoiceStatus.textContent = 'No speech detected — try again';
        setTimeout(() => aiVoiceStudio?.setAttribute('hidden', ''), 2000);
      }
    };
    rec.onerror = () => {
      activeRec = null;
      stopVoiceUI();
      aiVoiceStudio?.removeAttribute('hidden');
      aiVoiceStatus.textContent = 'Mic error — check permissions and try again';
    };
    rec.start();
  });

  chips.forEach(chip => chip.addEventListener('click', () => {
    aiInput.value = chip.dataset.q;
    runAISearch(chip.dataset.q);
  }));

  /* =========================================================
     CORE FEATURE #2 — SMART MANUAL FITNESS FINDER
  ========================================================= */
  const findBtn = document.getElementById('findBtn');
  const filterResult = document.getElementById('filterResult');

  findBtn.addEventListener('click', () => {
    const goal = document.getElementById('fGoal').value || 'General Fitness';
    const level = document.getElementById('fLevel').value || 'Any Level';
    const gender = document.getElementById('fGender').value || 'Any';
    const age = document.getElementById('fAge').value || 'Any Age';
    const membership = document.getElementById('fMembership').value || 'Recommended Plan';
    const days = document.getElementById('fDays').value || 'Flexible';
    const category = document.getElementById('fCategory').value || 'Mixed Training';

    const trainerMap = {
      'Fat Loss': 'Coach Ada Eze', 'Muscle Gain': 'Coach Tunde Bello',
      'Football Performance': 'Coach Chidi Obi', 'Endurance': 'Coach Ifeoma Nnaji',
      'General Fitness': 'Coach Bola Hassan'
    };
    const trainer = trainerMap[goal] || 'Coach Bola Hassan';
    const matchScore = 84 + Math.floor(Math.random() * 13);

    filterResult.innerHTML = `
      <div class="rec-card">
        <div class="rec-top">
          <h3>${goal} Program</h3>
          <span class="rec-match">${matchScore}% MATCH</span>
        </div>
        <div class="rec-grid">
          <div class="rec-item"><span>Fitness Level</span><strong>${level}</strong></div>
          <div class="rec-item"><span>Trainer</span><strong>${trainer}</strong></div>
          <div class="rec-item"><span>Gender Focus</span><strong>${gender}</strong></div>
          <div class="rec-item"><span>Age Group</span><strong>${age}</strong></div>
          <div class="rec-item"><span>Membership</span><strong>${membership}</strong></div>
          <div class="rec-item"><span>Training Days</span><strong>${days}</strong></div>
          <div class="rec-item"><span>Category Focus</span><strong>${category}</strong></div>
          <div class="rec-item"><span>Suggested Weekly Plan</span><strong>3–6 sessions, structured</strong></div>
        </div>
        <div class="rec-actions">
          <a href="#book" class="btn btn-primary btn-sm">Book ${trainer}</a>
          <a href="#plans" class="btn btn-outline btn-sm">View Plans</a>
        </div>
      </div>
    `;
    filterResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* =========================================================
     CORE FEATURE #3 — EXERCISE REELS (local images + videos)
  ========================================================= */
  const reelsData = MEDIA.reels || [];

  const reelsRail = document.getElementById('reelsRail');
  function renderReels(filter){
    reelsRail.innerHTML = '';
    const data = filter === 'all' ? reelsData : reelsData.filter(r => r.cat === filter || (filter === 'Football' && r.cat === 'Football'));
    data.forEach(r => {
      const card = document.createElement('div');
      card.className = 'reel-card';
      card.innerHTML = `
        <img src="${r.poster}" alt="${r.name}" loading="lazy" data-fallback="${r.posterFallback}">
        <div class="reel-overlay">
          <div class="reel-top-tags">
            <span class="reel-cat">${r.cat}</span>
            <span class="reel-video-tag">▶ REEL</span>
          </div>
          <div class="reel-play"><svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div>
          <div class="reel-info">
            <h4>${r.name}</h4>
            <div class="reel-meta">
              <span class="diff">${r.diff}</span>
              <span>🔥 ${r.cal} kcal</span>
              <span>⏱ ${r.dur}</span>
            </div>
          </div>
        </div>
      `;
      const img = card.querySelector('img');
      window.maxfitImg(img, r.poster, r.posterFallback);
      card.addEventListener('click', () => openVideoModal(r));
      reelsRail.appendChild(card);
    });
  }
  renderReels('all');

  document.querySelectorAll('.rtab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderReels(tab.dataset.cat);
    });
  });

  /* ---------- VIDEO MODAL ---------- */
  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  document.getElementById('modalClose').addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeVideoModal(); });

  function closeVideoModal(){
    const vid = modalVideo.querySelector('video');
    if (vid) { vid.pause(); vid.src = ''; }
    videoModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  function showVideoFallback(r){
    modalVideo.innerHTML = `
      <div class="modal-fallback">
        <img id="modalFallbackImg" src="${r.poster}" alt="${r.name}">
        <div class="modal-fallback-msg">
          <p>Add your workout video:</p>
          <code>${r.video}</code>
        </div>
      </div>`;
    window.maxfitImg(document.getElementById('modalFallbackImg'), r.poster, r.posterFallback);
  }

  function openVideoModal(r){
    modalTitle.textContent = r.name;
    modalVideo.innerHTML = '';
    modalMeta.innerHTML = `
      <div class="mm-row"><span>Difficulty Level</span><strong>${r.diff}</strong></div>
      <div class="mm-row"><span>Calories Burned</span><strong>${r.cal} kcal</strong></div>
      <div class="mm-row"><span>Duration</span><strong>${r.dur}</strong></div>
      <div class="mm-row"><span>Category</span><strong>${r.cat}</strong></div>
      <div class="mm-row"><span>Video file</span><strong>${r.video.split('/').pop()}</strong></div>
    `;

    const video = document.createElement('video');
    video.className = 'modal-player';
    video.controls = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'metadata';
    video.poster = r.poster;
    video.onerror = () => showVideoFallback(r);

    const source = document.createElement('source');
    source.src = r.video;
    source.type = 'video/mp4';
    video.appendChild(source);
    modalVideo.appendChild(video);

    video.play().catch(() => { /* autoplay blocked — user taps play */ });

    videoModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  /* =========================================================
     CORE FEATURE #5 — BOOK A PERSONAL TRAINER → WHATSAPP
  ========================================================= */
  const trainers = MEDIA.trainers || [];

  const trainerCards = document.getElementById('trainerCards');
  const trainerDots = document.getElementById('trainerDots');
  const trainerCounter = document.getElementById('trainerCounter');
  const trainerRailNav = document.getElementById('trainerRailNav');
  let selectedTrainer = null;

  function isTrainerTabletRail(){
    return window.innerWidth > 600 && window.innerWidth <= 980;
  }

  function getTrainerScrollIndex(){
    const cards = [...trainerCards.querySelectorAll('.trainer-card')];
    if (!cards.length) return 0;
    const scrollLeft = trainerCards.scrollLeft;
    let idx = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - scrollLeft);
      if (dist < best) {
        best = dist;
        idx = i;
      }
    });
    return idx;
  }

  function updateTrainerRail(activeIdx){
    if (!isTrainerTabletRail()) {
      trainerRailNav?.setAttribute('aria-hidden', 'true');
      return;
    }
    trainerRailNav?.setAttribute('aria-hidden', 'false');
    const idx = typeof activeIdx === 'number' ? activeIdx : getTrainerScrollIndex();
    trainerDots?.querySelectorAll('.tdot').forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
      dot.setAttribute('aria-current', i === idx ? 'true' : 'false');
    });
    if (trainerCounter) {
      trainerCounter.textContent = `${idx + 1} of ${trainers.length}`;
    }
  }

  trainers.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'trainer-card';
    card.innerHTML = `
      <img src="${t.img}" alt="${t.name}">
      <div><h5>${t.name}</h5><p>${t.spec}</p></div>
      <span class="tc-check"></span>
    `;
    window.maxfitImg(card.querySelector('img'), t.img, t.fallback);
    card.addEventListener('click', () => {
      document.querySelectorAll('.trainer-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedTrainer = t;
      updateTrainerRail(i);
    });
    trainerCards.appendChild(card);
    if (i === 0) { card.classList.add('active'); selectedTrainer = t; }

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'tdot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `View trainer ${i + 1} of ${trainers.length}`);
    dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => {
      trainerCards.children[i]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      updateTrainerRail(i);
    });
    trainerDots.appendChild(dot);
  });

  trainerCards.addEventListener('scroll', () => updateTrainerRail(), { passive: true });
  window.addEventListener('resize', () => updateTrainerRail());
  updateTrainerRail(0);

  // Live booking calendar + smart time slots
  const calGrid = document.getElementById('calGrid');
  const calMonthLabel = document.getElementById('calMonthLabel');
  const calLiveClock = document.getElementById('calLiveClock');
  const calSelectedLabel = document.getElementById('calSelectedLabel');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const timeRow = document.getElementById('timeRow');
  const timePills = timeRow.querySelectorAll('.time-pill');

  const BOOKING_MONTHS_AHEAD = 3;
  let calView = new Date();
  calView.setDate(1);
  let selectedDateObj = new Date();
  selectedDateObj.setHours(0, 0, 0, 0);
  let selectedDate = formatBookingDate(selectedDateObj);
  let selectedTime = null;

  function startOfDay(d){
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function isSameDay(a, b){
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  function formatBookingDate(d){
    return d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  }

  function formatLiveClock(){
    const now = new Date();
    return now.toLocaleString('en-GB', {
      weekday:'short', day:'numeric', month:'short',
      hour:'2-digit', minute:'2-digit', hour12:true
    });
  }

  function maxBookingDate(){
    const max = new Date();
    max.setMonth(max.getMonth() + BOOKING_MONTHS_AHEAD);
    max.setHours(23, 59, 59, 999);
    return max;
  }

  function updateLiveClock(){
    if (calLiveClock) calLiveClock.textContent = formatLiveClock();
  }

  function updateSelectedLabel(){
    if (!calSelectedLabel) return;
    const timePart = selectedTime ? `<strong>${selectedTime}</strong>` : 'pick a time below';
    calSelectedLabel.innerHTML = `Session: <strong>${selectedDate}</strong> at ${timePart}`;
  }

  function renderCalendar(){
    const today = startOfDay(new Date());
    const year = calView.getFullYear();
    const month = calView.getMonth();
    const monthName = calView.toLocaleDateString('en-GB', { month:'long', year:'numeric' });

    if (calMonthLabel) calMonthLabel.textContent = monthName;
    if (calPrev) {
      calPrev.disabled = year < today.getFullYear()
        || (year === today.getFullYear() && month <= today.getMonth());
    }
    if (calNext) {
      const max = maxBookingDate();
      calNext.disabled = year > max.getFullYear()
        || (year === max.getFullYear() && month >= max.getMonth());
    }

    if (!calGrid) return;
    calGrid.innerHTML = '';

    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDow; i++) {
      const empty = document.createElement('span');
      empty.className = 'cal-day cal-empty';
      empty.setAttribute('aria-hidden', 'true');
      calGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.textContent = day;
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('aria-label', formatBookingDate(cellDate));

      if (isSameDay(cellDate, today)) btn.classList.add('cal-today');
      if (isSameDay(cellDate, selectedDateObj)) btn.classList.add('cal-selected');

      const isPast = cellDate < today;
      const isTooFar = cellDate > maxBookingDate();
      if (isPast || isTooFar) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => {
          selectedDateObj = startOfDay(cellDate);
          selectedDate = formatBookingDate(selectedDateObj);
          renderCalendar();
          updateTimeSlots();
          updateSelectedLabel();
        });
      }
      calGrid.appendChild(btn);
    }
  }

  function updateTimeSlots(){
    const now = new Date();
    const isToday = isSameDay(selectedDateObj, now);
    let firstAvailable = null;

    timePills.forEach(pill => {
      const hour = parseInt(pill.dataset.hour, 10);
      const minute = parseInt(pill.dataset.minute, 10);
      const slotTime = new Date(selectedDateObj);
      slotTime.setHours(hour, minute, 0, 0);
      const unavailable = isToday && slotTime <= now;

      pill.disabled = unavailable;
      pill.classList.toggle('disabled', unavailable);
      if (unavailable && pill.classList.contains('active')) {
        pill.classList.remove('active');
      }
      if (!unavailable && firstAvailable === null) firstAvailable = pill;
    });

    const active = timeRow.querySelector('.time-pill.active:not(.disabled):not(:disabled)');
    if (!active && firstAvailable) {
      firstAvailable.classList.add('active');
      selectedTime = firstAvailable.textContent.trim();
    } else if (active) {
      selectedTime = active.textContent.trim();
    } else {
      selectedTime = null;
    }
    updateSelectedLabel();
  }

  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (pill.disabled || pill.classList.contains('disabled')) return;
      timePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedTime = pill.textContent.trim();
      updateSelectedLabel();
    });
  });

  calPrev?.addEventListener('click', () => {
    calView.setMonth(calView.getMonth() - 1);
    renderCalendar();
  });
  calNext?.addEventListener('click', () => {
    calView.setMonth(calView.getMonth() + 1);
    renderCalendar();
  });

  updateLiveClock();
  renderCalendar();
  updateTimeSlots();
  setInterval(() => {
    updateLiveClock();
    updateTimeSlots();
  }, 30000);

  // Confirm → WhatsApp deep link
  document.getElementById('confirmBooking').addEventListener('click', () => {
    const name = document.getElementById('bookName').value.trim() || 'A MAXFIT member';
    const phone = document.getElementById('bookPhone').value.trim();
    const trainerName = selectedTrainer ? selectedTrainer.name : 'a MAXFIT trainer';

    const message = `Hi MAXFIT! I'd like to book a personal training session.%0A%0A` +
      `Name: ${encodeURIComponent(name)}%0A` +
      `Trainer: ${encodeURIComponent(trainerName)}%0A` +
      `Date: ${encodeURIComponent(selectedDate || 'Today')}%0A` +
      `Time: ${encodeURIComponent(selectedTime || 'Flexible')}%0A` +
      (phone ? `Phone: ${encodeURIComponent(phone)}%0A` : '') +
      `%0APlease confirm availability. Thank you!`;

    window.open(`https://wa.me/2348012345678?text=${message}`, '_blank');
  });

  /* =========================================================
     CORE FEATURE #6 — NUTRITION HUB
  ========================================================= */
  const nutritionData = {
    loss: [
      { h:'Calorie Strategy', i:'🔥', items:[['Daily deficit','300–500 kcal'],['Protein target','1.6g/kg bodyweight'],['Meal frequency','3 meals + 1 snack']] },
      { h:'Best Foods', i:'🥗', items:[['Lean protein','Chicken, fish, eggs, beans'],['Low-cal volume','Vegetables, salads, soups'],['Smart carbs','Oats, brown rice, sweet potato']] },
      { h:'Avoid / Limit', i:'🚫', items:[['Sugary drinks','Soda, fruit juice concentrates'],['Fried foods','Puff puff, fried plantain'],['Late-night snacking','After 9PM']] },
    ],
    gain: [
      { h:'Calorie Strategy', i:'💪', items:[['Daily surplus','300–500 kcal'],['Protein target','1.8–2.2g/kg bodyweight'],['Meal frequency','4–5 meals/day']] },
      { h:'Best Foods', i:'🍗', items:[['Protein sources','Beef, eggs, whey, beans'],['Dense carbs','Rice, yam, pasta, bread'],['Healthy fats','Avocado, nuts, olive oil']] },
      { h:'Timing Tips', i:'⏱', items:[['Pre-workout','Carbs + protein, 60 min before'],['Post-workout','Protein + fast carbs within 45 min'],['Before bed','Slow-digesting protein']] },
    ],
    football: [
      { h:'Match-Day Fuel', i:'⚽', items:[['3 hrs before','High-carb, moderate protein meal'],['During match','Electrolyte drink, small carbs'],['Post-match','Protein + carbs within 30 min']] },
      { h:'Training Days', i:'🏃', items:[['Carb intake','5–7g/kg bodyweight'],['Hydration','3–4L water/day minimum'],['Recovery','Anti-inflammatory foods — berries, fish']] },
      { h:'Key Nutrients', i:'⚡', items:[['Electrolytes','Sodium, potassium, magnesium'],['Iron','Red meat, leafy greens'],['Omega-3','Fish, walnuts — joint recovery']] },
    ],
    hydration: [
      { h:'Daily Targets', i:'💧', items:[['Baseline intake','35ml per kg bodyweight'],['Training day add-on','+500–750ml per hour trained'],['Morning routine','500ml on waking']] },
      { h:'Reminders', i:'⏰', items:[['Every 90 minutes','Take a hydration break'],['Before training','500ml, 30 min prior'],['Urine check','Pale yellow = well hydrated']] },
      { h:'Electrolyte Boost', i:'🧂', items:[['High-sweat sessions','Add a pinch of salt + lemon'],['Natural source','Coconut water'],['Avoid','Excess caffeine — it dehydrates']] },
    ]
  };

  const nutritionBody = document.getElementById('nutritionBody');
  function renderNutrition(key){
    nutritionBody.innerHTML = '';
    nutritionData[key].forEach(card => {
      const el = document.createElement('div');
      el.className = 'nutri-card';
      el.innerHTML = `
        <h4><span class="ico">${card.i}</span> ${card.h}</h4>
        <ul>${card.items.map(it => `<li><span>${it[0]}</span><strong>${it[1]}</strong></li>`).join('')}</ul>
      `;
      nutritionBody.appendChild(el);
    });
  }
  renderNutrition('loss');
  document.querySelectorAll('.ntab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ntab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderNutrition(tab.dataset.n);
    });
  });

  /* =========================================================
     CORE FEATURE #7 — MEMBERSHIP PLANS (billing toggle)
  ========================================================= */
  const billingToggle = document.getElementById('billingToggle');
  let annual = false;
  billingToggle.addEventListener('click', () => {
    annual = !annual;
    billingToggle.classList.toggle('on', annual);
    document.querySelectorAll('.amt').forEach(amt => {
      const val = annual ? amt.dataset.y : amt.dataset.m;
      amt.textContent = parseInt(val, 10).toLocaleString();
    });
    document.querySelectorAll('.plan-price .per').forEach(per => per.textContent = annual ? '/yr' : '/mo');
  });

  /* =========================================================
     CORE FEATURE #9 — SUCCESS STORIES
  ========================================================= */
  const stories = MEDIA.stories || [];
  const storiesRail = document.getElementById('storiesRail');
  stories.forEach(s => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <div class="story-imgs carousel">
        <div class="carousel-track">
          <div class="half"><img class="story-before" src="${s.before}" alt="${s.name} — before transformation"></div>
          <div class="half"><img class="story-after" src="${s.after}" alt="${s.name} — after transformation"></div>
        </div>
        <div class="carousel-dots">
          <span class="cdot active" data-slide="0"></span>
          <span class="cdot" data-slide="1"></span>
        </div>
      </div>
      <div class="story-body">
        <h4>${s.name}</h4>
        <span class="story-achieve">${s.achieve}</span>
        <p>"${s.quote}"</p>
      </div>
    `;
    window.maxfitImg(card.querySelector('.story-before'), s.before, s.beforeFallback);
    window.maxfitImg(card.querySelector('.story-after'), s.after, s.afterFallback);
    storiesRail.appendChild(card);
  });

  // Auto-rotating before/after carousel (active on mobile widths where images stack full-width)
  function startStoryCarousels(){
    document.querySelectorAll('.story-imgs.carousel').forEach(el => {
      if (el.dataset.carouselBound) return; // avoid double-binding
      el.dataset.carouselBound = 'true';
      const dots = el.querySelectorAll('.cdot');
      let showingAfter = false;
      setInterval(() => {
        if (window.innerWidth > 980) return; // only auto-rotate on mobile/tablet
        showingAfter = !showingAfter;
        el.classList.toggle('show-after', showingAfter);
        dots.forEach((d, i) => d.classList.toggle('active', showingAfter ? i === 1 : i === 0));
      }, 2600);
      // Tap a dot (or the image) to jump straight to that slide
      dots.forEach((dot, i) => dot.addEventListener('click', (e) => {
        e.stopPropagation();
        showingAfter = i === 1;
        el.classList.toggle('show-after', showingAfter);
        dots.forEach((d, j) => d.classList.toggle('active', j === i));
      }));
      el.addEventListener('click', () => {
        if (window.innerWidth > 980) return;
        showingAfter = !showingAfter;
        el.classList.toggle('show-after', showingAfter);
        dots.forEach((d, i) => d.classList.toggle('active', showingAfter ? i === 1 : i === 0));
      });
    });
  }
  startStoryCarousels();

  /* =========================================================
     CORE FEATURE #8 — GET DIRECTIONS (already a live Maps link in HTML)
     Smooth-scroll nav anchors handled natively via CSS scroll-behavior.
  ========================================================= */

  /* Wire scroll arrows + auto-scroll for stories & exercise reels */
  wireRailArrows(
    document.getElementById('storiesRail'),
    document.getElementById('storiesArrowLeft'),
    document.getElementById('storiesArrowRight'),
    { autoScroll: true, intervalMs: 4500, loop: true }
  );
  wireRailArrows(
    document.getElementById('reelsRail'),
    document.getElementById('reelsArrowLeft'),
    document.getElementById('reelsArrowRight'),
    { autoScroll: true, intervalMs: 4000, loop: true }
  );

});
