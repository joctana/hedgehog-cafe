# Hedgehog Café

A cute, touch-first play app for little hands — made for iPad.

Pick a game on the home screen:

- **Hedgehog Café** — feed, clean, and tuck in hedgehog friends
- **Transformers** — help Optimus Prime blast Decepticons in a simple battle mini-game
- **Sky Trip** — fly a blue airplane from Phuket, Thailand to Denpasar, Bali
- **F1 Race** — pick a driver from *F1 The Movie* (including Lachlan!) and race for P1
- **Bluey Barber** — pick Bluey, Bingo, Bandit, Chilli, or Muffin and give them a haircut
- **Capy Construction** — Carlos the capybara digs and dumps sand with kindness
- **Carlos: Deep Sea Diver** — explore a colorful reef and collect underwater treasure
- **Chess with Carlos** — learn how every piece moves, then play a gentle coached match
- **Capybara Gym** — tap workouts and watch Carlos & friends get bigger and bigger
- **Capybara Cafe** — cook meals you can watch being washed, chopped, cooked, and plated, then serve them to hungry capybaras
- **Capy Fishing** — help Carlos catch fish, cook them, and eat them
- **Capybara Spiderman** — Carlos starts as a normal capybara, suits up, then shoots webs at silly bad guys
- **Capybara Cop** — dress Carlos in his uniform and hat, then patrol, write tickets, or send speeders to a short timeout
- **Capybara Soldier** — dress Carlos in uniform and gear, pew paper targets, then night-vision goggles for more paper targets
- **Capybara Towers** — stack blocks faster than Coco, then set explosives that pop both towers

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
Choose **Hedgehog Café**, **Transformers**, **Sky Trip**, **F1 Race**, **Bluey Barber**, **Capy Construction**, **Carlos: Deep Sea Diver**, **Chess with Carlos**, **Capybara Gym**, **Capybara Cafe**, **Capy Fishing**, **Capybara Spiderman**, **Capybara Cop**, **Capybara Soldier**, or **Capybara Towers**. The newest games are shown first.

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

### Carlos: Deep Sea Diver
1. Tap **Let's dive!** to enter the colorful reef.
2. Tap shells, starfish, coral, and other treasures—Carlos swims to collect them.
3. Tap floating bubbles to top up Carlos's air.
4. Find all six treasures to become a **Deep-sea superstar!**

### Chess with Carlos
1. Choose **Learn the pieces** for six guided movement puzzles: pawn, rook, bishop, knight, queen, and king.
2. Tap a piece to see every legal destination as a bright dot.
3. Choose **Play Carlos** for a real first match as White against a gentle opponent.
4. Tap **Show me a move** for a coach hint, or **Try again** to undo Carlos's last turn.
5. Carlos explains moves, check, checkmate, and draws with encouraging language.

### Capybara Gym
1. Pick **Carlos**, **Coco**, **Pip**, or **Nugget**.
2. Tap **Lift**, **Jump**, **Run**, or **Flex**.
3. Each workout makes them bigger.
4. Fill the size bar to become a gym star!

### Capybara Cafe
1. Tap a hungry friend (Coco, Pip, Nugget, or Bean) to take the order shown in their thought bubble.
2. Follow the glowing kitchen step: **Wash**, **Chop**, **Cook**, then **Plate**.
3. Watch the food change on Chef Carlos's counter — whole fruit gets rinsed and sparkly, chopped on the board, bubbles in the pot with steam, then lands in a bowl, on a plate, or in a cup.
4. Tap **Serve!** on that friend’s table; the plate lands in front of them and empties bite by bite.
5. Serve five meals to fill the cafe with happy munching capybaras.

### Capy Fishing
1. Tap the fish swimming in the river. Carlos scoops them into a bucket.
2. Catch four fish, then help him cook: **Clean**, **Grill**, and **Plate**.
3. Tap **Eat** and take bites until the plate is empty.
4. Carlos finishes full and happy. Tap **Fish again** to start over.

### Capybara Spiderman
1. Carlos starts as a normal capybara on the rooftop, with bad guys already bouncing around.
2. Tap **Suit up!** — he spins and changes into the red web-suit.
3. Tap a bouncing bad guy. A web shoots from his wrist and wraps them up.
4. Tap the sky and a web still flies — it just does not count.
5. Wrap five troublemakers to save the city. They get tangled, not hurt.

### Capybara Cop
1. Carlos starts as a normal capybara at the station locker.
2. Tap **Uniform** and **Hat** (either order) so he is ready for work.
3. Tap a car that is speeding by to pull it over. The lights flash.
4. Choose **Ticket** for a speeding ticket, or **Jail** for a short, friendly timeout at the town jail.
5. Help four drivers. Either choice counts. There is no way to lose.

### Capybara Soldier
1. Carlos starts as a normal capybara at the target range.
2. Tap **Uniform** and **Gear** (either order) so he is ready.
3. Tap the paper targets. Each one gets a star. They are only paper.
4. After four daytime targets, the sky turns to night.
5. Tap **Night goggles**. The range turns green, then tap four more paper targets.
6. There is no way to lose. Nobody gets hurt.

### Capybara Towers
1. You and Coco each build a block tower.
2. Tap **Stack a block**. Coco adds blocks on her own, then stops.
3. When your tower is at least four blocks and taller than Coco’s, tap **Set explosives**. Cartoon charges appear at the bottom of both towers.
4. Tap **Boom!** Both towers tumble. You win.
5. If she gets ahead, keep stacking. There is no way to lose.

## Tech

- Vite + React + TypeScript
- SVG characters and CSS animations
- Web Audio soft sound effects (mute toggle in the corner)
- Speech synthesis for F1 race callouts
- PWA manifest + Apple web-app meta for home-screen install
