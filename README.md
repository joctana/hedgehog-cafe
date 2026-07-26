# Hedgehog Café

A cute, touch-first hedgehog café care game for little hands — made to play on an iPad.

Tap a hedgehog friend, then feed, pet, brush, give a drink, or tuck them in for a nap. There are no fail states, timers, ads, or accounts — just cozy care and happy sparkles.

## Play on iPad

1. Open the game URL in **Safari** (not Chrome).
2. Tap the **Share** button.
3. Tap **Add to Home Screen**.
4. Open **Hedgehog Café** from the home screen for a fullscreen app-like experience.

Parent tip: the in-game banner also explains this once, then can be dismissed.

## Play locally

```bash
npm install
npm run dev
```

Then open the local URL on your iPad (same Wi‑Fi), or use a desktop browser with touch/dev tools.

## Build

```bash
npm run build
npm run preview
```

The production files land in `dist/`. Deploy that folder to any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.).

### GitHub Pages (auto-deploy on merge)

Merging a PR into `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the app and publishes it to GitHub Pages.

**One-time setup** (repo admin):

1. Open the repo on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Merge this PR (or any PR) into `main`.
4. After the workflow finishes, the game is live at  
   `https://joctana.github.io/hedgehog-cafe/`
5. Open that URL on the iPad and Add to Home Screen.

## How to play

1. On the café screen, tap **Momo**, **Sora**, **Yuzu**, or **Kiko**.
2. Use the big care tools:
   - **Feed** — open snack time, then drag apple/berries/treats to their mouth
   - **Water** — tap to give a drink
   - **Hand** — stroke across the hedgehog to pet
   - **Clean** — bath time! drag the sponge over dirt spots until sparkly
   - **Sleep** — bedtime! pull the blanket up as the room turns night
3. Stars fill as they get happier. Unlock tiny decorations (bow, hat, pillow).
4. When all five stars light up, enjoy a little celebration!

## Tech

- Vite + React + TypeScript
- SVG hedgehogs and CSS animations
- Web Audio soft sound effects (mute toggle in the corner)
- PWA manifest + Apple web-app meta for home-screen install
