import { useEffect, useState } from 'react'
import { CafeScene } from './components/CafeScene'
import { CareScene } from './components/CareScene'
import { useHedgehogCare } from './hooks/useHedgehogCare'
import { useSounds } from './hooks/useSounds'

const TIP_KEY = 'hedgehog-cafe-tip-dismissed'

export default function App() {
  const care = useHedgehogCare()
  const [muted, setMuted] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const { play } = useSounds(muted)

  useEffect(() => {
    const dismissed = localStorage.getItem(TIP_KEY)
    if (!dismissed) setShowTip(true)
  }, [])

  const dismissTip = () => {
    localStorage.setItem(TIP_KEY, '1')
    setShowTip(false)
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <button
          type="button"
          className="icon-btn"
          aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
          onClick={() => setMuted((current) => !current)}
        >
          <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
        </button>
      </div>

      {!care.selected ? (
        <CafeScene
          states={care.states}
          onSelect={(id) => {
            play('tap')
            care.selectHedgehog(id)
          }}
        />
      ) : (
        <CareScene
          profile={care.selected}
          happiness={care.selectedState?.happiness ?? 0}
          doneActions={care.selectedState?.doneActions ?? []}
          unlockedDecor={care.selectedState?.unlockedDecor ?? []}
          activeDecor={care.selectedState?.activeDecor ?? null}
          anim={care.anim}
          heartBurst={care.heartBurst}
          celebrating={care.celebrating}
          onBack={() => {
            play('tap')
            care.goHome()
          }}
          onCare={care.applyCare}
          onDecor={(decor) => {
            play('tap')
            care.setActiveDecor(decor)
          }}
          onDismissCelebration={() => {
            play('celebrate')
            care.dismissCelebration()
          }}
          playSound={play}
        />
      )}

      {showTip && !care.selected && (
        <div className="parent-tip" role="status">
          <span>
            Parent tip: on iPad Safari, tap Share → <strong>Add to Home Screen</strong> for a
            fullscreen app.
          </span>
          <button type="button" aria-label="Dismiss tip" onClick={dismissTip}>
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
