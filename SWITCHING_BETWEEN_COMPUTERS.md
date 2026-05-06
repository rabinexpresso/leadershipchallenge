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
- **Cache-bust version:** `?v=14` (bump this in `index.html` whenever script changes)

### Multiplayer architecture
- Host creates room via "Host Multiplayer" → generates code (e.g. `WOLF7`) → projects on TV
- Players open same URL → "Join a Game" → enter code + name on phone
- Firebase paths: `games/{code}/{status, step, scenarioOrder, mode, MAX, players, roundChoices}`
- Status flow: `lobby → playing → revealing → discussing → consequence → scoreboard → final | ended`
- localStorage keys: `lc_mp_role`, `lc_mp_room`, `lc_mp_player_id`, `lc_mp_player_name`

---

## Last session: 2026-05-07 (MacBook)

### Done
- Fixed Host Multiplayer button (was opening tutorial due to old boot code)
- Made join button always-tappable on mobile (removed brittle `oninput` gate)
- Added Firebase connection timeout + cache-busting `?v=N` on script tags
- Added "← Leave Game" button on player-wait screen
- Stale-room reconnect now sends player to splash instead of hung waiting screen
- Host reconnect on refresh — restores to lobby with same room code
- Discuss screen now shows scenario situation + each player's choice + options nobody picked
- Fixed duplicate/undefined player rows (stacked listeners)
- Prevented double-click ghost players (`MP.joining` guard + button disable)
- Wiped stale room data on host create (room code collisions were showing old players)

### Next up
- [ ] Re-test full multiplayer flow end-to-end after all the recent fixes
- [ ] Mobile Safari sometimes still needs full cache clear — verify `?v=14` reaches it
- [ ] **Firebase security rules expire ~June 5 2026** — need real rules before then (currently `read:true, write:true`)
- [ ] Consider expanding room code space (currently only 135 combos: 15 words × 9 digits)
- [ ] Optional: detect host disconnect via Firebase `onDisconnect()` and notify players gracefully
- [ ] Optional: full mid-game reconnect for host (currently resets to lobby on refresh)

### Known limitations
- Mobile Safari caches aggressively — `?v=N` cache-bust helps but sometimes needs Settings → Safari → Clear History
- Mid-game host refresh resets to lobby (loses round progress, players in same room)
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
