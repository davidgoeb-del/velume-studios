/**
 * Velume Studios Curriculum Edition
 * Unit 4: Global Voices — The Karen Odyssey (CEFR B1)
 * Full Interactive Engine: Synchronized Audio, FITB, Grammar, Can-Do, Food Activity, Comprehension
 */

let playerState = {
  isPlaying: false,
  rate: 1.0,
  currentIdx: 0,
  sentences: [],
  audioEl: null
};

document.addEventListener('DOMContentLoaded', () => {
  initAudioElement();
  initSentences();
  initNarratorPlayer();
  initVocabPronunciation();
  initFoodTastingActivity();
  initFillInTheBlank();
  initGrammarPractice();
  initComprehensionQuiz();
  initCanDo();
  initReflectionCopy();
  initWhoIsItGame();
  initConversationStartersActivity();
});

function initAudioElement() {
  let el = document.getElementById('story-audio-element');
  if (!el) {
    el = document.createElement('audio');
    el.id = 'story-audio-element';
    el.preload = 'none';
    document.body.appendChild(el);
  }
  playerState.audioEl = el;
}

function initSentences() {
  playerState.sentences = Array.from(document.querySelectorAll('.story-sentence'));
}

/* ==========================================================================
   1. Narrator Audio Player
   ========================================================================== */
function initNarratorPlayer() {
  const playBtn = document.getElementById('narrator-play-btn');
  const pauseBtn = document.getElementById('narrator-pause-btn');
  const resetBtn = document.getElementById('narrator-reset-btn');
  const speedBtns = document.querySelectorAll('.narrator-speed-btn');

  playBtn?.addEventListener('click', () => {
    if (playerState.isPlaying) return;
    playerState.isPlaying = true;
    updateNarratorUI(true);
    if (playerState.currentIdx >= playerState.sentences.length) playerState.currentIdx = 0;
    playSentenceAt(playerState.currentIdx);
  });

  pauseBtn?.addEventListener('click', () => {
    playerState.audioEl?.pause();
    playerState.isPlaying = false;
    updateNarratorUI(false);
  });

  resetBtn?.addEventListener('click', () => {
    playerState.audioEl?.pause();
    playerState.isPlaying = false;
    playerState.currentIdx = 0;
    clearSentenceHighlights();
    updateNarratorUI(false);
  });

  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speedBtns.forEach(b => {
        b.classList.remove('bg-amber-400', 'text-slate-950', 'font-black');
        b.classList.add('bg-white', 'text-slate-700');
      });
      btn.classList.add('bg-amber-400', 'text-slate-950', 'font-black');
      btn.classList.remove('bg-white', 'text-slate-700');
      playerState.rate = parseFloat(btn.dataset.speed) || 1.0;
      if (playerState.audioEl) playerState.audioEl.playbackRate = playerState.rate;
    });
  });

  playerState.sentences.forEach((el, idx) => {
    el.addEventListener('click', () => {
      playerState.currentIdx = idx;
      playerState.isPlaying = true;
      updateNarratorUI(true);
      playSentenceAt(idx);
    });
  });
}

function updateNarratorUI(playing) {
  const playBtn = document.getElementById('narrator-play-btn');
  const pauseBtn = document.getElementById('narrator-pause-btn');
  const badge = document.getElementById('narrator-status-badge');

  if (playing) {
    playBtn?.classList.add('hidden');
    pauseBtn?.classList.remove('hidden');
    if (badge) {
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 inline-block pulse-dot mr-1.5"></span> Playing Aloud (${playerState.rate}x)`;
      badge.className = 'text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full flex items-center border border-emerald-300';
    }
  } else {
    playBtn?.classList.remove('hidden');
    pauseBtn?.classList.add('hidden');
    if (badge) {
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 inline-block mr-1.5"></span> Ready to Listen`;
      badge.className = 'text-xs font-bold text-slate-800 bg-[#FFF9E6] px-3 py-1 rounded-full flex items-center border border-amber-300';
    }
  }
}

function clearSentenceHighlights() {
  playerState.sentences.forEach(s => s.classList.remove('active-sentence'));
}

