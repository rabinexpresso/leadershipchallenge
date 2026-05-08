// ============================================================
// script.js — Leadership Challenge game logic
// HLE / Alaya 2026
// ============================================================

// ═══════════════════════════════════════════════════════
//  FIREBASE INIT
// ═══════════════════════════════════════════════════════

firebase.initializeApp({
  apiKey: "AIzaSyAoQ32TvlOD3ge9uY2MMDmeypu1KyRHzdE",
  authDomain: "leadershipchallenge-1bc16.firebaseapp.com",
  databaseURL: "https://leadershipchallenge-1bc16-default-rtdb.firebaseio.com",
  projectId: "leadershipchallenge-1bc16",
  storageBucket: "leadershipchallenge-1bc16.firebasestorage.app",
  messagingSenderId: "91568394313",
  appId: "1:91568394313:web:807b922efcf63a3d96ef98"
});
const db = firebase.database();

var MP = {
  active: false, isHost: false, roomCode: null,
  playerId: null, playerName: null, playerColor: null,
  gameRef: null, step: 0, scenarioOrder: []
};

const ROOM_WORDS = ['LION','WOLF','BEAR','HAWK','DEER','JADE','PINE','SAGE','DUSK','DAWN','COVE','MESA','BOLT','FERN','GALE'];

function fbArr(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : Object.values(val);
}

function generateRoomCode() {
  return ROOM_WORDS[Math.floor(Math.random() * ROOM_WORDS.length)] + (Math.floor(Math.random() * 9) + 1);
}

function mpSyncStatus(status) {
  if (MP.active && MP.isHost && MP.gameRef) MP.gameRef.child('status').set(status);
}

function resetMP() {
  if (MP.gameRef) MP.gameRef.off();
  MP.active = false; MP.isHost = false; MP.roomCode = null;
  MP.playerId = null; MP.playerName = null; MP.playerColor = null;
  MP.gameRef = null; MP.step = 0; MP.scenarioOrder = [];
  ['lc_mp_role','lc_mp_room','lc_mp_player_id','lc_mp_player_name'].forEach(k => localStorage.removeItem(k));
}

// ═══════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════

function go(id) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top:0, behavior:'smooth' });
  if (SAVE_SCREENS.has(id) && S.players.length > 0) saveState(id);
}


function confirmQuit() {
  const modal = document.getElementById('quit-modal');
  modal.style.display = 'flex';
}
function closeQuitModal() {
  document.getElementById('quit-modal').style.display = 'none';
}
function doQuit() {
  clearState();
  if (MP.active) {
    if (MP.isHost && MP.gameRef) mpSyncStatus('ended');
    resetMP();
  }
  closeQuitModal();
  go('splash');
}

// ═══════════════════════════════════════════════════════
//  TUTORIAL
// ═══════════════════════════════════════════════════════

const TOTAL_SLIDES = 4;

function initTutorial() {
  S.tutSlide = 0;
  renderTutSlide();
  go('tutorial');
}

function renderTutSlide() {
  document.querySelectorAll('.tut-slide').forEach((el, i) => {
    el.classList.toggle('active', i === S.tutSlide);
  });
  // Prev button — always visible; slide 1 goes back to splash
  const prev = document.getElementById('tut-prev');
  prev.textContent = '← Back';
  // Next button — show slide position in label
  const next = document.getElementById('tut-next');
  const isLast = S.tutSlide === TOTAL_SLIDES - 1;
  next.textContent = isLast ? 'Home →' : 'Next  ' + (S.tutSlide + 1) + ' / ' + TOTAL_SLIDES + ' →';
}

function tutNav(dir) {
  if (dir === 1 && S.tutSlide === TOTAL_SLIDES - 1) {
    go('splash');
    return;
  }
  if (dir === -1 && S.tutSlide === 0) {
    // First slide Back → go to splash
    go('splash');
    return;
  }
  S.tutSlide = Math.max(0, Math.min(TOTAL_SLIDES - 1, S.tutSlide + dir));
  renderTutSlide();
}


function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getMaxForScenarios(indices) {
  const m = { T:0, P:0, E:0, A:0 };
  indices.forEach(idx => {
    const scenario = SCENARIOS[idx];
    DIMS.forEach(d => {
      const best = Math.max(...scenario.choices.map(c => c.scores[d] || 0));
      m[d] += best;
    });
  });
  return m;
}

