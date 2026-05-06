# The Leadership Challenge
### HLE / Alaya · 2026

A multiplayer pass-and-play leadership simulation game. Players face 12 real workplace scenarios and make decisions. Their choices are measured across four leadership signals (Trust, Proactivity, Empowerment, Adaptability) and matched to one of 17 leadership profiles at the end.

---

## What the App Does

- **12 scenarios** drawn from real HLE/Alaya leader conversations — each with 3 choices (A/B/C)
- **3 game modes**: Quick Round (5 scenarios ~20min), Full Game (8 scenarios ~35min), Deep Dive (12 scenarios ~55min)
- **17 leadership profiles** with cascade matching logic based on signal percentages
- **Pass-and-play multiplayer**: one device passed around, each player picks privately
- **Discuss screen**: 2:30 timer + discussion prompts after each reveal
- **Share functionality**: share outcome or final results via WhatsApp, copy text, or Word doc download
- **Responsive layout**: works on mobile phone, tablet, 13–14" laptop, and 27" monitor
- **No backend required**: fully self-contained, runs from a single HTML file

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML + CSS + JavaScript (no framework) |
| Fonts | Bricolage Grotesque (headings) + Plus Jakarta Sans (body) via Google Fonts |
| Backend | None — all state in memory (JS variables) |
| Hosting option | GitHub Pages (3-file version) or local file (standalone) |
| Build tool | None — plain files |

---

## File Structure

```
leadership-challenge/
├── index.html                          # HTML + CSS only (for GitHub Pages)
├── data.js                             # All game data (load before script.js)
├── script.js                           # All game logic
└── leadership-challenge-standalone.html  # Single merged file (all JS inlined)
```

---

## Setup

### Option A — Local (no server needed)
Open `leadership-challenge-standalone.html` directly in any browser.
All scripts are inlined — no external dependencies except Google Fonts (requires internet for fonts).

### Option B — GitHub Pages (3-file version)
1. Create a GitHub repo
2. Upload `index.html`, `data.js`, `script.js` to the same folder
3. Enable GitHub Pages in repo Settings → Pages → source: main branch
4. Access at `https://yourusername.github.io/reponame/`

**Important:** `index.html` must load scripts in this order:
```html
<script src="data.js"></script>
<script src="script.js"></script>
```
`data.js` must load first as `script.js` depends on its global variables.

---

## Key Architecture Notes

### Data flow
- `data.js` declares all game data as `var` (not `const`) so variables are globally accessible across script tags
- `script.js` reads from these globals and manages all state via the `S` object
- `S.MAX` is set at game start by `getMaxForScenarios(S.scenarioOrder)` — this is the per-mode max used for all percentage calculations

### Scenario selection (per mode)
- **Quick (5)**: Fixed set `[0,7,2,5,9]` shuffled — T=9/P=9/E=9/A=10 max, all 4 signals guaranteed
- **Full (8)**: Fixed set `[0,3,7,10,2,4,5,8]` shuffled — all 8 key scenarios, both per signal
- **Deep (12)**: All 12 shuffled randomly

### Profile cascade order (first match wins)
1. Visionary (all 4 signals ≥ 65%)
2. Dual-spike profiles (Cornerstone, Catalyst, Enabler, Driver, Pathfinder, Architect)
3. Single-spike profiles (Protector, Lookout, Builder, Compass)
4. Rising Leader
5. Firefighter (avg ≤ 44%)
6. Steady Hand — Trust/Proactivity/Empowerment/Adaptability variants

### Score normalisation
All percentages calculated as `player_score / S.MAX[signal] × 100%` where `S.MAX` is the actual maximum possible for the scenarios played in that game. This ensures Quick, Full, and Deep Dive profiles are all comparable.

### Share modal
The share modal has a `data-mode` attribute set to `'outcome'` when opened from the outcome page share button, or unset when opened from the final results page. `copyShareText()`, `shareWhatsApp()`, and `downloadWord()` all check this attribute to decide which content to generate.

---

## Signal Max Scores

| Signal | Quick (5 scenarios) | Full (8 scenarios) | Deep Dive (12 scenarios) |
|---|---|---|---|
| 🛡️ Trust | 9 | 13 | 21 |
| 👁️ Proactivity | 9 | 15 | 23 |
| 🎯 Empowerment | 9 | 15 | 19 |
| 🔄 Adaptability | 10 | 15 | 21 |

---

## Known Limitations

- No persistent storage — refreshing the page resets the game
- Share via WhatsApp opens `wa.me` which requires WhatsApp installed
- Word doc download uses `.doc` format (HTML-wrapped) for broad compatibility — not true `.docx`
- Google Fonts require internet connection; app works offline but with fallback fonts

---

## Planned / Future Features

- Firebase Realtime Database integration for each player on their own device (no pass-and-play)
- QR code room join
- Session history / results storage
- EO-branded version (HLE branding removed)