function playSentenceAt(index) {
  if (index < 0 || index >= playerState.sentences.length) {
    playerState.isPlaying = false;
    playerState.currentIdx = 0;
    clearSentenceHighlights();
    updateNarratorUI(false);
    return;
  }

  clearSentenceHighlights();
  const el = playerState.sentences[index];
  el.classList.add('active-sentence');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  playerState.audioEl.src = `assets/audio/s_${index}.mp3`;
  playerState.audioEl.playbackRate = playerState.rate;

  playerState.audioEl.onended = () => {
    if (playerState.isPlaying) {
      playerState.currentIdx++;
      playSentenceAt(playerState.currentIdx);
    }
  };

  playerState.audioEl.onerror = () => {
    if (playerState.isPlaying) {
      playerState.currentIdx++;
      playSentenceAt(playerState.currentIdx);
    }
  };

  playerState.audioEl.play().catch(e => console.warn('Audio play error:', e));
}

/* ==========================================================================
   2. Vocabulary Pronunciation (12 words)
   ========================================================================== */
function initVocabPronunciation() {
  const vocabAudio = new Audio();
  document.querySelectorAll('.vocab-audio-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const word = btn.dataset.word || 'homeland';
      vocabAudio.src = `assets/audio/vocab_${word.toLowerCase()}.mp3`;
      vocabAudio.play().catch(err => console.warn('Vocab audio error:', err));
    });
  });
}

/* ==========================================================================
   3. Fill in the Blank Activity
   ========================================================================== */
const FITB_QUESTIONS = [
  { id: 1, before: 'Myanmar was the Karen people\'s', blank: 'homeland', after: 'for many generations.' },
  { id: 2, before: 'Many Karen', blank: 'refugees', after: 'lived in safe camps in Thailand.' },
  { id: 3, before: 'The long and difficult', blank: 'journey', after: 'through the jungle took several days on foot.' },
  { id: 4, before: 'It takes great', blank: 'courage', after: 'to start a completely new life in a foreign country.' },
  { id: 5, before: 'Parents tie white strings during the wrist-tying', blank: 'ceremony', after: 'to bring protection and good health.' },
  { id: 6, before: 'Community members worked together to help', blank: 'support', after: 'new families as they settled in Wisconsin.' },
];

function initFillInTheBlank() {
  const container = document.getElementById('fitb-container');
  if (!container) return;

  container.innerHTML = FITB_QUESTIONS.map(q => `
    <div class="fitb-item bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed" id="fitb-${q.id}">
      <span class="text-[11px] font-black text-amber-800 uppercase tracking-wider mr-2">${q.id}.</span>
      ${q.before}
      <input
        type="text"
        class="fitb-input border-b-2 border-amber-400 bg-transparent px-1 text-sm font-bold text-slate-900 w-28 text-center focus:outline-none focus:border-amber-600 mx-1"
        data-answer="${q.blank}"
        placeholder="________"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false">
      ${q.after}
      <span class="fitb-feedback ml-2 text-xs font-black hidden"></span>
    </div>
  `).join('');

  document.getElementById('check-fitb-btn')?.addEventListener('click', checkFITB);
  document.getElementById('reset-fitb-btn')?.addEventListener('click', resetFITB);
}

function checkFITB() {
  const inputs = document.querySelectorAll('.fitb-input');
  let correct = 0;

  inputs.forEach(input => {
    const answer = input.dataset.answer.toLowerCase();
    const value = input.value.trim().toLowerCase();
    const feedback = input.parentElement.querySelector('.fitb-feedback');

    input.disabled = true;

    if (value === answer) {
      correct++;
      input.classList.add('text-emerald-700', 'border-emerald-500');
      feedback.textContent = '✓';
      feedback.className = 'fitb-feedback ml-2 text-xs font-black text-emerald-600';
      feedback.classList.remove('hidden');
    } else {
      input.classList.add('text-rose-600', 'border-rose-400');
      feedback.textContent = `✗ → ${input.dataset.answer}`;
      feedback.className = 'fitb-feedback ml-2 text-xs font-black text-rose-600';
      feedback.classList.remove('hidden');
    }
  });

  const scoreEl = document.getElementById('fitb-score');
  if (scoreEl) {
    scoreEl.textContent = `Score: ${correct} / ${FITB_QUESTIONS.length}`;
    scoreEl.className = `text-xs font-black ${correct === FITB_QUESTIONS.length ? 'text-emerald-700' : 'text-amber-900'}`;
    scoreEl.classList.remove('hidden');
  }
}

