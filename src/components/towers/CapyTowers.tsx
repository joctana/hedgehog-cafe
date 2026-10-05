import { useEffect, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { TowerCapy } from './TowerCapy'
import './towers.css'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Phase = 'race' | 'armed' | 'tumble' | 'done'

const COLORS = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#c084fc', '#fb7185', '#38bdf8']
const COCO_MAX = 6
const MIN_TOWER = 4
const COCO_PACE = 1600

const CARLOS = { coat: '#b88960', belly: '#c99a70' }
const COCO = { coat: '#8f6540', belly: '#d4a882' }

export function CapyTowers({ onBack, playSound }: Props) {
  const [phase, setPhase] = useState<Phase>('race')
  const [mine, setMine] = useState(0)
  const [coco, setCoco] = useState(3)

  useEffect(() => {
    if (phase !== 'race') return
    const id = window.setInterval(() => {
      setCoco((count) => (count >= COCO_MAX ? count : count + 1))
    }, COCO_PACE)
    return () => window.clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'tumble') return
    const id = window.setTimeout(() => {
      setPhase('done')
      playSound('celebrate')
    }, 880)
    return () => window.clearTimeout(id)
  }, [phase, playSound])

  const ahead = mine >= MIN_TOWER && mine > coco

  const stack = () => {
    if (phase !== 'race' || ahead) return
    setMine((count) => count + 1)
    playSound('happy')
  }

  const arm = () => {
    if (phase !== 'race' || !ahead) return
    setPhase('armed')
    playSound('happy')
  }

  const boom = () => {
    if (phase !== 'armed') return
    setPhase('tumble')
    playSound('blast')
  }

  const playAgain = () => {
    setMine(0)
    setCoco(3)
    setPhase('race')
    playSound('celebrate')
  }

  const message =
    phase === 'done'
      ? 'Both towers came down.'
      : phase === 'armed'
        ? 'Charges are set on both towers.'
        : phase === 'tumble'
          ? 'Boom! Both towers fall.'
          : mine < MIN_TOWER
            ? 'Stack a tower taller than Coco.'
            : ahead
              ? 'You’re taller! Set explosives on both towers.'
              : 'Coco is keeping up. Stack another block!'

  return (
    <div className={`tower-shell phase-${phase}`}>
      <header className="tower-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="tower-title">
          {phase === 'done' ? 'You win!' : 'Capybara Towers'}
          <small>{message}</small>
        </h1>
        <span className="tower-chip">
          🧱 {mine}–{coco}
        </span>
      </header>

      {phase === 'done' ? (
        <div className="tower-done">
          <div className="done-sides">
            <div className="done-side">
              <div className="rubble" aria-hidden>
                <i />
                <i />
                <i />
              </div>
              <TowerCapy coat={CARLOS.coat} belly={CARLOS.belly} size={130} />
              <p>Your tower</p>
            </div>
            <div className="done-side">
              <div className="rubble coco-rubble" aria-hidden>
                <i />
                <i />
                <i />
              </div>
              <TowerCapy coat={COCO.coat} belly={COCO.belly} size={130} bow />
              <p>Coco’s tower</p>
            </div>
          </div>
          <p className="tower-lead">You built the taller tower, then the explosives popped both. Everyone is still smiling.</p>
          <div className="tower-done-actions">
            <button type="button" className="tower-again" onClick={playAgain}>
              Build again
            </button>
            <button type="button" className="tower-home" onClick={onBack}>
              Games
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={`yard ${phase === 'tumble' ? 'booming' : ''}`}>
            <TowerSide
              label="You"
              count={mine}
              coat={CARLOS.coat}
              belly={CARLOS.belly}
              leading={ahead}
              charges={phase === 'armed' || phase === 'tumble'}
              falling={phase === 'tumble'}
            />
            <TowerSide
              label="Coco"
              count={coco}
              coat={COCO.coat}
              belly={COCO.belly}
              bow
              charges={phase === 'armed' || phase === 'tumble'}
              falling={phase === 'tumble'}
            />
          </div>
          <div className="tower-actions">
            {phase === 'tumble' ? (
              <p className="tower-hint">Both towers down!</p>
            ) : phase === 'armed' ? (
              <button type="button" className="tower-action boom-btn" onClick={boom}>
                <span aria-hidden>💥</span>
                Boom!
              </button>
            ) : ahead ? (
              <button type="button" className="tower-action arm-btn" onClick={arm}>
                <span aria-hidden>🧨</span>
                Set explosives
              </button>
            ) : (
              <button type="button" className="tower-action stack-btn" onClick={stack}>
                <span aria-hidden>🧱</span>
                Stack a block
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function TowerSide({
  label,
  count,
  coat,
  belly,
  leading = false,
  falling = false,
  bow = false,
  charges = false,
}: {
  label: string
  count: number
  coat: string
  belly: string
  leading?: boolean
  falling?: boolean
  bow?: boolean
  charges?: boolean
}) {
  return (
    <section className={`tower-side ${leading ? 'leading' : ''} ${falling ? 'falling' : ''}`} aria-label={`${label}'s tower, ${count} blocks`}>
      <div className="block-stack">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="tower-block" style={{ background: COLORS[index % COLORS.length] }} />
        ))}
      </div>
      {charges && <BoomCharges />}
      <TowerCapy coat={coat} belly={belly} bow={bow} />
      <p className="side-name">
        {label}
        <small>{count}</small>
      </p>
    </section>
  )
}

function BoomCharges() {
  return (
    <span className="boom-charges" aria-hidden>
      <svg viewBox="0 0 88 40" className="tower-svg">
        <rect x="4" y="12" width="36" height="16" rx="8" fill="#ef4444" />
        <rect x="10" y="12" width="6" height="16" fill="#fecaca" />
        <rect x="44" y="12" width="36" height="16" rx="8" fill="#ef4444" />
        <rect x="50" y="12" width="6" height="16" fill="#fecaca" />
        <path d="M40 14 Q44 6 48 14" stroke="#facc15" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="44" cy="6" r="4" fill="#facc15" />
      </svg>
    </span>
  )
}
