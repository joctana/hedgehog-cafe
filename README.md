# Hedgehog Café

A cute, touch-first play app for little hands — made for iPad.

Pick a game on the home screen:

- **Hedgehog Café** — feed, clean, and tuck in hedgehog friends
- **Transformers** — help Optimus Prime blast Decepticons in a simple battle mini-game
- **Sky Trip** — fly a blue airplane from Phuket, Thailand to Denpasar, Bali

There are no fail states, timers, ads, or accounts.

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

### Home
Choose **Hedgehog Café**, **Transformers**, or **Sky Trip**.

### Hedgehog Café
1. Tap **Momo**, **Sora**, **Yuzu**, or **Kiko**.
2. Use the big care tools:
   - **Feed** — snack time; drag foods to their mouth
   - **Water** — tap to give a drink
   - **Hand** — stroke across the hedgehog to pet
   - **Clean** — bath time; sponge away dirt spots
   - **Sleep** — pull the blanket up for bedtime
3. Stars fill as they get happier. Unlock tiny decorations (bow, hat, pillow).

### Transformers
1. Watch Optimus **roll in as a truck**, then tap **TRANSFORM!** to become a robot.
2. During battle, tap **Truck** / **Robot** anytime to change forms again.
3. In truck mode use **Ram**; in robot mode use **Punch**, **Laser**, and **Energon**.
4. Fill Energon pips with hits/dodges to unlock the big Energon smash.
5. When a Decepticon winds up, tap **DODGE!** for bonus stars.
6. Win the war and Optimus rolls out as a truck!

### Sky Trip
1. Tap **Take off!** in Phuket.
2. Steer with the big **↑ / ↓** buttons, or drag up and down on the sky.
3. Collect stars, clouds, and fish along the way.
4. Follow the route bar to **Denpasar, Bali** and land for a welcome celebration.

## Tech

- Vite + React + TypeScript
- SVG hedgehogs and CSS animations
- Web Audio soft sound effects (mute toggle in the corner)
- PWA manifest + Apple web-app meta for home-screen install