function resetFITB() {
  const inputs = document.querySelectorAll('.fitb-input');
  inputs.forEach(input => {
    input.value = '';
    input.disabled = false;
    input.className = 'fitb-input border-b-2 border-amber-400 bg-transparent px-1 text-sm font-bold text-slate-900 w-28 text-center focus:outline-none focus:border-amber-600 mx-1';
    const feedback = input.parentElement.querySelector('.fitb-feedback');
    if (feedback) feedback.classList.add('hidden');
  });
  const scoreEl = document.getElementById('fitb-score');
  if (scoreEl) scoreEl.classList.add('hidden');
}

/* ==========================================================================
   4. Grammar Practice
   ========================================================================== */
function initGrammarPractice() {
  document.getElementById('check-grammar-btn')?.addEventListener('click', () => {
    document.querySelectorAll('.grammar-input').forEach(input => {
      const correct = input.dataset.answer.toLowerCase();
      const value = input.value.trim().toLowerCase();
      const fb = input.parentElement.querySelector('.grammar-feedback');
      if (!fb) return;

      fb.classList.remove('hidden');
      if (value === correct) {
        input.style.borderColor = '#059669';
        input.style.color = '#065F46';
        fb.textContent = '✓';
        fb.className = 'grammar-feedback text-xs font-black text-emerald-600';
      } else {
        input.style.borderColor = '#DC2626';
        input.style.color = '#991B1B';
        fb.textContent = `✗ → ${input.dataset.answer}`;
        fb.className = 'grammar-feedback text-xs font-black text-rose-600';
      }
    });
  });
}

/* ==========================================================================
   5. Food Tasting Activity
   ========================================================================== */
let selectedFood = 'Tala Baw (Bamboo Shoot Herbal Soup)';

function initFoodTastingActivity() {
  const cards = document.querySelectorAll('.food-card');
  const nameDisplay = document.getElementById('selected-food-name');
  const reasonInput = document.getElementById('food-reason-input');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => {
        c.classList.remove('selected-food');
        const icon = c.querySelector('.check-icon');
        if (icon) icon.textContent = '';
        const footer = c.querySelector('.text-xs.font-bold');
        if (footer) footer.classList.replace('text-amber-800', 'text-slate-400');
      });

      card.classList.add('selected-food');
      const icon = card.querySelector('.check-icon');
      if (icon) icon.textContent = '✓ Selected';

      selectedFood = card.dataset.food || selectedFood;
      if (nameDisplay) nameDisplay.textContent = selectedFood;
      if (reasonInput) reasonInput.value = card.dataset.reason || '';
    });
  });
}

/* ==========================================================================
   6. Comprehension Quiz
   ========================================================================== */
const COMPREHENSION_QUESTIONS = [
  {
    id: 1,
    question: 'Where did the Karen people originally live before moving to Thailand?',
    options: [
      { text: 'In peaceful mountain villages in eastern Myanmar', correct: true },
      { text: 'In busy city apartments in downtown Tokyo', correct: false },
      { text: 'On fishing boats along the coast of Malaysia', correct: false }
    ],
    hint: 'Paragraph 1 describes their green mountain villages and flowing rivers in eastern Myanmar.'
  },
  {
    id: 2,
    question: 'What do the white cotton strings in the Lah Poh ceremony represent?',
    options: [
      { text: 'Family unity, good health, and keeping loved ones safe', correct: true },
      { text: 'They show who scored highest on an exam', correct: false },
      { text: 'They are simple decorations for a dance contest', correct: false }
    ],
    hint: 'Parents tie white strings to bless their children, protect the family, and stay united.'
  },
  {
    id: 3,
    question: 'What did community teachers do inside the refugee camps in Thailand?',
    options: [
      { text: 'They started schools in bamboo huts to teach English, Karen, and math', correct: true },
      { text: 'They closed all classrooms and told students to work', correct: false },
      { text: 'They traveled to foreign universities every weekend', correct: false }
    ],
    hint: 'Even with limited resources, dedicated teachers set up community classes inside bamboo huts.'
  },
  {
    id: 4,
    question: 'What was one major challenge when Karen families arrived in Milwaukee?',
    options: [
      { text: 'The freezing winter snow and learning a completely new language', correct: true },
      { text: 'Finding enough bamboo to build new homes', correct: false },
      { text: 'There were no grocery stores or buses in the city', correct: false }
    ],
    hint: 'Moving from a tropical mountain climate to cold Wisconsin winters was a huge adjustment.'
  },
  {
    id: 5,
    question: 'How do Karen elders in American cities keep their cultural connection to farming?',
    options: [
      { text: 'By planting traditional Asian vegetables and herbs in city community gardens', correct: true },
      { text: 'By refusing to talk to their neighbors', correct: false },
      { text: 'By living away from the city in deep forests', correct: false }
    ],
    hint: 'City gardens allow elders to share fresh food, cultural heritage, and pride with the next generation.'
  }
];