function buildScenarioOrder(count) {
  // Signal coverage guarantee:
  // T key scenarios: [0,3]   P key: [7,10]   E key: [2,4]   A key: [5,8]
  // Best single per signal:  T=0, P=7, E=2, A=5
  // Quick: [0,7,2,5,9] fixed  |  Full: [0,3,7,10,2,4,5,8] fixed  |  Deep: all 12 shuffled

  if (count === 15) {
    // The Full Works: all 15 scenarios shuffled — includes HLE-specific scenarios
    return shuffle([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
  }
  if (count === 12) {
    // Long Game: all 12 shuffled — full variety
    return shuffle([0,1,2,3,4,5,6,7,8,9,10,11]);
  }
  if (count === 8) {
    // Short Game: both key scenarios per signal (8 total), shuffled
    // Every signal is covered twice — profile is reliable
    return shuffle([0,3,7,10,2,4,5,8]);
  }
  if (count === 5) {
    // Quick Round: fixed 5 scenarios [0,7,2,5,9] — shuffled order only
    // Max scores perfectly balanced: T=9, P=9, E=9, A=9 every game
    // Scenario 9 (The Rebuild) is the only non-key scenario covering all 4 signals
    return shuffle([0, 7, 2, 5, 9]);
  }
  // Fallback
  return shuffle([0,1,2,3,4,5,6,7,8,9,10,11]).slice(0, count);
}

function startGameWithCount(count) {
  if (MP.active && MP.isHost) {
    MP.gameRef.child('players').once('value', snap => {
      const fbPlayers = snap.val() || {};
      S.players = Object.entries(fbPlayers).map(([id, p]) => ({
        fbId: id, name: p.name, color: p.color,
        scores: { T:0, P:0, E:0, A:0 }, choices: new Array(12).fill(null)
      }));
      if (S.players.length === 0) { alert('No players have joined yet!'); return; }
      S.scenarioOrder = buildScenarioOrder(count);
      S.step = 0; S.roundChoices = []; S.pickerIdx = 0;
      S.MAX = getMaxForScenarios(S.scenarioOrder);
      MP.gameRef.update({ status:'playing', step:0, scenarioOrder:S.scenarioOrder, mode:count, MAX:S.MAX });
      renderPickTurn(0);
      go('game');
      listenHostAnswers();
    });
    return;
  }
}

// ═══════════════════════════════════════════════════════
//  GAME
// ═══════════════════════════════════════════════════════


const QUESTION_TIME = 120; // seconds

function startGameTimer() {
  clearGameTimer();
  let remaining = QUESTION_TIME;
  const row  = document.getElementById('game-timer-row');
  const fill = document.getElementById('game-timer-fill');
  const num  = document.getElementById('game-timer-num');
  if (!row) return;
  row.style.display = 'block';
  const update = () => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    num.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    fill.style.width = (remaining / QUESTION_TIME * 100) + '%';
    const urgent = remaining <= 30;
    fill.style.background = urgent ? '#ef4444' : 'var(--gold)';
    num.style.color       = urgent ? '#ef4444' : 'var(--gold)';
  };
  update();
  S.gameTimerInterval = setInterval(() => {
    remaining--;
    update();
    if (remaining <= 0) {
      clearGameTimer();
      // Auto-reveal for MP host
      if (MP.active && MP.isHost) {
        const btn = document.getElementById('mp-reveal-btn');
        if (btn) btn.click();
      } else {
        num.textContent = "Time's up!";
        num.style.color = '#ef4444';
      }
    }
  }, 1000);
}

function clearGameTimer() {
  clearInterval(S.gameTimerInterval);
  const row = document.getElementById('game-timer-row');
  if (row) row.style.display = 'none';
}

function renderPickTurn(playerIdx) {
  const scIdx = S.scenarioOrder.length ? S.scenarioOrder[S.step] : S.step;
  const scenario = SCENARIOS[scIdx];
  const player = S.players[playerIdx];
  const totalRounds = S.scenarioOrder.length || SCENARIOS.length;

  // Update topbar
  document.getElementById('gb-label').textContent = `Scenario ${S.step+1} of ${totalRounds}`;
  document.getElementById('prog-fill').style.width = `${(S.step / totalRounds)*100}%`;

  // Score pills
  const spRow = document.getElementById('sp-row');
  spRow.innerHTML = '<span class="sp" style="color:var(--gold);border-color:var(--gold-border);">\ud83c\udfae Host \u00b7 ' + S.players.length + ' players</span>';

  // Pick content
  const pick = document.getElementById('game-pick');
  pick.classList.remove('hidden');

  if (MP.active && MP.isHost) {
    pick.innerHTML =
      '<h2 class="s-heading">' + scenario.title + '</h2>'
      + '<div class="s-box">' + scenario.situation + '</div>'
      + '<div class="choices-label">Options</div>'
      + scenario.choices.map(c =>
        '<div class="c-btn" style="pointer-events:none;">'
        + '<div class="c-alpha">' + c.letter + '</div>'
        + '<div class="c-text">' + c.text + '</div>'
        + '</div>'
      ).join('')
      + '<div style="margin-top:20px;padding:18px;background:var(--card);border:1px solid var(--border);border-radius:16px;text-align:center;margin-bottom:12px">'
      + '<div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:11px;font-weight:700;color:var(--sub);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Players answered</div>'
      + '<div id="mp-answer-counter" style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:40px;font-weight:800;color:var(--gold)">0 / ' + S.players.length + '</div>'
      + '</div>'
      + '<button id="mp-reveal-btn" class="btn btn-gold" onclick="hostReveal()" disabled style="opacity:.4;cursor:not-allowed">Waiting for players...</button>';
    startGameTimer();
  }
}



// ═══════════════════════════════════════════════════════
//  REVEAL
// ═══════════════════════════════════════════════════════

function buildRevealScreen() {
  const scIdx = S.scenarioOrder.length ? S.scenarioOrder[S.step] : S.step;
  const scenario = SCENARIOS[scIdx];
  document.getElementById('rv-topbar-title').textContent = `Scenario ${S.step+1}: ${scenario.title}`;
  document.getElementById('rv-sub').textContent = `Here's what everyone chose for "${scenario.title}"`;

  // Count choices
  const choiceCounts = {};
  S.roundChoices.forEach(rc => {
    choiceCounts[rc.choiceIdx] = (choiceCounts[rc.choiceIdx] || 0) + 1;
  });

  const cards = document.getElementById('rv-cards');
  cards.innerHTML = S.roundChoices.map((rc, idx) => {
    const player = S.players[rc.playerIdx];
    const choice = scenario.choices[rc.choiceIdx];
    return '<div class="rv-card" style="animation-delay:' + (idx * 80) + 'ms;border-left:3px solid ' + player.color + ';">'
      + '<div class="rv-letter" style="background:' + player.color + '18;color:' + player.color + ';">' + choice.letter + '</div>'
      + '<div class="rv-player-info">'
      + '<div class="rv-pname" style="color:' + player.color + '">' + player.name + '</div>'
      + '<div class="rv-chose">chose option ' + choice.letter + '</div>'
      + '<div class="rv-choice-text">' + choice.text + '</div>'
      + '</div></div>';
  }).join('');

  // Agreement stat
  const statWrap = document.getElementById('rv-stat-wrap');
  const uniqueChoices = new Set(S.roundChoices.map(rc => rc.choiceIdx)).size;
  if (S.players.length > 1) {
    if (uniqueChoices === 1) {
      statWrap.innerHTML = `<div class="rv-stat">🤝 Everyone picked the same answer!</div>`;
    } else if (uniqueChoices === S.players.length) {
      statWrap.innerHTML = `<div class="rv-stat">🔀 Everyone picked differently</div>`;
    } else {
      const maxCount = Math.max(...Object.values(choiceCounts));
      const popular = parseInt(Object.entries(choiceCounts).find(([,v])=>v===maxCount)[0]);
      const pLetter = scenario.choices[popular].letter;
      statWrap.innerHTML = `<div class="rv-stat">🗳️ Most popular: Option ${pLetter} (${maxCount}/${S.players.length})</div>`;
    }
  } else {
    statWrap.innerHTML = '';
  }
}

// ═══════════════════════════════════════════════════════
//  CONSEQUENCE
// ═══════════════════════════════════════════════════════

function showDiscuss() {
  if (MP.active && MP.isHost) mpSyncStatus('discussing');
  const scIdx = S.scenarioOrder.length ? S.scenarioOrder[S.step] : S.step;
  const scenario = SCENARIOS[scIdx];

  // Populate discuss screen
  document.getElementById('discuss-title') && (document.getElementById('discuss-title').textContent = scenario.title);
  document.getElementById('discuss-tag') && (document.getElementById('discuss-tag').textContent = `Scenario ${S.step+1} of ${S.scenarioOrder.length || SCENARIOS.length}`);
  document.getElementById('discuss-heading') && (document.getElementById('discuss-heading').textContent = scenario.title);
  document.getElementById('discuss-prompt') && (document.getElementById('discuss-prompt').textContent = scenario.discussPrompt || '');
  document.getElementById('discuss-situation') && (document.getElementById('discuss-situation').textContent = scenario.situation || '');

  // Recap of each player's choice
  const recap = document.getElementById('discuss-recap');
  if (recap) {
    recap.innerHTML = S.roundChoices.map(rc => {
      const player = S.players[rc.playerIdx];
      const choice = scenario.choices[rc.choiceIdx];
      return '<div style="display:flex;align-items:flex-start;gap:12px;background:var(--card2);border:1px solid var(--border2);border-left:3px solid ' + player.color + ';border-radius:0 10px 10px 0;padding:10px 14px;margin-bottom:8px">'
        + '<div style="flex-shrink:0;width:28px;height:28px;border-radius:8px;background:' + player.color + '22;color:' + player.color + ';font-family:\'Bricolage Grotesque\',sans-serif;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:14px">' + choice.letter + '</div>'
        + '<div style="flex:1;min-width:0">'
        + '<div style="font-size:12px;font-weight:700;color:' + player.color + ';margin-bottom:2px">' + player.name + '</div>'
        + '<div style="font-size:13px;color:var(--body);line-height:1.5">' + choice.text + '</div>'
        + '</div></div>';
    }).join('');
  }

  // Options nobody picked
  const notChosen = document.getElementById('discuss-not-chosen');
  if (notChosen) {
    const chosenIdxs = new Set(S.roundChoices.map(rc => rc.choiceIdx));
    const unchosen = scenario.choices.map((c, i) => ({ c, i })).filter(x => !chosenIdxs.has(x.i));
    if (unchosen.length > 0) {
      notChosen.innerHTML = '<div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--sub);margin-bottom:8px">Nobody picked</div>'
        + unchosen.map(({c}) =>
          '<div style="display:flex;align-items:flex-start;gap:12px;background:transparent;border:1px dashed var(--border2);border-radius:10px;padding:10px 14px;margin-bottom:8px;opacity:.75">'
          + '<div style="flex-shrink:0;width:28px;height:28px;border-radius:8px;background:var(--card2);color:var(--sub);font-family:\'Bricolage Grotesque\',sans-serif;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:14px">' + c.letter + '</div>'
          + '<div style="flex:1;min-width:0;font-size:13px;color:var(--sub);line-height:1.5">' + c.text + '</div>'
          + '</div>').join('');
    } else {
      notChosen.innerHTML = '';
    }
  }

  // Companion question (always shown via HTML, no JS needed)

  // Split prompt — show only if choices diverged
  const splitEl = document.getElementById('discuss-split');
  if (splitEl) {
    const uniqueChoices = new Set(S.roundChoices.map(rc => rc.choiceIdx)).size;
    if (S.players.length > 1 && uniqueChoices >= 2) {
      splitEl.style.display = 'block';
      const splitText = document.getElementById('discuss-split-text');
      if (splitText) splitText.textContent = scenario.splitPrompt || 'What did the people who chose differently see that you did not?';
    } else {
      splitEl.style.display = 'none';
    }
  }

  // Start 2:30 timer
  S.timerRemaining = 150;
  clearInterval(S.timerInterval);
  updateTimerDisplay();
  S.timerInterval = setInterval(() => {
    S.timerRemaining--;
    updateTimerDisplay();
    if (S.timerRemaining <= 0) {
      clearInterval(S.timerInterval);
      showConsequence();
    }
  }, 1000);

  go('discuss');
}

function updateTimerDisplay() {
  const m   = Math.floor(S.timerRemaining / 60);
  const sec = S.timerRemaining % 60;
  const numEl  = document.getElementById('timer-num');
  const progEl = document.getElementById('timer-prog');
  if (numEl)  numEl.textContent = `${m}:${sec < 10 ? '0' : ''}${sec}`;
  if (progEl) progEl.style.strokeDashoffset = Math.round(((150 - S.timerRemaining) / 150) * 283);
}

function skipDiscuss() {
  clearInterval(S.timerInterval);
  showConsequence();
}

function showConsequence() {
  if (MP.active && MP.isHost) mpSyncStatus('consequence');
  buildConsequenceScreen();
  go('consequence');
}

function buildConsequenceScreen() {
  const scIdx = S.scenarioOrder.length ? S.scenarioOrder[S.step] : S.step;
  const scenario = SCENARIOS[scIdx];
  document.getElementById('cq-topbar-title').textContent = `${scenario.title} — Outcome`;

  const body = document.getElementById('cq-body');
  const ICONS = DIM_ICONS;

  // Group by choice
  const choiceGroups = {};
  S.roundChoices.forEach(rc => {
    if (!choiceGroups[rc.choiceIdx]) choiceGroups[rc.choiceIdx] = [];
    choiceGroups[rc.choiceIdx].push(rc.playerIdx);
  });

  const choiceKeys = Object.keys(choiceGroups).sort((a,b) => parseInt(a)-parseInt(b));

  let html = `
    <div class="cq-tag eyebrow">What happened</div>
    <h2 class="cq-heading">${scenario.title}</h2>
    <div class="cq-situation">${scenario.situation}</div>
    <div class="cq-scoring-note">💡 Different choices exercise different signals — a zero on one signal does not mean the choice was wrong. Each option reflects a genuine leadership approach; the signals show <em>which</em> leadership quality it demonstrates most.</div>
  `;

  choiceKeys.forEach((key, i) => {
    const choice = scenario.choices[parseInt(key)];
    const playerIdxs = choiceGroups[key];
    const chips = DIMS.map(d => {
      const v = choice.scores[d] || 0;
      const cls = v > 0 ? 'pos' : 'zero';
      const val = v > 0 ? ('+' + v) : '0';
      return '<span class="cq-chip ' + cls + '">' + ICONS[d] + ' ' + DIM_LABELS[d] + ' ' + val + '</span>';
    }).join('');

    // Who picked this (multiplayer)
    let whoHtml = '';
    if (S.players.length > 1) {
      const chips2 = playerIdxs.map(pi => {
        const p = S.players[pi];
        return '<div class="cq-player-chip"><div class="cq-pdot" style="background:' + p.color + '"></div><span class="cq-pname">' + p.name + '</span></div>';
      }).join('');
      whoHtml = '<div class="cq-players-who">' + chips2 + '</div>';
    }

    const whoLabel = playerIdxs.length + ' player' + (playerIdxs.length > 1 ? 's' : '');
    const divider = (i < choiceKeys.length - 1) ? '<div class="cq-divider"></div>' : '';
    const whyId = 'why-' + scIdx + '-' + key;
    html += '<div class="cq-outcome-block">'
      + whoHtml
      + '<div class="cq-choice-header">'
      + '<div class="cq-choice-alpha" style="background:var(--gold-dim);color:var(--gold);">' + choice.letter + '</div>'
      + '<span class="cq-who-picked">Option ' + choice.letter + ' \u2014 ' + whoLabel + '</span>'
      + '</div>'
      + '<div class="cq-choice-text">' + choice.text + '</div>'
      + '<p class="cq-explanation">' + choice.outcome + '</p>'
      + '<div class="cq-chips">' + chips + '</div>'
      + (choice.signalNotes ? (
          '<button class="ao-toggle" style="margin-top:12px" onclick="toggleAllOpts(\'' + whyId + '\')">'
          + '<span class="ao-toggle-label">📊 Why these scores?</span>'
          + '<span class="ao-arrow" id="ao-arr-' + whyId + '">▼</span>'
          + '</button>'
          + '<div class="ao-body" id="' + whyId + '">'
          + DIMS.map(function(d) {
              var v = choice.scores[d] || 0;
              var val = v > 0 ? '+' + v : '0';
              var cls = v > 0 ? 'pos' : 'zero';
              var note = choice.signalNotes[d] || '';
              return '<div class="sn-row">'
                + '<span class="cq-chip ' + cls + '">' + ICONS[d] + ' ' + DIM_LABELS[d] + ' ' + val + '</span>'
                + (note ? '<span class="sn-text"> — ' + note + '</span>' : '')
                + '</div>';
            }).join('')
          + '</div>'
        ) : '')
      + '</div>'
      + divider;
  });

  html += '<div style="height:16px"></div>' +
    '<button class="btn btn-ghost" style="width:100%;margin-bottom:10px;padding:13px" onclick="openOutcomeShareModal()">📤 Share this outcome</button>' +
    '<button class="btn btn-gold" style="width:100%" onclick="goToScoreboard()">' + (S.step >= (S.scenarioOrder.length || SCENARIOS.length) - 1 ? 'See Final Results →' : 'Next Scenario →') + '</button>';
  body.innerHTML = html;
}

function goToScoreboard() {
  scoreboardNext();
}

// ═══════════════════════════════════════════════════════
//  SCOREBOARD
// ═══════════════════════════════════════════════════════

function pct(v, max) { return max===0 ? 0 : Math.min(100, Math.round((v/max)*100)); }
function avg4(s, mx) { mx=mx||MAX; return (pct(s.T||0,mx.T)+pct(s.P||0,mx.P)+pct(s.E||0,mx.E)+pct(s.A||0,mx.A))/4; }

function buildScoreboard() {
  const _total = S.scenarioOrder.length || SCENARIOS.length;
  const isLast = S.step >= _total - 1;
  document.getElementById('sb-topbar-title').textContent = 'Scoreboard';
  document.getElementById('sb-eyebrow').textContent = `After Round ${S.step+1} of ${_total}`;
  const remaining = _total - S.step - 1;
  document.getElementById('sb-sub').textContent = isLast ? 'Final standings! See how everyone did.' : (remaining + ' scenario' + (remaining !== 1 ? 's' : '') + ' remaining.');
  document.getElementById('sb-cta').textContent = isLast ? 'See Final Results →' : `Next Scenario →`;

  // Sort players by average
  const sorted = [...S.players].sort((a,b) => avg4(b.scores, S.MAX) - avg4(a.scores, S.MAX));
  const medals = ['🥇','🥈','🥉'];
  const ranks = sorted.map((_, i) => i < 3 ? medals[i] : String(i + 1));

  const cards = document.getElementById('sb-cards');
  cards.innerHTML = sorted.map((player, rank) => {
    const totalAvg = Math.round(avg4(player.scores, S.MAX));
    const bars = DIMS.map(d => {
      const p = pct(player.scores[d], S.MAX[d]);
      return `
        <div class="sb-br">
          <div class="sb-bl">
            <span>${DIM_ICONS[d]} ${DIM_LABELS[d]}</span>
            <span class="sb-bl-pct">${p}%</span>
          </div>
          <div class="sb-track"><div class="sb-fill" data-pct="${p}"></div></div>
        </div>
      `;
    }).join('');

    const cardCls = rank === 0 ? 'sb-card first' : 'sb-card';
    const rankCls = rank === 0 ? 'sb-rank g' : 'sb-rank';
    return '<div class="' + cardCls + '">'
      + '<div class="sb-header">'
      + '<div class="' + rankCls + '">' + ranks[rank] + '</div>'
      + '<div class="sb-pname" style="color:' + player.color + '">' + player.name + '</div>'
      + '<div class="sb-total">' + totalAvg + '% avg</div>'
      + '</div>'
      + '<div class="sb-bars">' + bars + '</div>'
      + '</div>';
  }).join('');

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.sb-fill[data-pct]').forEach(el => {
      el.style.width = el.getAttribute('data-pct') + '%';
    });
  }, 100);
}

