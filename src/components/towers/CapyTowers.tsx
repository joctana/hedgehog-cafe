import { useEffect, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { TowerCapy } from './TowerCapy'
import './towers.css'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Phase = 'race' | 'shot' | 'tumble' | 'done'

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
    if (phase !== 'shot') return
    const id = window.setTimeout(() => {
      setPhase('tumble')
      playSound('whoosh')
    }, 520)
    return () => window.clearTimeout(id)
  }, [phase, playSound])

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

  const fire = () => {
    if (phase !== 'race' || !ahead) return
    setPhase('shot')
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
      ? 'Your tower stayed up.'
        : phase === 'shot'
          ? 'Boom! The cannon fires.'
          : phase === 'tumble'
            ? 'Down it goes!'
            : mine < MIN_TOWER
              ? 'Stack a tower taller than Coco.'
              : ahead
                ? 'Cannon ready! Shoot Coco’s tower.'
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
              <div className="done-stack" aria-hidden>
                {Array.from({ length: mine }, (_, index) => (
                  <i key={index} style={{ background: COLORS[index % COLORS.length] }} />
                ))}
                <ToyCannon />
              </div>
              <TowerCapy coat={CARLOS.coat} belly={CARLOS.belly} size={130} />
              <p>Your tower</p>
            </div>
            <div className="done-side">
              <div className="rubble" aria-hidden>
                <i />
                <i />
                <i />
              </div>
              <TowerCapy coat={COCO.coat} belly={COCO.belly} size={130} bow />
              <p>Coco’s tower</p>
            </div>
          </div>
          <p className="tower-lead">Your cannon shot Coco’s tower. She is still smiling.</p>
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
          <div className="yard">
            <TowerSide
              label="You"
              count={mine}
              coat={CARLOS.coat}
              belly={CARLOS.belly}
              leading={ahead}
              cannon={ahead || phase === 'shot' || phase === 'tumble'}
              firing={phase === 'shot'}
            />
            <TowerSide
              label="Coco"
              count={coco}
              coat={COCO.coat}
              belly={COCO.belly}
              bow
              falling={phase === 'tumble'}
            />
          </div>
          <div className="tower-actions">
            {phase === 'shot' || phase === 'tumble' ? (
              <p className="tower-hint">{phase === 'shot' ? 'Boom!' : 'Down it goes!'}</p>
            ) : ahead ? (
              <button type="button" className="tower-action fire-btn" onClick={fire}>
                <span aria-hidden>💥</span>
                Fire the cannon
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
  cannon = false,
  firing = false,
}: {
  label: string
  count: number
  coat: string
  belly: string
  leading?: boolean
  falling?: boolean
  bow?: boolean
  cannon?: boolean
  firing?: boolean
}) {
  return (
    <section className={`tower-side ${leading ? 'leading' : ''} ${falling ? 'falling' : ''}`} aria-label={`${label}'s tower, ${count} blocks`}>
      <div className="block-stack">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="tower-block" style={{ background: COLORS[index % COLORS.length] }} />
        ))}
        {cannon && <ToyCannon firing={firing} />}
      </div>
      <TowerCapy coat={coat} belly={belly} bow={bow} />
      <p className="side-name">
        {label}
        <small>{count}</small>
      </p>
    </section>
  )
}

function ToyCannon({ firing = false }: { firing?: boolean }) {
  return (
    <span className={`toy-cannon ${firing ? 'firing' : ''}`} aria-hidden>
      <svg viewBox="0 0 140 64" className="tower-svg">
        <circle cx="36" cy="52" r="11" fill="#292524" />
        <circle cx="74" cy="52" r="11" fill="#292524" />
        <circle cx="36" cy="52" r="4" fill="#e7e5e4" />
        <circle cx="74" cy="52" r="4" fill="#e7e5e4" />
        <rect x="20" y="38" width="70" height="12" rx="4" fill="#b45309" />
        <rect x="56" y="16" width="68" height="20" rx="10" fill="#3f6212" />
        <rect x="116" y="13" width="16" height="26" rx="5" fill="#14532d" />
      </svg>
      {firing && <span className="cannonball" />}
    </span>
  )
}
