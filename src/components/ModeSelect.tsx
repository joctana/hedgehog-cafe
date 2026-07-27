interface ModeSelectProps {
  onPickCafe: () => void
  onPickTransformers: () => void
}

export function ModeSelect({ onPickCafe, onPickTransformers }: ModeSelectProps) {
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
      </div>
    </section>
  )
}