function scoreboardNext() {
  const _total = S.scenarioOrder.length || SCENARIOS.length;
  const isLast = S.step >= _total - 1;
  if (isLast) {
    if (MP.active && MP.isHost) mpSyncStatus('final');
    buildFinal();
    go('final');
  } else {
    S.step++;
    S.roundChoices = [];
    S.pickerIdx = 0;
    if (MP.active && MP.isHost) {
      mpClearRound(S.step, 'playing'); // one atomic Firebase write
    }
    renderPickTurn(0);
    go('game');
    if (MP.active && MP.isHost) listenHostAnswers();
  }
}

// ═══════════════════════════════════════════════════════
//  FINAL RESULTS
// ═══════════════════════════════════════════════════════



function getDimInsight(player, dim, excludeScenarios) {
  excludeScenarios = excludeScenarios || [];
  const keyScenarios = DIM_KEY_SCENARIOS[dim];

  // First pass: find worst scenario not already used
  let worstIdx = null;
  let worstMissed = -1;
  keyScenarios.forEach(sIdx => {
    if (excludeScenarios.indexOf(sIdx) !== -1) return;
    const choiceIdx = player.choices[sIdx];
    if (choiceIdx === null) return;
    const maxPts = Math.max(...SCENARIOS[sIdx].choices.map(c => c.scores[dim] || 0));
    const got = SCENARIOS[sIdx].choices[choiceIdx].scores[dim] || 0;
    if (maxPts - got > worstMissed) { worstMissed = maxPts - got; worstIdx = sIdx; }
  });

  // Fallback: ignore exclusion if no other option
  if (worstIdx === null) {
    worstMissed = -1;
    keyScenarios.forEach(sIdx => {
      const choiceIdx = player.choices[sIdx];
      if (choiceIdx === null) return;
      const maxPts = Math.max(...SCENARIOS[sIdx].choices.map(c => c.scores[dim] || 0));
      const got = SCENARIOS[sIdx].choices[choiceIdx].scores[dim] || 0;
      if (maxPts - got > worstMissed) { worstMissed = maxPts - got; worstIdx = sIdx; }
    });
  }

  if (worstIdx === null) worstIdx = keyScenarios[0];
  const choiceIdx = player.choices[worstIdx] !== null ? player.choices[worstIdx] : 0;
  const ins = DIM_INSIGHTS[dim][worstIdx][choiceIdx];
  return {
    scenarioTitle: SCENARIOS[worstIdx].title,
    choiceLetter: SCENARIOS[worstIdx].choices[choiceIdx].letter,
    scenarioIdx: worstIdx,
    insight: ins.insight,
    action: ins.action
  };
}

function getProfile(s, mx) {
  mx = mx || MAX;
  // Run profiles in cascade order - first match wins
  const cascadeOrder = [
    "visionary",
    "cornerstone","catalyst","enabler","driver","pathfinder","architect",
    "protector","lookout","builder","compass",
    "rising",
    "firefighter",
    "steady-T","steady-P","steady-E","steady-A"
  ];
  for (const id of cascadeOrder) {
    const profile = PROFILES.find(p => p.id === id);
    if (profile && profile.match(s, mx)) return profile;
  }
  return PROFILES.find(p => p.id === "steady-T");
}

function profileDisplayName(profile) {
  // For Steady Hand variants, show the leaning signal
  const leaningMap = {
    'steady-T': 'The Steady Hand — Trust',
    'steady-P': 'The Steady Hand — Proactivity',
    'steady-E': 'The Steady Hand — Empowerment',
    'steady-A': 'The Steady Hand — Adaptability'
  };
  return leaningMap[profile.id] || profile.name;
}

