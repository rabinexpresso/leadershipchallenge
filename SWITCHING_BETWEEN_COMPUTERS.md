# Switching Between Computers — handoff between MacBook & Windows PC

> Update this file at the **end of each session** before `git push`.
> Read it at the **start of each session** on the other machine.

---

## How to switch machines

**Before stopping work (any machine):**
```bash
git status      # confirm clean
git push        # send everything to GitHub
```
Update the "Last session" + "Next up" sections below first.

**Starting work (other machine):**
```bash
git pull
```
Then prime Claude Code with: *"Read SWITCHING_BETWEEN_COMPUTERS.md and the latest git log, then I'll tell you what's next."*

---

## Current state of the app

- **Live URL:** https://rabinexpresso.github.io/leadershipchallenge/
- **Repo:** https://github.com/rabinexpresso/leadershipchallenge
- **Hosting:** GitHub Pages (auto-deploys from `main`)
- **Backend:** Firebase Realtime Database (project `leadershipchallenge-1bc16`)
- **Files:** `index.html`, `data.js`, `script.js`, `README.md`, `SWITCHING_BETWEEN_COMPUTERS.md`
- **Cache-bust version:** `?v=23` (bump this in `index.html` whenever script changes)

### Multiplayer architecture
- Host creates room via "Host Multiplayer" → generates code (e.g. `WOLF7`) → projects on TV
- Players open same URL → "Join a Game" → enter code + name on phone
- Firebase paths: `games/{code}/{status, step, scenarioOrder, mode, MAX, players, roundChoices}`
- Status flow: `lobby → playing → revealing → discussing → consequence → scoreboard → final | ended`
- localStorage keys: `lc_mp_role`, `lc_mp_room`, `lc_mp_player_id`, `lc_mp_player_name`

---

## Last session: 2026-05-08 (MacBook)

### Done
- Removed mid-game scoreboard — scores now only shown in final leadership profile
- Added 2-minute countdown timer on question screen (auto-reveals on expiry for host)
- Added "Discussion Time" header + subtitle to discuss screen
- Removed pass-and-play mode entirely — multiplayer only now
- Fixed Back button on mode-select to return to host lobby (not add-players)
- Shrunk name input on join screen for better mobile fit
- Discuss screen: added full scenario text + unselected options ("Nobody picked")
- Fixed race condition causing score inflation (multiple Firebase writes now atomic)
- Tutorial updated to reflect multiplayer-only flow

### Content work done (NOT yet coded — see PENDING_WORK.md)
- Rewrote all 12 existing scenario situations and options in plain human language (scores unchanged)
- Brainstormed 3 new Alaya/HLE scenarios with scores:
  1. The Rookie Who Can't Seem to Get It Right (loan analyst training)
  2. The Manager Who Goes Sharp Under Pressure (Alaya Compass — aggression trap)
  3. The Two Accounts That Don't Match (conflicting referral stories)

### Next up
- [ ] **Read PENDING_WORK.md first** — all scenario content work is documented there
- [ ] Write outcome text for 3 new scenarios (9 paragraphs total)
- [ ] Rewrite existing 12 scenario text in data.js (plain human language)
- [ ] Add 3 new scenarios to data.js
- [ ] Decide which game modes the new scenarios appear in (Quick/Full/Deep)
- [ ] **Firebase security rules expire ~June 5 2026** — need proper rules before then
- [ ] Consider expanding room code space (135 combos is low for repeated sessions)

### Known limitations
- Mobile Safari sometimes needs full cache clear (Settings → Safari → Clear History)
- Mid-game host refresh resets to lobby (round progress lost)
- 135 possible room codes → collisions possible after ~12 sessions

---

## Useful debugging commands

```bash
# Verify deployed version has latest changes
curl -s https://rabinexpresso.github.io/leadershipchallenge/script.js | grep "function joinRoom"

# Check Firebase rules
# → Firebase Console → Realtime Database → Rules
# Must show: { "rules": { ".read": true, ".write": true } } and be Published

# Bump cache version (do this whenever you push script changes)
# Edit index.html: <script src="script.js?v=14"></script> → ?v=15
```
