interface ModeSelectProps {
  onPickCafe: () => void
  onPickTransformers: () => void
  onPickFlight: () => void
  onPickF1: () => void
  onPickBluey: () => void
  onPickCapy: () => void
  onPickDiver: () => void
  onPickChess: () => void
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
}: ModeSelectProps) {
  return (
    <section className="scene mode-select" aria-label="Choose a game">
      <header className="brand-block mode-brand">
        <h1>Play Time</h1>
        <p>Pick a game!</p>
      </header>

      <div className="mode-choices">
        <button type="button" className="mode-card cafe" onClick={onPickCafe}>
          <span className="mode-emoji" aria-hidden="true">
            🦔
          </span>
          <span className="mode-name">Hedgehog Café</span>
          <span className="mode-blurb">Feed, clean, and tuck in friends</span>
        </button>

        <button type="button" className="mode-card transformers" onClick={onPickTransformers}>
          <span className="mode-emoji" aria-hidden="true">
            🤖
          </span>
          <span className="mode-name">Transformers</span>
          <span className="mode-blurb">Optimus Prime battles Decepticons</span>
        </button>

        <button type="button" className="mode-card flight" onClick={onPickFlight}>
          <span className="mode-emoji" aria-hidden="true">
            ✈️
          </span>
          <span className="mode-name">Sky Trip</span>
          <span className="mode-blurb">AirAsia A320 · Phuket to Bali</span>
        </button>

        <button type="button" className="mode-card f1" onClick={onPickF1}>
          <span className="mode-emoji" aria-hidden="true">
            🏎️
          </span>
          <span className="mode-name">F1 Race</span>
          <span className="mode-blurb">Sonny, Josh, Lewis, Max & Lachlan</span>
        </button>

        <button type="button" className="mode-card bluey" onClick={onPickBluey}>
          <span className="mode-emoji" aria-hidden="true">
            💈
          </span>
          <span className="mode-name">Bluey Barber</span>
          <span className="mode-blurb">Give Bluey & friends a haircut</span>
        </button>

        <button type="button" className="mode-card capy" onClick={onPickCapy}>
          <span className="mode-emoji" aria-hidden="true">
            🦺
          </span>
          <span className="mode-name">Capy Construction</span>
          <span className="mode-blurb">Carlos digs & dumps with kindness</span>
        </button>

        <button type="button" className="mode-card diver" onClick={onPickDiver}>
          <span className="mode-emoji" aria-hidden="true">
            🤿
          </span>
          <span className="mode-name">Carlos: Deep Sea Diver</span>
          <span className="mode-blurb">Explore the reef & find treasure</span>
        </button>

        <button type="button" className="mode-card chess" onClick={onPickChess}>
          <span className="mode-emoji" aria-hidden="true">
            ♟️
          </span>
          <span className="mode-name">Chess with Carlos</span>
          <span className="mode-blurb">Learn the pieces & play your coach</span>
        </button>
      </div>
    </section>
  )
}
