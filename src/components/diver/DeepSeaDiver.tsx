import { useEffect, useMemo, useRef, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { DiverCarlos } from './DiverCarlos'
import './diver.css'

type Phase = 'intro' | 'dive' | 'done'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Treasure = {
  id: string
  icon: string
  name: string
  x: number
  y: number
}

const TREASURES: Treasure[] = [
  { id: 'shell', icon: '🐚', name: 'striped shell', x: 18, y: 27 },
  { id: 'star', icon: '⭐', name: 'golden starfish', x: 74, y: 22 },
  { id: 'pearl', icon: '🦪', name: 'shiny pearl', x: 55, y: 48 },
  { id: 'coral', icon: '🪸', name: 'rainbow coral', x: 85, y: 61 },
  { id: 'key', icon: '🗝️', name: 'mystery key', x: 31, y: 66 },
  { id: 'chest', icon: '🎁', name: 'treasure chest', x: 67, y: 78 },
]

const BUBBLES = [
  { id: 1, x: 10, y: 52, size: 48 },
  { id: 2, x: 44, y: 20, size: 42 },
  { id: 3, x: 88, y: 38, size: 50 },
  { id: 4, x: 48, y: 75, size: 44 },
]

export function DeepSeaDiver({ onBack, playSound }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [collected, setCollected] = useState<Set<string>>(() => new Set())
  const [oxygen, setOxygen] = useState(100)
  const [position, setPosition] = useState({ x: 49, y: 52 })
  const [swimming, setSwimming] = useState(false)
  const [message, setMessage] = useState('Tap a treasure and Carlos will swim to it!')
  const [sparkle, setSparkle] = useState<{ x: number; y: number } | null>(null)
  const busyRef = useRef(false)

  const count = collected.size
  const progress = count / TREASURES.length

  const remaining = useMemo(
    () => TREASURES.filter((item) => !collected.has(item.id)),
    [collected],
  )

  useEffect(() => {
    if (phase !== 'dive') return
    const timer = window.setInterval(() => {
      setOxygen((value) => {
        if (value <= 22) {
          setMessage('A friendly bubble topped up Carlos’s air!')
          playSound('bubble')
          return 62
        }
        return value - 1
      })
    }, 900)
    return () => window.clearInterval(timer)
  }, [phase, playSound])

  const startDive = () => {
    busyRef.current = false
    setCollected(new Set())
    setOxygen(100)
    setPosition({ x: 49, y: 52 })
    setSwimming(false)
    setSparkle(null)
    setMessage('Tap a treasure and Carlos will swim to it!')
    setPhase('dive')
    playSound('whoosh')
  }

  const collectTreasure = (treasure: Treasure) => {
    if (busyRef.current || collected.has(treasure.id)) return
    busyRef.current = true
    setSwimming(true)
    setPosition({ x: treasure.x, y: treasure.y })
    setMessage(`Swimming to the ${treasure.name}…`)
    playSound('whoosh')

    window.setTimeout(() => {
      const next = new Set(collected)
      next.add(treasure.id)
      setCollected(next)
      setSparkle({ x: treasure.x, y: treasure.y })
      setSwimming(false)
      playSound('happy')
      setMessage(`Carlos found the ${treasure.name}!`)

      window.setTimeout(() => setSparkle(null), 650)
      if (next.size === TREASURES.length) {
        window.setTimeout(() => {
          setPhase('done')
          playSound('celebrate')
        }, 800)
      } else {
        busyRef.current = false
      }
    }, 520)
  }

  const catchBubble = (x: number, y: number) => {
    if (phase !== 'dive') return
    setOxygen((value) => Math.min(100, value + 24))
    setSparkle({ x, y })
    setMessage('Bubble boost! More air for Carlos.')
    playSound('bubble')
    window.setTimeout(() => setSparkle(null), 450)
  }

  if (phase === 'intro') {
    return (
      <div className="diver-shell">
        <header className="diver-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="diver-title">Carlos the Capybara</h1>
          <span className="diver-chip">Deep Sea Diver</span>
        </header>

        <div className="diver-intro">
          <div className="diver-intro-bubbles" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </div>
          <DiverCarlos size={245} swimming />
          <h2>Ready for a deep-sea adventure?</h2>
          <p>Help Carlos explore the reef, meet friendly fish, and find six treasures.</p>
          <button type="button" className="diver-primary" onClick={startDive}>
            🤿 Let&apos;s dive!
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="diver-shell diver-done-shell">
        <header className="diver-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="diver-title">Dive complete!</h1>
          <span className="diver-chip treasure-chip">6 / 6</span>
        </header>

        <div className="diver-done">
          <div className="diver-done-title" role="status">
            Deep-sea superstar!
          </div>
          <div className="diver-treasure-row" aria-label="Treasures collected">
            {TREASURES.map((item) => (
              <span key={item.id}>{item.icon}</span>
            ))}
          </div>
          <DiverCarlos size={245} celebrating />
          <p>Carlos found every treasure and cared for the reef!</p>
          <div className="diver-done-actions">
            <button type="button" className="diver-primary" onClick={startDive}>
              Dive again
            </button>
            <button type="button" className="diver-secondary" onClick={onBack}>
              Games
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="diver-shell">
      <header className="diver-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="diver-title">
          Carlos
          <small>Deep Sea Diver</small>
        </h1>
        <span className="diver-chip treasure-chip">
          {count} / {TREASURES.length}
        </span>
      </header>

      <div className="diver-hud">
        <span>Air</span>
        <div className="diver-air-meter">
          <i style={{ width: `${oxygen}%` }} />
        </div>
        <span className="diver-air-icon">🫧</span>
        <div className="diver-treasure-meter" aria-hidden>
          <i style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <p className="diver-hint" aria-live="polite">
        {message}
      </p>

      <div className="diver-ocean" aria-label="Underwater treasure hunt">
        <div className="diver-sun-rays" aria-hidden />
        <div className="diver-fish fish-one" aria-hidden>
          🐠
        </div>
        <div className="diver-fish fish-two" aria-hidden>
          🐟
        </div>
        <div className="diver-fish fish-three" aria-hidden>
          🐡
        </div>
        <div className="diver-coral coral-left" aria-hidden>
          🪸
        </div>
        <div className="diver-coral coral-right" aria-hidden>
          🪸
        </div>
        <div className="diver-seaweed weed-one" aria-hidden />
        <div className="diver-seaweed weed-two" aria-hidden />

        {BUBBLES.map((bubble) => (
          <button
            key={bubble.id}
            type="button"
            className="diver-bubble"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: bubble.size,
              height: bubble.size,
            }}
            aria-label="Catch an air bubble"
            onClick={() => catchBubble(bubble.x, bubble.y)}
          >
            <span>+</span>
          </button>
        ))}

        {remaining.map((treasure) => (
          <button
            key={treasure.id}
            type="button"
            className="diver-treasure"
            style={{ left: `${treasure.x}%`, top: `${treasure.y}%` }}
            aria-label={`Collect ${treasure.name}`}
            onClick={() => collectTreasure(treasure)}
          >
            <span>{treasure.icon}</span>
          </button>
        ))}

        {sparkle && (
          <div
            className="diver-sparkle"
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
            aria-hidden
          >
            ✨
          </div>
        )}

        <div
          className="diver-carlos-wrap"
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
        >
          <DiverCarlos size={150} swimming={swimming} />
        </div>
      </div>

      <div className="diver-bottom-tip">
        <span>Tap treasure</span>
        <b>🐚 ⭐ 🦪 🪸 🗝️ 🎁</b>
        <span>Tap bubbles for air</span>
      </div>
    </div>
  )
}