function buildFinal() {
  document.getElementById('final-sub').textContent =
    S.players.length === 1
      ? "Here's what your choices revealed about your leadership."
      : 'Here is what ' + S.players.length + ' different sets of choices revealed.';

  const sorted = [...S.players].sort((a,b) => avg4(b.scores, S.MAX) - avg4(a.scores, S.MAX));

  const cards = document.getElementById('final-cards');
  cards.innerHTML = sorted.map(player => {
    const profile = getProfile(player.scores, S.MAX);
    const lowestDims = [...DIMS].sort((a,b) => pct(player.scores[a],S.MAX[a]) - pct(player.scores[b],S.MAX[b])).slice(0,3);

    const bars = DIMS.map(d => {
      const p = pct(player.scores[d], S.MAX[d]);
      return '<div class="pr-br">'
        + '<div class="pr-bl"><span class="pr-bl-name">' + DIM_ICONS[d] + ' ' + DIM_LABELS[d] + '</span><span class="pr-bl-pct">' + p + '%</span></div>'
        + '<div class="pr-track"><div class="pr-fill" data-pct="' + p + '"></div></div>'
        + '</div>';
    }).join('');

    const usedScenarios = [];
    const insights = lowestDims.map(d => {
      const ins = getDimInsight(player, d, usedScenarios);
      usedScenarios.push(ins.scenarioIdx);
      return '<div class="pr-insight">'
        + '<div class="pr-insight-dim">' + DIM_ICONS[d] + ' ' + DIM_LABELS[d] + ' &nbsp;<span class="pr-insight-pct">' + pct(player.scores[d], S.MAX[d]) + '%</span></div>'
        + '<div class="pr-insight-from">From &ldquo;' + ins.scenarioTitle + '&rdquo; &mdash; Choice ' + ins.choiceLetter + '</div>'
        + '<p class="pr-insight-text">' + ins.insight + '</p>'
        + '<div class="pr-insight-action"><span class="pr-insight-action-label">Try this</span>' + ins.action + '</div>'
        + '</div>';
    }).join('');

    const cardId = 'pc-' + player.name.replace(/\s+/g, '-');
    return '<div class="pr-card">'
      + '<div class="pr-header">'
      + '<div class="pr-dot" style="background:' + player.color + '"></div>'
      + '<div class="pr-name" style="color:' + player.color + '">' + player.name + '</div>'
      + '<div class="pr-emoji">' + profile.emoji + '</div>'
      + '</div>'
      + '<div class="pr-profile">' + profileDisplayName(profile) + '</div>'
      + '<p class="pr-desc">' + profile.desc + '</p>'
      + '<div class="pr-bars">' + bars + '</div>'
      + '<button class="pr-insights-toggle" onclick="toggleInsights(\'' + cardId + '\')">'
      + '<span class="pr-insights-toggle-label">📈 Growth Insights &nbsp;(tap to expand)</span>'
      + '<span class="pr-insights-arrow" id="arr-' + cardId + '">▼</span>'
      + '</button>'
      + '<div class="pr-insights-body" id="' + cardId + '">'
      + insights
      + '<button class="pr-insights-toggle" onclick="toggleInsights(\'' + cardId + '\')" style="margin-top:4px;">'
      + '<span class="pr-insights-toggle-label">▲ &nbsp;Tap to close</span>'
      + '<span></span>'
      + '</button>'
      + '</div>'
      + '</div>';
  }).join('');

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.pr-fill[data-pct]').forEach(el => {
      el.style.width = el.getAttribute('data-pct') + '%';
    });
  }, 150);
}

function toggleInsights(cardId) {
  const body = document.getElementById(cardId);
  const arrow = document.getElementById('arr-' + cardId);
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  arrow.classList.toggle('open', !isOpen);
}

function toggleAllOpts(aoId) {
  const body = document.getElementById(aoId);
  const arrow = document.getElementById('ao-arr-' + aoId);
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  arrow.classList.toggle('open', !isOpen);
}

// ── SHARE ──────────────────────────────────────────────

function buildOutcomeShareText() {
  const scIdx = S.scenarioOrder.length ? S.scenarioOrder[S.step] : S.step;
  const scenario = SCENARIOS[scIdx];
  const totalRounds = S.scenarioOrder.length || SCENARIOS.length;
  let text = '🎯 The Leadership Challenge — HLE/Alaya 2026\n';
  text += 'Scenario ' + (S.step + 1) + ' of ' + totalRounds + ': ' + scenario.title + '\n';
  text += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
  text += '📋 Situation:\n' + scenario.situation + '\n\n';
  text += '━━━━━━━━━━━━━━━━━━━━━━\n\n';

  const choiceGroups = {};
  S.roundChoices.forEach(rc => {
    if (!choiceGroups[rc.choiceIdx]) choiceGroups[rc.choiceIdx] = [];
    choiceGroups[rc.choiceIdx].push(rc.playerIdx);
  });

  Object.keys(choiceGroups).sort((a,b) => parseInt(a)-parseInt(b)).forEach(key => {
    const choice = scenario.choices[parseInt(key)];
    const playerIdxs = choiceGroups[key];
    const playerNames = playerIdxs.map(pi => S.players[pi].name.toUpperCase()).join(', ');

    text += '👤 ' + playerNames + ' — Option ' + choice.letter + '\n';
    text += '"' + choice.text + '"\n\n';
    text += 'What happened:\n' + choice.outcome + '\n\n';

    const scores = DIMS.map(d => {
      const v = choice.scores[d] || 0;
      return DIM_ICONS[d] + ' ' + DIM_LABELS[d] + (v > 0 ? ' +' + v : ' 0');
    }).join('  ');
    text += scores + '\n';
    if (choice.signalNotes) {
      text += '\nWhy these scores:\n';
      DIMS.forEach(d => {
        const v = choice.scores[d] || 0;
        const note = choice.signalNotes[d] || '';
        text += DIM_ICONS[d] + ' ' + DIM_LABELS[d] + ' ' + (v > 0 ? '+' + v : '0') + ' — ' + note + '\n';
      });
      text += '\n';
    }
    text += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
  });

  text += '💬 Discuss: ' + scenario.discussPrompt + '\n\n';
  text += 'The Leadership Challenge — HLE/Alaya 2026';
  return text;
}

function buildAllOutcomesShareText() {
  var scenarioOrder = fbArr(S.scenarioOrder);
  var totalRounds = scenarioOrder.length;
  var lines = [];

  lines.push('📋 Leadership Challenge — All Scenario Outcomes');
  lines.push('HLE / Alaya · 2026');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');

  for (var i = 0; i < totalRounds; i++) {
    try {
      var scIdx = parseInt(scenarioOrder[i], 10);
      var scenario = SCENARIOS[scIdx];
      if (!scenario) { lines.push('[Scenario ' + (i+1) + ': data not found]'); lines.push(''); continue; }

      lines.push('SCENARIO ' + (i + 1) + ' OF ' + totalRounds + ': ' + scenario.title.toUpperCase());
      lines.push('');
      lines.push('📋 Situation:');
      lines.push(scenario.situation || '');
      lines.push('');

      var choiceGroups = {};
      var players = S.players || [];

      if (players.length === 1) {
        var ch0 = players[0] ? players[0].choices : null;
        var ci0 = ch0 ? (Array.isArray(ch0) ? ch0[scIdx] : ch0[scIdx]) : undefined;
        if (ci0 !== undefined && ci0 !== null) choiceGroups[String(ci0)] = [0];
      } else {
        players.forEach(function(player, playerIdx) {
          var ch = player ? player.choices : null;
          var ci = ch ? (Array.isArray(ch) ? ch[scIdx] : ch[scIdx]) : undefined;
          if (ci !== undefined && ci !== null) {
            var k = String(ci);
            if (!choiceGroups[k]) choiceGroups[k] = [];
            choiceGroups[k].push(playerIdx);
          }
        });
      }

      var choiceKeys = Object.keys(choiceGroups).sort(function(a,b){ return parseInt(a)-parseInt(b); });
      choiceKeys.forEach(function(key) {
        var ci = parseInt(key, 10);
        var choice = (scenario.choices && scenario.choices[ci]) || null;
        if (!choice) return;
        var playerIdxs = choiceGroups[key];
        var playerNames = playerIdxs.map(function(pi){
          var nm = (players[pi] && players[pi].name) ? players[pi].name : 'Player';
          return nm.toUpperCase();
        }).join(', ');

        lines.push(players.length === 1
          ? '👤 You chose Option ' + (choice.letter || '?')
          : '👤 ' + playerNames + ' — Option ' + (choice.letter || '?'));
        lines.push('"' + (choice.text || '') + '"');
        lines.push('');
        lines.push('What happened:');
        lines.push(choice.outcome || '');
        lines.push('');

        var scoreChips = DIMS.map(function(d) {
          var v = (choice.scores && choice.scores[d]) || 0;
          return (DIM_ICONS[d] || '') + ' ' + (DIM_LABELS[d] || d) + (v > 0 ? ' +' + v : ' 0');
        }).join('  ');
        lines.push(scoreChips);

        if (choice.signalNotes) {
          lines.push('');
          lines.push('Why these scores:');
          DIMS.forEach(function(d) {
            var v = (choice.scores && choice.scores[d]) || 0;
            var note = (choice.signalNotes[d]) || '';
            lines.push((DIM_ICONS[d] || '') + ' ' + (DIM_LABELS[d] || d) + ' ' + (v > 0 ? '+' + v : '0') + ' — ' + note);
          });
          lines.push('');
        }
      });

      lines.push('💬 Discuss: ' + (scenario.discussPrompt || ''));
      lines.push('━━━━━━━━━━━━━━━━━━━━━━');
      lines.push('');
    } catch(scenarioErr) {
      lines.push('[Scenario ' + (i+1) + ' error: ' + String(scenarioErr) + ']');
      lines.push('');
    }
  }

  lines.push('The Leadership Challenge — HLE/Alaya 2026');
  return lines.join('\n');
}