let compScore = 0;
const userAnswers = {};

function initComprehensionQuiz() {
  const container = document.getElementById('comprehension-quiz-container');
  if (!container) return;

  container.innerHTML = COMPREHENSION_QUESTIONS.map((q, idx) => `
    <div class="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-sm" id="comp-q-${q.id}">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded border border-amber-300">Question ${idx + 1}</span>
        <span class="text-xs text-slate-400" id="comp-status-${q.id}">Not answered</span>
      </div>
      <p class="font-bold text-slate-900 text-sm leading-snug">${q.question}</p>
      <div class="space-y-2">
        ${q.options.map((opt, i) => `
          <button class="comp-opt-btn w-full text-left p-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition flex items-center justify-between"
            data-qid="${q.id}" data-optidx="${i}">
            <span>${opt.text}</span>
            <span class="comp-icon opacity-0 ml-2 font-bold"></span>
          </button>
        `).join('')}
      </div>
      <div class="hidden p-3 rounded-lg text-xs leading-relaxed" id="comp-hint-${q.id}"></div>
    </div>
  `).join('');

  container.querySelectorAll('.comp-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleCompAnswer(parseInt(btn.dataset.qid), parseInt(btn.dataset.optidx), btn);
    });
  });
}

function handleCompAnswer(qid, optIdx, btn) {
  const q = COMPREHENSION_QUESTIONS.find(q => q.id === qid);
  if (!q || userAnswers[qid] !== undefined) return;

  const isCorrect = q.options[optIdx].correct;
  userAnswers[qid] = isCorrect;

  const card = document.getElementById(`comp-q-${qid}`);
  const statusEl = document.getElementById(`comp-status-${qid}`);
  const hintEl = document.getElementById(`comp-hint-${qid}`);

  card.querySelectorAll('.comp-opt-btn').forEach((b, i) => {
    b.disabled = true;
    if (q.options[i].correct) {
      b.classList.add('bg-emerald-50', 'border-emerald-500', 'font-semibold');
      const icon = b.querySelector('.comp-icon');
      if (icon) { icon.textContent = '✓ Correct'; icon.classList.remove('opacity-0'); icon.classList.add('text-emerald-700'); }
    }
  });

  if (isCorrect) {
    btn.classList.add('bg-emerald-100', 'border-emerald-600', 'ring-2', 'ring-emerald-400');
    statusEl.innerHTML = '<span class="text-emerald-700 font-bold">✓ Correct!</span>';
    hintEl.className = 'p-3 rounded-lg text-xs leading-relaxed bg-emerald-50 border border-emerald-200 text-emerald-950 block';
    hintEl.innerHTML = `<strong>Well done!</strong> ${q.hint}`;
    compScore++;
    triggerRewardAnim(btn);
  } else {
    btn.classList.add('bg-rose-50', 'border-rose-400');
    const icon = btn.querySelector('.comp-icon');
    if (icon) { icon.textContent = '✗ Review'; icon.classList.remove('opacity-0'); icon.classList.add('text-rose-600'); }
    statusEl.innerHTML = '<span class="text-rose-700 font-bold">Review answer</span>';
    hintEl.className = 'p-3 rounded-lg text-xs leading-relaxed bg-amber-50 border border-amber-200 text-amber-950 block';
    hintEl.innerHTML = `<strong>Hint:</strong> ${q.hint}`;
  }

  const scoreEl = document.getElementById('natgeo-score-count');
  if (scoreEl) scoreEl.textContent = `${compScore} / ${COMPREHENSION_QUESTIONS.length}`;
}

