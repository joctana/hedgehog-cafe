import { useEffect, useState } from 'react'
import { BlueyBarber } from './components/bluey/BlueyBarber'
import { CafeScene } from './components/CafeScene'
import { CareScene } from './components/CareScene'
import { CapyConstruction } from './components/capy/CapyConstruction'
import { F1Race } from './components/f1/F1Race'
import { FlightGame } from './components/flight/FlightGame'
import { ModeSelect } from './components/ModeSelect'
import { TransformersBattle } from './components/transformers/TransformersBattle'
import { useHedgehogCare } from './hooks/useHedgehogCare'
import { useSounds } from './hooks/useSounds'

const TIP_KEY = 'hedgehog-cafe-tip-dismissed'

type AppMode = 'home' | 'cafe' | 'transformers' | 'flight' | 'f1' | 'bluey' | 'capy'

export default function App() {
  const care = useHedgehogCare()
  const [mode, setMode] = useState<AppMode>('home')
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

  const goHome = () => {
    care.goHome()
    setMode('home')
  }

  return (
    <div
      className={`app-shell ${mode === 'transformers' ? 'tf-shell' : ''} ${mode === 'flight' ? 'flight-shell' : ''} ${mode === 'f1' ? 'f1-shell-host' : ''} ${mode === 'bluey' ? 'bluey-shell-host' : ''} ${mode === 'capy' ? 'capy-shell-host' : ''}`}
    >
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

      {mode === 'home' && (
        <ModeSelect
          onPickCafe={() => {
            play('tap')
            setMode('cafe')
          }}
          onPickTransformers={() => {
            play('transform')
            setMode('transformers')
          }}
          onPickFlight={() => {
            play('whoosh')
            setMode('flight')
          }}
          onPickF1={() => {
            play('blast')
            setMode('f1')
          }}
          onPickBluey={() => {
            play('happy')
            setMode('bluey')
          }}
          onPickCapy={() => {
            play('hit')
            setMode('capy')
          }}
        />
      )}

      {mode === 'cafe' && !care.selected && (
        <CafeScene
          states={care.states}
          onSelect={(id) => {
            play('tap')
            care.selectHedgehog(id)
          }}
          onBack={() => {
            play('tap')
            goHome()
          }}
        />
      )}

      {mode === 'cafe' && care.selected && (
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

      {mode === 'transformers' && (
        <TransformersBattle
          onBack={() => {
            play('tap')
            goHome()
          }}
          playSound={play}
        />
      )}

      {mode === 'flight' && (
        <FlightGame
          onBack={() => {
            play('tap')
            goHome()
          }}
          playSound={play}
        />
      )}

      {mode === 'f1' && (
        <F1Race
          muted={muted}
          onBack={() => {
            play('tap')
            goHome()
          }}
          playSound={play}
        />
      )}

      {mode === 'bluey' && (
        <BlueyBarber
          onBack={() => {
            play('tap')
            goHome()
          }}
          playSound={play}
        />
      )}

      {mode === 'capy' && (
        <CapyConstruction
          onBack={() => {
            play('tap')
            goHome()
          }}
          playSound={play}
        />
      )}

      {showTip && mode === 'home' && (
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