function downloadAllOutcomesWord() {
  var scenarioOrder = fbArr(S.scenarioOrder);
  var totalRounds = scenarioOrder.length;
  var html = '<html><head><meta charset="UTF-8">'
    + '<style>body{font-family:Calibri,sans-serif;color:#111;max-width:700px;margin:40px auto;padding:0 24px}'
    + 'h1{color:#c47a00;font-size:22px;margin-bottom:4px}'
    + 'h2{color:#333;font-size:16px;margin:24px 0 4px}'
    + '.eyebrow{font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#c47a00;margin-bottom:6px}'
    + '.situation{background:#fffbf0;border-left:3px solid #f5a623;padding:12px 16px;margin:12px 0;font-style:italic;font-size:14px;border-radius:0 6px 6px 0}'
    + '.note{font-size:12px;color:#999;margin:4px 0 16px;font-style:italic}'
    + '.player-block{border:1px solid #eee;border-radius:6px;padding:14px 18px;margin:14px 0}'
    + '.player-name{font-weight:bold;font-size:14px;color:#c47a00;margin-bottom:4px}'
    + '.choice-letter{display:inline-block;background:#c47a00;color:#fff;width:22px;height:22px;border-radius:4px;text-align:center;line-height:22px;font-weight:bold;font-size:13px;margin-right:6px;vertical-align:middle}'
    + '.choice-text{font-style:italic;font-size:13px;color:#555;border-left:3px solid #eee;padding:6px 12px;margin:8px 0}'
    + '.outcome{font-size:14px;color:#222;margin:8px 0}'
    + '.chips{margin:10px 0}'
    + '.chip{display:inline-block;background:#fff3cc;color:#7a5000;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:bold;margin:2px 4px 2px 0}'
    + '.chip-zero{display:inline-block;background:#f5f5f5;color:#999;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:bold;margin:2px 4px 2px 0}'
    + '.signal-notes{margin:12px 0 4px}'
    + '.signal-notes-label{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#c47a00;margin-bottom:6px}'
    + '.signal-note-row{display:flex;align-items:flex-start;gap:8px;margin-bottom:7px}'
    + '.signal-note-text{font-size:13px;color:#444;line-height:1.55;flex:1}'
    + '.discuss{background:#f9f9f9;border:1px solid #eee;border-radius:6px;padding:12px 16px;margin:16px 0;font-size:14px;color:#444}'
    + '.divider{border:none;border-top:2px solid #c47a00;margin:28px 0}'
    + '.thin-divider{border:none;border-top:1px solid #eee;margin:16px 0}'
    + '</style></head><body>'
    + '<div class="eyebrow">Leadership Challenge &middot; HLE/Alaya 2026</div>'
    + '<h1>All Scenario Outcomes &mdash; ' + totalRounds + ' Scenarios</h1>'
    + '<p class="note">&#128161; Different choices exercise different signals &mdash; a zero does not mean the choice was wrong.</p>';

  for (var i = 0; i < totalRounds; i++) {
    var scIdx = parseInt(scenarioOrder[i], 10);
    var scenario = SCENARIOS[scIdx];
    if (!scenario) continue;

    if (i > 0) html += '<hr class="divider">';
    html += '<h2>Scenario ' + (i + 1) + ' of ' + totalRounds + ': ' + scenario.title + '</h2>'
      + '<div class="situation">' + scenario.situation + '</div>';

    var choiceGroups = {};
    var players = S.players || [];
    if (players.length === 1) {
      var ch0 = players[0] ? players[0].choices : null;
      var ci0 = ch0 ? (Array.isArray(ch0) ? ch0[scIdx] : ch0[scIdx]) : undefined;
      if (ci0 !== undefined && ci0 !== null) choiceGroups[String(ci0)] = [0];
    } else {
      players.forEach(function(player, playerIdx) {
        var ch = player ? player.choices : null;
        var ci = ch ? (Array.isArray(ch) ? ch[scIdx] : ch[scIdx]) : undefined;
        if (ci !== undefined && ci !== null) {
          var k = String(ci);
          if (!choiceGroups[k]) choiceGroups[k] = [];
          choiceGroups[k].push(playerIdx);
        }
      });
    }

    Object.keys(choiceGroups).sort(function(a,b){ return parseInt(a)-parseInt(b); }).forEach(function(key) {
      var ci = parseInt(key, 10);
      var choice = (scenario.choices && scenario.choices[ci]) || null;
      if (!choice) return;
      var playerIdxs = choiceGroups[key];
      var playerNames = playerIdxs.map(function(pi){ return (players[pi] && players[pi].name) || 'Player'; }).join(', ');

      html += '<div class="player-block">'
        + '<div class="player-name">' + (isSolo() ? 'You' : playerNames) + '</div>'
        + '<div style="margin:4px 0"><span class="choice-letter">' + choice.letter + '</span>'
        + '<span style="font-size:13px;color:#666">' + (isSolo() ? 'You chose' : playerNames + ' chose') + ' Option ' + choice.letter + '</span></div>'
        + '<div class="choice-text">' + choice.text + '</div>'
        + '<div class="outcome"><strong>What happened:</strong><br>' + choice.outcome + '</div>'
        + '<div class="chips">';

      DIMS.forEach(function(d) {
        var v = choice.scores[d] || 0;
        var label = DIM_ICONS[d] + ' ' + DIM_LABELS[d] + (v > 0 ? ' +' + v : ' 0');
        html += v > 0
          ? '<span class="chip">' + label + '</span>'
          : '<span class="chip-zero">' + label + '</span>';
      });

      html += '</div>';

      if (choice.signalNotes) {
        html += '<div class="signal-notes">'
          + '<div class="signal-notes-label">Why these scores</div>';
        DIMS.forEach(function(d) {
          var v = choice.scores[d] || 0;
          var note = choice.signalNotes[d] || '';
          var label = DIM_ICONS[d] + ' ' + DIM_LABELS[d] + (v > 0 ? ' +' + v : ' 0');
          html += '<div class="signal-note-row">'
            + '<span class="chip' + (v === 0 ? '-zero' : '') + '" style="white-space:nowrap">' + label + '</span>'
            + (note ? '<span class="signal-note-text"> &mdash; ' + note + '</span>' : '')
            + '</div>';
        });
        html += '</div>';
      }

      html += '</div>';
    });

    html += '<div class="discuss"><strong>&#128172; Discuss:</strong> ' + scenario.discussPrompt + '</div>';
  }

  html += '</body></html>';

  var blob = new Blob([html], { type: 'application/msword' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Leadership-Challenge-All-Outcomes.doc';
  a.click();
  closeShareModal();
  showToast('✓ All outcomes doc downloaded!');
}

function openOutcomeShareModal() {
  const n = S.players.length;
  _shareCache = { mode: 'outcome', text: buildOutcomeShareText(), subject: 'Leadership Challenge Outcome — HLE/Alaya 2026' };
  document.getElementById('share-modal-title').textContent = 'Share Scenario Outcome';
  document.getElementById('share-modal-sub').textContent =
    n === 1 ? 'Share this scenario outcome.' : 'Share what everyone chose and what happened.';
  document.getElementById('share-modal').setAttribute('data-mode', 'outcome');
  document.getElementById('share-modal').classList.add('vis');
}

function buildShareText() {
  const sorted = [...S.players].sort((a,b) => avg4(b.scores, S.MAX) - avg4(a.scores, S.MAX));
  let text = '🏆 Leadership Challenge Results\nHLE / Alaya · 2026\n';
  text += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
  sorted.forEach((player, i) => {
    const profile = getProfile(player.scores, S.MAX);
    const medals = ['🥇','🥈','🥉'];
    const rank = i < 3 ? medals[i] : (i + 1) + '.';
    text += rank + ' ' + player.name.toUpperCase() + ' — ' + profileDisplayName(profile) + ' ' + profile.emoji + '\n';
    text += '🛡️ Trust: ' + pct(player.scores.T, S.MAX.T) + '%  ';
    text += '👁️ Proactivity: ' + pct(player.scores.P, S.MAX.P) + '%  ';
    text += '🎯 Delegation: ' + pct(player.scores.E, S.MAX.E) + '%  ';
    text += '🔄 Adaptability: ' + pct(player.scores.A, S.MAX.A) + '%\n';
    text += '\n' + profile.desc + '\n';
    text += '\n📈 Growth Insights:\n';
    const lowestDims = [...DIMS].sort((a,b) => pct(player.scores[a],S.MAX[a]) - pct(player.scores[b],S.MAX[b])).slice(0,3);
    const usedSc = [];
    lowestDims.forEach(d => {
      const ins = getDimInsight(player, d, usedSc);
      usedSc.push(ins.scenarioIdx);
      text += '\n' + DIM_ICONS[d] + ' ' + DIM_LABELS[d] + ' (' + pct(player.scores[d], S.MAX[d]) + '%)';
      text += ' — From "' + ins.scenarioTitle + '", Choice ' + ins.choiceLetter + '\n';
      text += ins.insight + '\n';
      text += '▶ Try this: ' + ins.action + '\n';
    });
    text += '\n━━━━━━━━━━━━━━━━━━━━━━\n\n';
  });
  text += 'Played at HLE/Alaya Leadership Challenge 2026';
  return text;
}

function openShareModal() {
  const n = S.players.length;
  _shareCache = { mode: 'results', text: buildShareText(), subject: 'Leadership Challenge Results \u2014 HLE/Alaya 2026' };
  document.getElementById('share-modal-title').textContent = 'Share Final Results';
  document.getElementById('share-modal-sub').textContent =
    n === 1 ? 'Share your leadership profile.' : 'Share all ' + n + ' players\u2019 leadership profiles.';
  document.getElementById('share-modal').setAttribute('data-mode', 'results');
  document.getElementById('share-modal').classList.add('vis');
}

function openAllOutcomesShareModal() {
  const n = S.players.length;
  var text = '';
  var errMsg = '';
  try { text = buildAllOutcomesShareText(); }
  catch(e) { errMsg = String(e); text = ''; }
  _shareCache = { mode: 'all-outcomes', text: text, subject: 'Leadership Challenge \u2014 All Scenario Outcomes \u2014 HLE/Alaya 2026' };
  document.getElementById('share-modal-title').textContent = 'Share All Questions Outcomes';
  document.getElementById('share-modal-sub').textContent = errMsg
    ? 'Build error: ' + errMsg
    : (n === 1 ? 'Share every scenario outcome with signal explanations.' : 'Share every scenario outcome and signal explanations for all players.');
  document.getElementById('share-modal').setAttribute('data-mode', 'all-outcomes');
  document.getElementById('share-modal').classList.add('vis');
}
function closeShareModal() { const m = document.getElementById('share-modal'); m.classList.remove('vis'); m.removeAttribute('data-mode'); _shareCache = { mode:'', text:'', subject:'' }; }
function handleShareOverlayClick(e) { if (e.target === document.getElementById('share-modal')) closeShareModal(); }

function showToast(msg) {
  const t = document.getElementById('share-toast');
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 2200);
}

// ── SHARE CACHE ──────────────────────────────────────────────
// Pre-built at modal-open time so buttons never re-read DOM state.
var _shareCache = { mode: '', text: '', subject: '' };

function getShareText() { return _shareCache.text; }

function shareWhatsApp() {
  const text = _shareCache.text;
  if (!text) { showToast('Nothing to share.'); return; }
  const encoded = encodeURIComponent(text);
  if (encoded.length < 5000) {
    window.open('https://wa.me/?text=' + encoded, '_blank');
    closeShareModal();
  } else {
    // Text too long for WhatsApp URL — copy to clipboard, open WhatsApp, tell user to paste
    const afterCopy = () => {
      window.open('https://web.whatsapp.com/', '_blank');
      closeShareModal();
      showToast('📋 Text copied — paste it into your chat');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(afterCopy).catch(() => { _fallbackCopy(text); afterCopy(); });
    } else {
      _fallbackCopy(text);
      afterCopy();
    }
  }
}

function shareEmail() {
  const text = _shareCache.text;
  if (!text) { showToast('Nothing to share.'); return; }
  const subject = _shareCache.subject;
  const encoded = encodeURIComponent(text);
  // mailto: URLs have limits too — truncate gracefully
  const body = encoded.length < 8000 ? encoded : encodeURIComponent(text.slice(0, 2500) + '\n\n[Text truncated — use Copy Text for the full version]');
  window.open('mailto:?subject=' + encodeURIComponent(subject) + '&body=' + body, '_blank');
  closeShareModal();
}

function copyShareText() {
  const text = _shareCache.text;
  if (!text) { showToast('Nothing to share.'); return; }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => { showToast('✓ Copied to clipboard!'); closeShareModal(); })
      .catch(() => {
        // Fallback for browsers that deny async clipboard
        _fallbackCopy(text);
      });
  } else {
    _fallbackCopy(text);
  }
}

