import { useCallback, useEffect, useRef, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { Airplane } from './Airplane'
import './flight.css'

interface FlightGameProps {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Phase = 'ready' | 'flying' | 'landed'

interface Collectible {
  id: number
  x: number
  y: number
  kind: 'star' | 'cloud' | 'fish'
  taken: boolean
}

const ROUTE_LABELS = [
  { at: 0, label: 'Phuket' },
  { at: 35, label: 'Ocean' },
  { at: 70, label: 'Islands' },
  { at: 100, label: 'Denpasar' },
]

function makeCollectibles(): Collectible[] {
  const kinds: Array<Collectible['kind']> = [
    'star',
    'cloud',
    'fish',
    'star',
    'cloud',
    'star',
    'fish',
    'star',
    'cloud',
    'star',
    'fish',
    'cloud',
    'star',
    'star',
    'cloud',
    'fish',
    'star',
    'cloud',
    'star',
    'fish',
  ]
  return kinds.map((kind, i) => ({
    id: i + 1,
    // World X along the longer route (plane meets them as progress advances)
    x: 12 + i * 4.4,
    y: 18 + ((i * 17) % 58),
    kind,
    taken: false,
  }))
}

export function FlightGame({ onBack, playSound }: FlightGameProps) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [progress, setProgress] = useState(0)
  const [altitude, setAltitude] = useState(50)
  const [tilt, setTilt] = useState(0)
  const [items, setItems] = useState<Collectible[]>(() => makeCollectibles())
  const [score, setScore] = useState(0)
  const [hint, setHint] = useState('Ready for takeoff in Phuket!')
  const holdRef = useRef<'up' | 'down' | null>(null)
  const dragRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const altitudeRef = useRef(50)
  const rafRef = useRef<number | null>(null)

  const scenery =
    progress < 20 ? 'beach' : progress < 55 ? 'ocean' : progress < 85 ? 'islands' : 'bali'

  const stopLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }

  const collectNearPlane = useCallback(() => {
    // Plane is visually fixed near 18% screen-x; items scroll by world progress.
    const planeWorldX = progressRef.current + 8
    const planeY = altitudeRef.current
    setItems((prev) => {
      let gained = 0
      const next = prev.map((item) => {
        if (item.taken) return item
        const dx = item.x - planeWorldX
        const dy = item.y - planeY
        if (Math.abs(dx) < 6 && Math.abs(dy) < 10) {
          gained += 1
          return { ...item, taken: true }
        }
        return item
      })
      if (gained > 0) {
        setScore((s) => s + gained)
        playSound('happy')
        setHint(gained > 1 ? 'Wow, so many!' : 'Nice catch!')
      }
      return next
    })
  }, [playSound])

  useEffect(() => {
    if (phase !== 'flying') {
      stopLoop()
      return
    }

    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      if (holdRef.current === 'up') {
        altitudeRef.current = Math.max(8, altitudeRef.current - 38 * dt)
        setTilt(-12)
      } else if (holdRef.current === 'down') {
        altitudeRef.current = Math.min(88, altitudeRef.current + 38 * dt)
        setTilt(12)
      } else if (!dragRef.current) {
        setTilt((t) => t * 0.85)
      }

      // ~45–50s Phuket → Denpasar (was ~13s)
      progressRef.current = Math.min(100, progressRef.current + 2.05 * dt)
      setProgress(progressRef.current)
      setAltitude(altitudeRef.current)
      collectNearPlane()

      if (progressRef.current >= 100) {
        setPhase('landed')
        setTilt(0)
        setHint('Welcome to Denpasar, Bali!')
        playSound('celebrate')
        stopLoop()
        return
      }

      if (progressRef.current > 88) setHint('Bali ahead — get ready to land!')
      else if (progressRef.current > 68 && progressRef.current < 74) setHint('Island hopping!')
      else if (progressRef.current > 42 && progressRef.current < 48) setHint('Still over the ocean...')
      else if (progressRef.current > 18 && progressRef.current < 24) setHint('Over the big blue sea!')

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return stopLoop
  }, [collectNearPlane, phase, playSound])

  const takeOff = () => {
    progressRef.current = 0
    altitudeRef.current = 50
    setProgress(0)
    setAltitude(50)
    setItems(makeCollectibles())
    setScore(0)
    setPhase('flying')
    setHint('Fly to Bali! Use ↑ ↓ or drag the sky.')
    playSound('whoosh')
  }

  const restart = () => {
    stopLoop()
    holdRef.current = null
    dragRef.current = false
    progressRef.current = 0
    altitudeRef.current = 50
    setPhase('ready')
    setProgress(0)
    setAltitude(50)
    setTilt(0)
    setItems(makeCollectibles())
    setScore(0)
    setHint('Ready for takeoff in Phuket!')
    playSound('tap')
  }

  const onStagePointer = (clientY: number) => {
    const stage = stageRef.current
    if (!stage || phase !== 'flying') return
    const rect = stage.getBoundingClientRect()
    const ratio = (clientY - rect.top) / rect.height
    const next = Math.min(88, Math.max(8, ratio * 100))
    altitudeRef.current = next
    setAltitude(next)
    setTilt(next < altitude ? -10 : next > altitude ? 10 : 0)
  }

  const currentStop =
    ROUTE_LABELS.reduce((best, stop) => (progress >= stop.at ? stop : best), ROUTE_LABELS[0])
      ?.label ?? 'Phuket'

  return (
    <section className={`flight-game scenery-${scenery}`} aria-label="Airplane flight">
      <div className="flight-sky" aria-hidden="true">
        <div className="sun" />
        <div className="sea" />
        <div className="land left" />
        <div className="land right" />
      </div>

      <header className="flight-header">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Home
        </button>
        <div className="flight-title">
          <h1>Sky Trip</h1>
          <p>Phuket → Denpasar</p>
        </div>
        <div className="flight-score" aria-label={`${score} collected`}>
          ⭐ {score}
        </div>
      </header>

      <p className="flight-hint">{hint}</p>

      <div className="flight-route" aria-label="Flight progress">
        <div className="flight-route-track">
          <div className="flight-route-fill" style={{ width: `${progress}%` }} />
          <span className="flight-route-plane" style={{ left: `${progress}%` }}>
            ✈️
          </span>
        </div>
        <div className="flight-route-labels">
          <span>🇹🇭 Phuket</span>
          <span className="now">{currentStop}</span>
          <span>🇮🇩 Denpasar</span>
        </div>
      </div>

      <div
        className="flight-stage"
        ref={stageRef}
        onPointerDown={(event) => {
          if (phase !== 'flying') return
          dragRef.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          onStagePointer(event.clientY)
        }}
        onPointerMove={(event) => {
          if (!dragRef.current) return
          onStagePointer(event.clientY)
        }}
        onPointerUp={() => {
          dragRef.current = false
          setTilt(0)
        }}
        onPointerCancel={() => {
          dragRef.current = false
          setTilt(0)
        }}
      >
        {items.map((item) => {
          if (item.taken) return null
          // Scroll items from right toward the fixed plane as progress advances.
          const screenX = 18 + (item.x - progress)
          if (screenX < -10 || screenX > 110) return null
          return (
            <span
              key={item.id}
              className={`flight-item ${item.kind}`}
              style={{ left: `${screenX}%`, top: `${item.y}%` }}
            >
              {item.kind === 'star' ? '⭐' : item.kind === 'cloud' ? '☁️' : '🐠'}
            </span>
          )
        })}

        <div className="flight-plane-wrap" style={{ top: `${altitude}%` }}>
          <Airplane tilt={tilt} />
        </div>

        {phase === 'landed' && (
          <div className="flight-landing" role="status">
            <h2>Welcome to Bali!</h2>
            <p>You flew from Phuket to Denpasar.</p>
            <p className="flight-landing-score">Stars & friends: {score}</p>
          </div>
        )}
      </div>

      <div className="flight-controls">
        {phase === 'ready' && (
          <button type="button" className="flight-go" onClick={takeOff}>
            ✈️ Take off!
          </button>
        )}

        {phase === 'flying' && (
          <>
            <button
              type="button"
              className="flight-steer"
              aria-label="Fly up"
              onPointerDown={() => {
                holdRef.current = 'up'
                playSound('tap')
              }}
              onPointerUp={() => {
                holdRef.current = null
                setTilt(0)
              }}
              onPointerLeave={() => {
                holdRef.current = null
                setTilt(0)
              }}
            >
              ↑
            </button>
            <button
              type="button"
              className="flight-steer"
              aria-label="Fly down"
              onPointerDown={() => {
                holdRef.current = 'down'
                playSound('tap')
              }}
              onPointerUp={() => {
                holdRef.current = null
                setTilt(0)
              }}
              onPointerLeave={() => {
                holdRef.current = null
                setTilt(0)
              }}
            >
              ↓
            </button>
          </>
        )}

        {phase === 'landed' && (
          <>
            <button type="button" className="flight-go" onClick={restart}>
              Fly again!
            </button>
            <button type="button" className="flight-secondary" onClick={onBack}>
              Back home
            </button>
          </>
        )}
      </div>
    </section>
  )
}