function triggerRewardAnim(anchorEl) {
  const badge = document.createElement('div');
  badge.className = 'reward-badge-anim flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-lg border border-slate-950';
  badge.innerHTML = `<span>⭐</span> +1 Point!`;
  const rect = anchorEl.getBoundingClientRect();
  badge.style.position = 'absolute';
  badge.style.left = `${rect.left + rect.width / 2 - 40}px`;
  badge.style.top = `${rect.top + window.scrollY - 10}px`;
  document.body.appendChild(badge);
  setTimeout(() => badge.remove(), 1200);
}

/* ==========================================================================
   7. Can-Do Self-Assessment
   ========================================================================== */
function initCanDo() {
  const checks = document.querySelectorAll('.cando-check');
  const bar = document.getElementById('cando-progress-bar');
  const label = document.getElementById('cando-progress-label');
  const total = checks.length;

  checks.forEach(check => {
    check.addEventListener('change', () => {
      const done = document.querySelectorAll('.cando-check:checked').length;
      if (bar) bar.style.width = `${(done / total) * 100}%`;
      if (label) label.textContent = `${done} / ${total}`;
      if (done === total && bar) bar.classList.replace('bg-amber-400', 'bg-emerald-500');
    });
  });
}

/* ==========================================================================
   8. Reflection Copy
   ========================================================================== */
function initReflectionCopy() {
  document.getElementById('copy-journal-btn')?.addEventListener('click', async () => {
    const getVal = id => (document.getElementById(id)?.value || '').trim();
    const text = [
      '[Velume Studios — Unit 4: The Karen Odyssey (CEFR B1) — Student Reflection]',
      '',
      `Food Choice: I want to try ${selectedFood} because ${getVal('food-reason-input')}`,
      '',
      'Writing Frame:',
      `The Karen people are a very ${getVal('wf-1')} community of people.`,
      `They had to leave their ${getVal('wf-2')} in Myanmar and make a long ${getVal('wf-3')} to safety.`,
      `One tradition I found inspiring was ${getVal('wf-4')} because ${getVal('wf-5')}.`,
      `If I could meet a Karen university student, I would ${getVal('wf-6')}.`,
      `The most important lesson from this story is that people can show incredible ${getVal('wf-7')} when they support each other.`,
      '',
      `Comprehension Score: ${compScore} / ${COMPREHENSION_QUESTIONS.length}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      showToast('✓ Reflection copied to clipboard!');
    } catch {
      showToast('✓ Response ready to copy!');
    }
  });
}

function showToast(msg) {
  const toast = document.getElementById('journal-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.replace('opacity-0', 'opacity-100');
  toast.classList.replace('translate-y-4', 'translate-y-0');
  setTimeout(() => {
    toast.classList.replace('opacity-100', 'opacity-0');
    toast.classList.replace('translate-y-0', 'translate-y-4');
  }, 2500);
}

/* ==========================================================================
   9. Section 10: "Who Is It?" Matching Game
   ========================================================================== */
function initWhoIsItGame() {
  const clueCards = document.querySelectorAll('.who-clue-card');

  clueCards.forEach(card => {
    const correctPerson = card.dataset.correct;
    const btns = card.querySelectorAll('.who-btn');
    const feedback = card.querySelector('.who-feedback');

    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const chosen = btn.dataset.person;

        if (chosen === correctPerson) {
          btns.forEach(b => {
            b.disabled = true;
            b.classList.remove('bg-amber-400', 'text-slate-950', 'bg-slate-700');
            b.classList.add('bg-slate-800', 'text-slate-500', 'opacity-50');
          });
          btn.classList.remove('opacity-50', 'bg-slate-800', 'text-slate-500');
          btn.classList.add('bg-emerald-500', 'text-white', 'font-black');

          if (feedback) {
            feedback.innerHTML = `✓ Correct! That's <span class="text-emerald-300 font-bold">${correctPerson}</span>!`;
            feedback.className = 'who-feedback text-xs font-bold text-emerald-400 pt-1 block';
          }
        } else {
          btn.classList.add('bg-rose-700', 'text-white', 'line-through');
          if (feedback) {
            feedback.textContent = 'Not quite! Check the age, hobbies, or daily life clues above and try again.';
            feedback.className = 'who-feedback text-xs font-medium text-rose-300 pt-1 block';
          }
        }
      });
    });
  });
}