function _fallbackCopy(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;width:2em;height:2em;opacity:0;border:none;outline:none;box-shadow:none';
    document.body.appendChild(ta);
    ta.focus();
    ta.setSelectionRange(0, ta.value.length); // required for iOS
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✓ Copied to clipboard!');
  } catch(e) {
    showToast('Copy failed — use Word Doc instead.');
  }
  closeShareModal();
}

function downloadOutcomeWord() {
  const scIdx = S.scenarioOrder.length ? S.scenarioOrder[S.step] : S.step;
  const scenario = SCENARIOS[scIdx];
  const totalRounds = S.scenarioOrder.length || SCENARIOS.length;

  const choiceGroups = {};
  S.roundChoices.forEach(rc => {
    if (!choiceGroups[rc.choiceIdx]) choiceGroups[rc.choiceIdx] = [];
    choiceGroups[rc.choiceIdx].push(rc.playerIdx);
  });

  let html = '<html><head><meta charset="UTF-8">'
    + '<style>body{font-family:Calibri,sans-serif;color:#111;max-width:700px;margin:40px auto;padding:0 24px}'
    + 'h1{color:#c47a00;font-size:22px;margin-bottom:4px}'
    + 'h2{color:#333;font-size:16px;margin:24px 0 4px}'
    + '.eyebrow{font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#c47a00;margin-bottom:6px}'
    + '.situation{background:#fffbf0;border-left:3px solid #f5a623;padding:12px 16px;margin:12px 0;font-style:italic;font-size:14px;border-radius:0 6px 6px 0}'
    + '.note{font-size:12px;color:#999;margin:4px 0 16px;font-style:italic}'
    + '.player-block{border:1px solid #eee;border-radius:6px;padding:14px 18px;margin:14px 0}'
    + '.player-name{font-weight:bold;font-size:14px;color:#c47a00;margin-bottom:4px}'
    + '.choice-letter{display:inline-block;background:#c47a00;color:#fff;width:22px;height:22px;border-radius:4px;text-align:center;line-height:22px;font-weight:bold;font-size:13px;margin-right:6px;vertical-align:middle}'
    + '.choice-text{font-style:italic;font-size:13px;color:#555;border-left:3px solid #eee;padding:6px 12px;margin:8px 0}'
    + '.outcome{font-size:14px;color:#222;margin:8px 0}'
    + '.chips{margin:10px 0}'
    + '.chip{display:inline-block;background:#fff3cc;color:#7a5000;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:bold;margin:2px 4px 2px 0}'
    + '.signal-notes{margin:12px 0 4px;}'
    + '.signal-notes-label{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#c47a00;margin-bottom:6px}'
    + '.signal-note-row{display:flex;align-items:flex-start;gap:8px;margin-bottom:7px}'
    + '.signal-note-text{font-size:13px;color:#444;line-height:1.55;flex:1}'
    + '.discuss{background:#f9f9f9;border:1px solid #eee;border-radius:6px;padding:12px 16px;margin:20px 0;font-size:14px;color:#444}'
    + '.divider{border:none;border-top:1px solid #eee;margin:20px 0}'
    + '</style></head><body>'
    + '<div class="eyebrow">Leadership Challenge &middot; HLE/Alaya 2026</div>'
    + '<h1>Scenario ' + (S.step + 1) + ' of ' + totalRounds + ': ' + scenario.title + '</h1>'
    + '<div class="situation">' + scenario.situation + '</div>'
    + '<p class="note">&#128161; Different choices exercise different signals &mdash; a zero does not mean the choice was wrong.</p>'
    + '<hr class="divider">';

  Object.keys(choiceGroups).sort((a,b) => parseInt(a)-parseInt(b)).forEach(key => {
    const choice = scenario.choices[parseInt(key)];
    const playerIdxs = choiceGroups[key];
    const playerNames = playerIdxs.map(pi => S.players[pi].name).join(', ');

    html += '<div class="player-block">'
      + '<div class="player-name">' + playerNames + '</div>'
      + '<div style="margin:4px 0"><span class="choice-letter">' + choice.letter + '</span>'
      + '<strong>Option ' + choice.letter + '</strong></div>'
      + '<div class="choice-text">' + choice.text + '</div>'
      + '<div class="outcome">' + choice.outcome + '</div>'
      + '<div class="chips">'
      + DIMS.map(d => {
          const v = choice.scores[d] || 0;
          return '<span class="chip">' + DIM_ICONS[d] + ' ' + DIM_LABELS[d] + (v > 0 ? ' +' + v : ' 0') + '</span>';
        }).join('')
      + '</div>'
      + (choice.signalNotes ? (
          '<div class="signal-notes">'
          + '<div class="signal-notes-label">Why these scores</div>'
          + DIMS.map(d => {
              const v = choice.scores[d] || 0;
              const note = choice.signalNotes[d] || '';
              return '<div class="signal-note-row">'
                + '<span class="chip">' + DIM_ICONS[d] + ' ' + DIM_LABELS[d] + ' ' + (v > 0 ? '+' + v : '0') + '</span>'
                + '<span class="signal-note-text"> — ' + note + '</span>'
                + '</div>';
            }).join('')
          + '</div>'
        ) : '')
      + '</div>';
  });

  html += '<div class="discuss"><strong>Discuss:</strong> ' + scenario.discussPrompt + '</div>'
    + '</body></html>';

  const blob = new Blob([html], { type: 'application/msword' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Outcome-Scenario-' + (S.step + 1) + '-' + scenario.title.replace(/\s+/g,'-') + '.doc';
  a.click();
  closeShareModal();
  showToast('\u2713 Outcome doc downloaded!');
}

function downloadWord() {
  const mode = _shareCache.mode;
  if (mode === 'outcome') { downloadOutcomeWord(); return; }
  if (mode === 'all-outcomes') { downloadAllOutcomesWord(); return; }
  const sorted = [...S.players].sort((a,b) => avg4(b.scores, S.MAX) - avg4(a.scores, S.MAX));
  const medals = ['🥇','🥈','🥉'];
  let html = '<html><head><meta charset="UTF-8">'
    + '<style>body{font-family:Calibri,sans-serif;color:#111;max-width:700px;margin:40px auto;padding:0 24px}'
    + 'h1{color:#c47a00;font-size:26px;margin-bottom:4px}'
    + 'h2{color:#333;font-size:18px;margin:28px 0 4px}'
    + 'h3{color:#c47a00;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;margin:18px 0 4px}'
    + '.tag{display:inline-block;background:#fff3cc;color:#7a5000;padding:3px 10px;border-radius:4px;font-size:13px;font-weight:bold}'
    + '.bar-row{display:flex;align-items:center;gap:10px;margin:5px 0}'
    + '.bar-label{font-size:13px;width:110px;color:#555}'
    + '.bar-track{flex:1;height:10px;background:#f0e8d0;border-radius:5px}'
    + '.bar-fill{height:10px;background:#f5a623;border-radius:5px}'
    + '.bar-pct{font-size:13px;color:#c47a00;font-weight:bold;width:36px;text-align:right}'
    + '.insight{background:#fffbf0;border-left:3px solid #f5a623;padding:10px 14px;margin:8px 0;border-radius:0 6px 6px 0}'
    + '.insight-from{font-size:11px;color:#999;margin-bottom:4px}'
    + '.try-this{background:#fff3e0;padding:8px 12px;border-radius:4px;font-size:13px;margin-top:6px}'
    + '.try-label{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#c47a00;display:block;margin-bottom:3px}'
    + '.divider{border:none;border-top:1px solid #eee;margin:28px 0}'
    + '</style></head><body>'
    + '<h1>Leadership Challenge Results</h1>'
    + '<p style="color:#888;font-size:13px">HLE / Alaya &middot; 2026</p><hr class="divider">';

  sorted.forEach((player, i) => {
    const profile = getProfile(player.scores, S.MAX);
    const rank = i < 3 ? medals[i] : (i + 1) + '.';
    const usedSc = [];
    const lowestDims = [...DIMS].sort((a,b) => pct(player.scores[a],S.MAX[a]) - pct(player.scores[b],S.MAX[b]));
    html += '<h2>' + rank + ' ' + player.name + '</h2>';
    html += '<p><span class="tag">' + profileDisplayName(profile) + ' ' + profile.emoji + '</span></p>';
    html += '<p style="font-size:14px;color:#444;margin:8px 0 14px">' + profile.desc + '</p>';
    DIMS.forEach(d => {
      const p = pct(player.scores[d], S.MAX[d]);
      html += '<div class="bar-row">'
        + '<span class="bar-label">' + DIM_ICONS[d] + ' ' + DIM_LABELS[d] + '</span>'
        + '<div class="bar-track"><div class="bar-fill" style="width:' + p + '%"></div></div>'
        + '<span class="bar-pct">' + p + '%</span></div>';
    });
    html += '<h3 style="margin-top:20px">Growth Insights</h3>';
    lowestDims.forEach(d => {
      const ins = getDimInsight(player, d, usedSc);
      usedSc.push(ins.scenarioIdx);
      html += '<div class="insight">'
        + '<div class="insight-from">From &ldquo;' + ins.scenarioTitle + '&rdquo; &mdash; Choice ' + ins.choiceLetter + ' &mdash; ' + DIM_ICONS[d] + ' ' + DIM_LABELS[d] + ' ' + pct(player.scores[d],S.MAX[d]) + '%</div>'
        + '<p style="font-size:14px;margin:4px 0">' + ins.insight + '</p>'
        + '<div class="try-this"><span class="try-label">Try this</span>' + ins.action + '</div>'
        + '</div>';
    });
    if (i < sorted.length - 1) html += '<hr class="divider">';
  });

  html += '</body></html>';
  const blob = new Blob([html], { type: 'application/msword' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Leadership-Challenge-Results-2026.doc';
  a.click();
  closeShareModal();
  showToast('✓ Word doc downloaded!');
}

function playAgain() {
  clearState();
  if (MP.active && MP.isHost) {
    MP.gameRef.update({ status:'lobby', step:null, scenarioOrder:null, mode:null, MAX:null, roundChoices:null });
    MP.gameRef.child('players').once('value', snap => {
      const updates = {};
      Object.keys(snap.val() || {}).forEach(id => {
        updates['players/' + id + '/scores'] = { T:0, P:0, E:0, A:0 };
        updates['players/' + id + '/choices'] = {};
        updates['players/' + id + '/answered'] = false;
      });
      MP.gameRef.update(updates);
    });
    S.players = []; S.step = 0; S.roundChoices = [];
    document.getElementById('hl-code').textContent = MP.roomCode;
    go('host-lobby');
    return;
  }
  if (MP.active && !MP.isHost) resetMP();
  S.players = [];
  S.step = 0;
  S.roundChoices = [];
  S.pickerIdx = 0;
  go('splash');
}

// ═══════════════════════════════════════════════════════
//  LOCAL STORAGE
// ═══════════════════════════════════════════════════════

const STORAGE_KEY = 'lc_game_v1';
const SAVE_SCREENS = new Set(['game','reveal','discuss','consequence','scoreboard','final']);

function saveState(screen) {
  if (MP.active) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      screen,
      players: S.players,
      step: S.step,
      scenarioOrder: S.scenarioOrder,
      roundChoices: S.roundChoices,
      pickerIdx: S.pickerIdx,
      MAX: S.MAX
    }));
  } catch(e) {}
}

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

