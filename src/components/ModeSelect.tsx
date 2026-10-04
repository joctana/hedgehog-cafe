interface ModeSelectProps {
  onPickCafe: () => void
  onPickTransformers: () => void
  onPickFlight: () => void
  onPickF1: () => void
  onPickBluey: () => void
  onPickCapy: () => void
  onPickDiver: () => void
  onPickChess: () => void
  onPickGym: () => void
  onPickCapyCafe: () => void
  onPickFishing: () => void
  onPickSpider: () => void
  onPickCop: () => void
  onPickSoldier: () => void
  onPickTowers: () => void
}

type GameCard = {
  className: string
  emoji: string
  name: string
  blurb: string
  onPick: () => void
}

export function ModeSelect({
  onPickCafe,
  onPickTransformers,
  onPickFlight,
  onPickF1,
  onPickBluey,
  onPickCapy,
  onPickDiver,
  onPickChess,
  onPickGym,
  onPickCapyCafe,
  onPickFishing,
  onPickSpider,
  onPickCop,
  onPickSoldier,
  onPickTowers,
}: ModeSelectProps) {
  // Oldest first; add new games at the end. The picker shows them newest first.
  const games: GameCard[] = [
    { className: 'cafe', emoji: '🦔', name: 'Hedgehog Café', blurb: 'Feed, clean, and tuck in friends', onPick: onPickCafe },
    {
      className: 'transformers',
      emoji: '🤖',
      name: 'Transformers',
      blurb: 'Optimus Prime battles Decepticons',
      onPick: onPickTransformers,
    },
    { className: 'flight', emoji: '✈️', name: 'Sky Trip', blurb: 'AirAsia A320 · Phuket to Bali', onPick: onPickFlight },
    { className: 'f1', emoji: '🏎️', name: 'F1 Race', blurb: 'Sonny, Josh, Lewis, Max & Lachlan', onPick: onPickF1 },
    { className: 'bluey', emoji: '💈', name: 'Bluey Barber', blurb: 'Give Bluey & friends a haircut', onPick: onPickBluey },
    {
      className: 'capy',
      emoji: '🦺',
      name: 'Capy Construction',
      blurb: 'Carlos digs & dumps with kindness',
      onPick: onPickCapy,
    },
    {
      className: 'diver',
      emoji: '🤿',
      name: 'Carlos: Deep Sea Diver',
      blurb: 'Explore the reef & find treasure',
      onPick: onPickDiver,
    },
    {
      className: 'chess',
      emoji: '♟️',
      name: 'Chess with Carlos',
      blurb: 'Learn the pieces & play your coach',
      onPick: onPickChess,
    },
    { className: 'gym', emoji: '💪', name: 'Capybara Gym', blurb: 'Workout and get bigger', onPick: onPickGym },
    {
      className: 'capycafe',
      emoji: '🍊',
      name: 'Capybara Cafe',
      blurb: 'Cook meals for hungry friends',
      onPick: onPickCapyCafe,
    },
    { className: 'fishing', emoji: '🎣', name: 'Capy Fishing', blurb: 'Catch, cook, and eat the fish', onPick: onPickFishing },
    {
      className: 'spider',
      emoji: '🕸️',
      name: 'Capybara Spiderman',
      blurb: 'Suit up, then catch the bad guys',
      onPick: onPickSpider,
    },
    {
      className: 'cop',
      emoji: '🚓',
      name: 'Capybara Cop',
      blurb: 'Get dressed, then ticket speeders',
      onPick: onPickCop,
    },
    {
      className: 'soldier',
      emoji: '🪖',
      name: 'Capybara Soldier',
      blurb: 'Gear up, then pew paper targets',
      onPick: onPickSoldier,
    },
    {
      className: 'towers',
      emoji: '🧱',
      name: 'Capybara Towers',
      blurb: 'Stack higher, then fire the cannon',
      onPick: onPickTowers,
    },
  ]

  return (
    <section className="scene mode-select" aria-label="Choose a game">
      <header className="brand-block mode-brand">
        <h1>Play Time</h1>
        <p>Pick a game!</p>
      </header>

      <div className="mode-choices">
        {[...games].reverse().map((game) => (
          <button key={game.className} type="button" className={`mode-card ${game.className}`} onClick={game.onPick}>
            <span className="mode-emoji" aria-hidden="true">
              {game.emoji}
            </span>
            <span className="mode-name">{game.name}</span>
            <span className="mode-blurb">{game.blurb}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
