# Hedgehog Café

A cute, touch-first play app for little hands — made for iPad.

Pick a game on the home screen:

- **Hedgehog Café** — feed, clean, and tuck in hedgehog friends
- **Transformers** — help Optimus Prime blast Decepticons in a simple battle mini-game
- **Sky Trip** — fly a blue airplane from Phuket, Thailand to Denpasar, Bali
- **F1 Race** — pick a driver from *F1 The Movie* (including Lachlan!) and race for P1
- **Bluey Barber** — pick Bluey, Bingo, Bandit, Chilli, or Muffin and give them a haircut
- **Capy Construction** — Carlos the capybara digs and dumps sand with kindness

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
Choose **Hedgehog Café**, **Transformers**, **Sky Trip**, **F1 Race**, **Bluey Barber**, or **Capy Construction**.

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
1. Tap **Take off!** — the A320 rolls down the Phuket runway; hold **↑** to climb.
2. Gear up for cruise: steer with **↑ / ↓** or drag the sky, and collect stars/clouds/fish.
3. Near Bali, landing starts — hold **↓** to descend to the Denpasar runway.
4. Touchdown celebration in Denpasar (takeoff/landing are assisted so kids always succeed).

### F1 Race
1. Choose a driver: **Sonny Hayes**, **Joshua Pearce**, **Lewis Hamilton**, **Max Verstappen**, or **Lachlan Beattie**.
2. Steer with **Left / Right** buttons, or tap **Enable tilt steer** and tip the iPad. Tap **DRS Boost** to take the lead.
3. When you hit P1, the race engineer calls: *“You're P1, you're P1, push, push, push!”*
4. Around mid-race, another car may crash — tap **Help!** and hold the **fire extinguisher**, or keep racing.
5. Cross the line to see: **We have the driver!**

Tilt steer uses the iPad motion sensors (Safari will ask for permission once). It recenters to how you’re holding the iPad when a race starts — tap **Recenter** anytime if steering feels off. Buttons always remain as a backup.

### Bluey Barber
1. Choose **Bluey**, **Bingo**, **Bandit**, **Chilli**, or **Muffin**.
2. Pick **Scissors** or **Clippers**.
3. Tap the glowing fluffy spots to snip — hair clippings fall away.
4. When every tuft is gone: **Looking gorgeous!**

### Capy Construction
1. Meet **Carlos** the hard-hat capybara — work with kindness!
2. Use the tabs to pick **Excavator** or **Dump truck**.
3. Excavator: **Dig** then **Pour**. Dump truck: **Get sand** then **Dump** (the truck drives for you).
4. Fill all three pads to finish.

## Tech

- Vite + React + TypeScript
- SVG characters and CSS animations
- Web Audio soft sound effects (mute toggle in the corner)
- Speech synthesis for F1 race callouts
- PWA manifest + Apple web-app meta for home-screen install