function restoreGame() {
  if (localStorage.getItem('lc_mp_role')) return false;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const saved = JSON.parse(raw);
    Object.assign(S, {
      players: saved.players,
      step: saved.step,
      scenarioOrder: saved.scenarioOrder,
      roundChoices: saved.roundChoices,
      pickerIdx: saved.pickerIdx,
      MAX: saved.MAX
    });
    const sc = saved.screen;
    if      (sc === 'game')                              { renderPickTurn(S.pickerIdx); go('game'); }
    else if (sc === 'reveal')                            { buildRevealScreen(); go('reveal'); }
    else if (sc === 'discuss' || sc === 'consequence')   { buildConsequenceScreen(); go('consequence'); }
    else if (sc === 'scoreboard')                        { buildScoreboard(); go('scoreboard'); }
    else if (sc === 'final')                             { buildFinal(); go('final'); }
    else { clearState(); return false; }
    return true;
  } catch(e) {
    clearState();
    return false;
  }
}


// ═══════════════════════════════════════════════════════
//  MULTIPLAYER — HOST
// ═══════════════════════════════════════════════════════

function attachHostLobbyListener() {
  const btn = document.getElementById('hl-start-btn');
  btn.disabled = true; btn.style.opacity = '.4'; btn.style.cursor = 'not-allowed';
  document.getElementById('hl-waiting').textContent = 'Waiting for players to join...';
  document.getElementById('hl-player-list').innerHTML = '';
  MP.gameRef.child('players').off();
  MP.gameRef.child('players').on('value', snap => {
    const arr = Object.entries(snap.val() || {}).filter(([, p]) => p && p.name);
    document.getElementById('hl-player-list').innerHTML = arr.map(([, p]) =>
      '<div class="mp-player-chip"><div class="mp-chip-dot" style="background:' + p.color + '"></div>'
      + '<span class="mp-chip-name">' + p.name + '</span></div>'
    ).join('');
    const n = arr.length;
    document.getElementById('hl-waiting').textContent = n === 0
      ? 'Waiting for players to join...'
      : n + ' player' + (n > 1 ? 's' : '') + ' in the room';
    btn.disabled = n === 0;
    btn.style.opacity = n > 0 ? '1' : '.4';
    btn.style.cursor = n > 0 ? 'pointer' : 'not-allowed';
  });
}

function goMultiplayer() {
  if (MP.gameRef) MP.gameRef.off();
  MP.active = true; MP.isHost = true;
  MP.roomCode = generateRoomCode();
  MP.gameRef = db.ref('games/' + MP.roomCode);
  localStorage.setItem('lc_mp_role', 'host');
  localStorage.setItem('lc_mp_room', MP.roomCode);
  document.getElementById('hl-code').textContent = MP.roomCode;
  document.getElementById('hl-player-list').innerHTML = '';
  document.getElementById('hl-waiting').textContent = 'Creating room...';
  go('host-lobby');
  // Wipe any stale room first (in case of code collision), then create fresh, then attach listener
  MP.gameRef.remove()
    .then(() => MP.gameRef.set({ status: 'lobby', createdAt: Date.now() }))
    .then(() => attachHostLobbyListener());
}

function startMultiplayerGame() { go('mode-select'); }

function cancelHostRoom() {
  if (MP.gameRef) { MP.gameRef.off(); MP.gameRef.remove(); }
  resetMP();
  go('splash');
}

function listenHostAnswers() {
  MP.gameRef.child('roundChoices').off();
  MP.gameRef.child('roundChoices').on('value', snap => {
    const answered = Object.keys(snap.val() || {}).length;
    const total = S.players.length;
    const counter = document.getElementById('mp-answer-counter');
    if (counter) counter.textContent = answered + ' / ' + total;
    const btn = document.getElementById('mp-reveal-btn');
    if (btn) {
      const canReveal = answered > 0;
      btn.disabled = !canReveal;
      btn.style.opacity = canReveal ? '1' : '.4';
      btn.style.cursor = canReveal ? 'pointer' : 'not-allowed';
      btn.textContent = answered >= total
        ? 'Reveal all choices →'
        : 'Reveal (' + answered + '/' + total + ' answered) →';
    }
  });
}

function hostReveal() {
  clearGameTimer();
  MP.gameRef.child('roundChoices').once('value', rcSnap => {
    MP.gameRef.child('players').once('value', playerSnap => {
      const roundChoices = rcSnap.val() || {};
      const fbPlayers = playerSnap.val() || {};
      S.players.forEach(p => {
        if (!p.fbId || !fbPlayers[p.fbId]) return;
        const fp = fbPlayers[p.fbId];
        if (fp.scores) p.scores = fp.scores;
        if (fp.choices) Object.entries(fp.choices).forEach(([i, c]) => { p.choices[parseInt(i)] = c; });
      });
      S.roundChoices = Object.entries(roundChoices).map(([pid, choiceIdx]) => {
        const playerIdx = S.players.findIndex(p => p.fbId === pid);
        return playerIdx >= 0 ? { playerIdx, choiceIdx } : null;
      }).filter(Boolean);
      mpSyncStatus('revealing');
      buildRevealScreen();
      go('reveal');
    });
  });
}

function mpClearRound(nextStep, newStatus) {
  // Write step + status + roundChoices clear + answered resets in ONE atomic update
  // so the player listener never fires with a stale step/status combination
  if (!MP.active || !MP.isHost || !MP.gameRef) return;
  MP.gameRef.child('players').once('value', snap => {
    const updates = {
      roundChoices: null,
      step: nextStep,
      status: newStatus
    };
    Object.keys(snap.val() || {}).forEach(id => { updates['players/' + id + '/answered'] = false; });
    MP.gameRef.update(updates);
  });
}