/* ==========================================================================
   10. Section 10: "Choose 2 Great Conversation Starters"
   ========================================================================== */
function initConversationStartersActivity() {
  const blocks = document.querySelectorAll('.starter-block');

  blocks.forEach(block => {
    const checkBtn = block.querySelector('.check-starters-btn');
    const feedbackBox = block.querySelector('.starter-feedback');
    const options = block.querySelectorAll('.starter-option');
    const checks = block.querySelectorAll('.starter-check');

    // Instant visual highlight on check
    checks.forEach(chk => {
      chk.addEventListener('change', () => {
        const selected = block.querySelectorAll('.starter-check:checked');
        if (selected.length > 2) {
          chk.checked = false;
          showToast('Please select only 2 choices per person!');
          return;
        }

        options.forEach(opt => {
          const input = opt.querySelector('.starter-check');
          if (input.checked) {
            opt.classList.add('border-amber-400', 'bg-amber-50');
            opt.classList.remove('border-slate-200');
          } else {
            opt.classList.remove('border-amber-400', 'bg-amber-50', 'border-emerald-400', 'bg-emerald-50/70', 'border-rose-400', 'bg-rose-50/70');
            opt.classList.add('border-slate-200');
          }
        });
      });
    });

    checkBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedChecks = block.querySelectorAll('.starter-check:checked');

      if (selectedChecks.length === 0) {
        if (feedbackBox) {
          feedbackBox.innerHTML = '<p class="text-xs font-bold text-amber-900 bg-amber-100 p-2.5 rounded-lg border border-amber-300">⚠️ Please select 2 choices first!</p>';
          feedbackBox.classList.remove('hidden');
        }
        return;
      }

      let html = '<div class="space-y-2 pt-2 border-t border-slate-200">';
      let goodCount = 0;

      options.forEach(opt => {
        const input = opt.querySelector('.starter-check');
        const isGood = input.dataset.type === 'good';
        const isChecked = input.checked;
        const exp = input.dataset.exp;

        if (isGood) {
          opt.classList.remove('border-slate-200', 'hover:bg-amber-50', 'border-amber-400', 'bg-amber-50');
          opt.classList.add('border-emerald-400', 'bg-emerald-50/80');

          if (isChecked) {
            goodCount++;
            html += `
              <div class="text-xs p-2.5 rounded-lg bg-emerald-100/90 border border-emerald-300 text-emerald-950">
                <span class="font-bold">🟢 Great Choice (You picked this):</span> ${exp}
              </div>
            `;
          } else {
            html += `
              <div class="text-xs p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                <span class="font-bold">🟢 Great Choice (Missed):</span> ${exp}
              </div>
            `;
          }
        } else {
          if (isChecked) {
            opt.classList.remove('border-slate-200', 'hover:bg-amber-50', 'border-amber-400', 'bg-amber-50');
            opt.classList.add('border-rose-400', 'bg-rose-50/80');
            html += `
              <div class="text-xs p-2.5 rounded-lg bg-rose-100/90 border border-rose-300 text-rose-950">
                <span class="font-bold">🔴 Not a Good Choice (You picked this):</span> ${exp}
              </div>
            `;
          } else {
            opt.classList.remove('border-slate-200', 'border-amber-400', 'bg-amber-50');
            opt.classList.add('border-slate-200', 'opacity-70');
            html += `
              <div class="text-xs p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                <span class="font-bold">⚪ Correctly Avoided:</span> ${exp}
              </div>
            `;
          }
        }
      });

      if (goodCount === 2 && selectedChecks.length === 2) {
        html = `<p class="text-xs font-bold text-emerald-800 bg-emerald-100 p-2.5 rounded-lg mb-2 border border-emerald-300">🎉 Perfect! You picked both of the kindest, most supportive conversation starters!</p>` + html;
      } else if (goodCount === 1) {
        html = `<p class="text-xs font-bold text-amber-800 bg-amber-100 p-2.5 rounded-lg mb-2 border border-amber-300">👍 Good try! You found 1 great conversation starter. Review the green boxes above to see the other great choice!</p>` + html;
      }

      html += '</div>';

      if (feedbackBox) {
        feedbackBox.innerHTML = html;
        feedbackBox.classList.remove('hidden');
      }
    });
  });
}