// ═══════════════════════════════════════════════════════
//  MULTIPLAYER — PLAYER
// ═══════════════════════════════════════════════════════

function goJoin() {
  document.getElementById('join-code-input').value = '';
  document.getElementById('join-name-input').value = '';
  document.getElementById('join-error').style.display = 'none';
  go('join-screen');
}

function validateJoin() {
  const code = document.getElementById('join-code-input').value.trim();
  const name = document.getElementById('join-name-input').value.trim();
  const ok = code.length >= 4 && name.length > 0;
  const btn = document.getElementById('join-btn');
  btn.disabled = !ok;
  btn.style.opacity = ok ? '1' : '.4';
  btn.style.cursor = ok ? 'pointer' : 'not-allowed';
}

function joinRoom() {
  if (MP.joining) return;
  const code = document.getElementById('join-code-input').value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const name = document.getElementById('join-name-input').value.trim();
  if (!code || !name) { showJoinError('Please enter the room code and your name.'); return; }
  if (code.length < 4) { showJoinError('Room code looks too short. Check again.'); return; }
  document.getElementById('join-error').style.display = 'none';
  MP.joining = true;
  const joinBtn = document.getElementById('join-btn');
  joinBtn.disabled = true; joinBtn.style.opacity = '.5'; joinBtn.style.cursor = 'wait';
  joinBtn.textContent = 'Connecting...';
  const finish = () => {
    MP.joining = false;
    joinBtn.disabled = false; joinBtn.style.opacity = '1'; joinBtn.style.cursor = 'pointer';
    joinBtn.textContent = 'Join Game →';
  };
  const timeoutId = setTimeout(() => {
    showJoinError('Connection timed out. Check your internet and try again.');
    finish();
  }, 8000);
  db.ref('games/' + code).once('value').then(snap => {
    clearTimeout(timeoutId);
    if (!snap.exists()) { showJoinError('Room not found. Check the code.'); finish(); return; }
    const game = snap.val();
    if (game.status !== 'lobby') { showJoinError('This game has already started.'); finish(); return; }
    const existingCount = game.players ? Object.keys(game.players).length : 0;
    const color = COLORS[existingCount % COLORS.length];
    const playerId = 'p' + Date.now().toString(36);
    MP.playerId = playerId; MP.playerName = name;
    MP.playerColor = color; MP.roomCode = code;
    MP.isHost = false; MP.active = true;
    MP.gameRef = db.ref('games/' + code);
    localStorage.setItem('lc_mp_role', 'player');
    localStorage.setItem('lc_mp_room', code);
    localStorage.setItem('lc_mp_player_id', playerId);
    localStorage.setItem('lc_mp_player_name', name);
    MP.gameRef.child('players/' + playerId).set({
      name, color, scores: { T:0, P:0, E:0, A:0 }, choices: {}, answered: false
    }).then(() => {
      showPlayerWait("You're in!", 'Waiting for the host to start...');
      listenAsPlayer();
      finish();
    }).catch(err => { showJoinError('Write failed. Try again.'); finish(); });
  }).catch(() => { clearTimeout(timeoutId); showJoinError('Could not connect. Check your internet.'); finish(); });
}

function leaveGame() {
  if (MP.gameRef && MP.playerId && !MP.isHost) {
    MP.gameRef.child('players/' + MP.playerId).remove();
    MP.gameRef.child('roundChoices/' + MP.playerId).remove();
  }
  resetMP();
  go('splash');
}

function showJoinError(msg) {
  const el = document.getElementById('join-error');
  el.textContent = msg; el.style.display = 'block';
}

function listenAsPlayer() {
  MP.gameRef.on('value', snap => {
    if (!snap.exists()) { showPlayerWait('Room ended', 'The host has ended the session.'); return; }
    const game = snap.val();
    const status = game.status;
    MP.step = game.step || 0;
    MP.scenarioOrder = fbArr(game.scenarioOrder);
    if      (status === 'lobby')       { showPlayerWait('Waiting...', 'The host will start the game soon.'); }
    else if (status === 'playing') {
      const myPlayer = game.players && game.players[MP.playerId];
      if (myPlayer && myPlayer.answered) { showPlayerWait('Locked in ✓', 'Waiting for others to answer...'); }
      else { renderPlayerGameScreen(); }
    }
    else if (status === 'revealing')   { showPlayerWait('Results are in! 🎭', "The host is showing everyone's choices."); }
    else if (status === 'discussing')  { showPlayerWait('Discussion time 💬', 'Talk through the scenario with your group.'); }
    else if (status === 'consequence') { showPlayerWait('Outcome ⚡', 'The host is showing what happened.'); }
    else if (status === 'scoreboard')  { showPlayerWait('Scoreboard 📊', 'Check the screen to see live standings.'); }
    else if (status === 'final')       { showPlayerWait('Game complete! 🎉', 'Check the screen for your leadership profile.'); }
    else if (status === 'ended')       { showPlayerWait('Session ended', 'The host has ended the game.'); resetMP(); }
  });
}

function showPlayerWait(heading, sub) {
  document.getElementById('pw-heading').textContent = heading;
  document.getElementById('pw-sub').textContent = sub;
  document.getElementById('pw-room-code').textContent = 'Room: ' + (MP.roomCode || '');
  go('player-wait');
}

function renderPlayerGameScreen() {
  const scIdx = MP.scenarioOrder[MP.step];
  const scenario = SCENARIOS[scIdx];
  const total = MP.scenarioOrder.length;
  document.getElementById('pg-label').textContent = 'Scenario ' + (MP.step + 1) + ' of ' + total;
  document.getElementById('pg-prog-fill').style.width = ((MP.step / total) * 100) + '%';
  const badge = document.getElementById('pg-player-name');
  badge.textContent = MP.playerName;
  badge.style.color = MP.playerColor;
  badge.style.borderColor = MP.playerColor + '60';
  badge.style.background = MP.playerColor + '18';
  document.getElementById('player-game-body').innerHTML =
    '<h2 class="s-heading">' + scenario.title + '</h2>'
    + '<div class="s-box">' + scenario.situation + '</div>'
    + '<div class="choices-label">What would you do?</div>'
    + scenario.choices.map((c, i) =>
      '<button class="c-btn" onclick="submitPlayerAnswer(' + i + ')">'
      + '<div class="c-alpha">' + c.letter + '</div>'
      + '<div class="c-text">' + c.text + '</div>'
      + '</button>'
    ).join('');
  go('player-game');
}

function submitPlayerAnswer(choiceIdx) {
  if (MP.submitting) return; // guard against double-tap
  MP.submitting = true;
  const scIdx = MP.scenarioOrder[MP.step];
  const choice = SCENARIOS[scIdx].choices[choiceIdx];
  document.querySelectorAll('#player-game-body .c-btn').forEach((el, i) => {
    el.disabled = true;
    el.classList.add(i === choiceIdx ? 'sel' : 'dim');
  });
  const playerRef = MP.gameRef.child('players/' + MP.playerId);
  playerRef.once('value', snap => {
    const p = snap.val() || {};
    const scores = p.scores || { T:0, P:0, E:0, A:0 };
    const choices = p.choices || {};
    DIMS.forEach(d => { scores[d] = (scores[d] || 0) + (choice.scores[d] || 0); });
    choices[scIdx] = choiceIdx;
    playerRef.update({ scores, choices, answered: true }).then(() => {
      MP.gameRef.child('roundChoices/' + MP.playerId).set(choiceIdx);
      MP.submitting = false;
    });
  });
}

// ═══════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════

// Pre-init tutorial dots
renderTutSlide();

// Auto-restore game on page load if a saved game exists
restoreGame();

// Reconnect host to multiplayer session on refresh — return to lobby and re-attach listeners
(function() {
  if (localStorage.getItem('lc_mp_role') !== 'host') return;
  const code = localStorage.getItem('lc_mp_room');
  if (!code) { localStorage.removeItem('lc_mp_role'); return; }
  MP.active = true; MP.isHost = true; MP.roomCode = code;
  MP.gameRef = db.ref('games/' + code);
  MP.gameRef.once('value', snap => {
    if (!snap.exists()) { resetMP(); go('splash'); return; }
    MP.gameRef.update({ status: 'lobby', step: null, scenarioOrder: null, mode: null, MAX: null, roundChoices: null });
    const players = snap.val().players || {};
    const updates = {};
    Object.keys(players).forEach(pid => { updates['players/' + pid + '/answered'] = false; });
    if (Object.keys(updates).length) MP.gameRef.update(updates);
    document.getElementById('hl-code').textContent = MP.roomCode;
    attachHostLobbyListener();
    go('host-lobby');
  });
})();

// Reconnect player to multiplayer session on refresh
(function() {
  if (localStorage.getItem('lc_mp_role') !== 'player') return;
  const code = localStorage.getItem('lc_mp_room');
  const playerId = localStorage.getItem('lc_mp_player_id');
  const name = localStorage.getItem('lc_mp_player_name');
  if (!code || !playerId || !name) { localStorage.removeItem('lc_mp_role'); return; }
  MP.playerId = playerId; MP.playerName = name;
  MP.roomCode = code; MP.isHost = false; MP.active = true;
  MP.gameRef = db.ref('games/' + code);
  MP.gameRef.once('value', snap => {
    if (!snap.exists()) { resetMP(); go('splash'); return; }
    const game = snap.val();
    const myPlayer = game.players && game.players[playerId];
    if (!myPlayer) { resetMP(); go('splash'); return; }
    MP.playerColor = myPlayer.color;
    listenAsPlayer();
  });
})();

