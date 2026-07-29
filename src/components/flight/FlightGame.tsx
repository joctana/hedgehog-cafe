import { useCallback, useEffect, useRef, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { Airplane } from './Airplane'
import './flight.css'

interface FlightGameProps {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Phase = 'ready' | 'takeoff' | 'flying' | 'landing' | 'landed'

interface Collectible {
  id: number
  x: number
  y: number
  kind: 'star' | 'cloud' | 'fish'
  taken: boolean
}

const GROUND_ALT = 82
const TAKEOFF_CLIMB_ALT = 58
const LANDING_TOUCH_ALT = 78
const LANDING_START_PROGRESS = 86

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
    x: 18 + i * 3.8,
    y: 18 + ((i * 17) % 50),
    kind,
    taken: false,
  }))
}

export function FlightGame({ onBack, playSound }: FlightGameProps) {
  const [phase, setPhase] = useState<Phase>('ready')
  const [progress, setProgress] = useState(0)
  const [altitude, setAltitude] = useState(GROUND_ALT)
  const [tilt, setTilt] = useState(0)
  const [items, setItems] = useState<Collectible[]>(() => makeCollectibles())
  const [score, setScore] = useState(0)
  const [hint, setHint] = useState('Ready for takeoff in Phuket!')
  const [gearDown, setGearDown] = useState(true)
  const holdRef = useRef<'up' | 'down' | null>(null)
  const dragRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const altitudeRef = useRef(GROUND_ALT)
  const phaseRef = useRef<Phase>('ready')
  const rafRef = useRef<number | null>(null)
  const takeoffAssist = useRef(0)
  const landingAssist = useRef(0)

  const scenery =
    phase === 'ready' || phase === 'takeoff'
      ? 'beach'
      : progress < 55
        ? 'ocean'
        : progress < 85
          ? 'islands'
          : 'bali'

  const stopLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }

  const collectNearPlane = useCallback(() => {
    if (phaseRef.current !== 'flying') return
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
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    if (phase !== 'takeoff' && phase !== 'flying' && phase !== 'landing') {
      stopLoop()
      return
    }

    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const current = phaseRef.current

      if (current === 'takeoff') {
        // Roll down the runway, then climb
        progressRef.current = Math.min(12, progressRef.current + 3.2 * dt)

        if (holdRef.current === 'up') {
          altitudeRef.current = Math.max(28, altitudeRef.current - 32 * dt)
          setTilt(-16)
          takeoffAssist.current += dt
        } else {
          // Gentle bounce on runway until climb
          if (altitudeRef.current > GROUND_ALT - 1) {
            altitudeRef.current = GROUND_ALT
            setTilt(progressRef.current > 2 ? -4 : 0)
          }
          takeoffAssist.current += dt * 0.35
        }

        // Soft assist so little kids always get airborne
        if (takeoffAssist.current > 4 && altitudeRef.current > TAKEOFF_CLIMB_ALT) {
          altitudeRef.current = Math.max(TAKEOFF_CLIMB_ALT - 4, altitudeRef.current - 10 * dt)
          setTilt(-10)
        }

        setProgress(progressRef.current)
        setAltitude(altitudeRef.current)

        if (altitudeRef.current <= TAKEOFF_CLIMB_ALT && progressRef.current >= 6) {
          setPhase('flying')
          phaseRef.current = 'flying'
          setGearDown(false)
          setHint('Gear up! Fly to Bali!')
          playSound('whoosh')
        } else if (progressRef.current < 3) {
          setHint('Speeding down the runway...')
        } else {
          setHint('Hold ↑ to climb!')
        }
      } else if (current === 'flying') {
        if (holdRef.current === 'up') {
          altitudeRef.current = Math.max(8, altitudeRef.current - 38 * dt)
          setTilt(-12)
        } else if (holdRef.current === 'down') {
          altitudeRef.current = Math.min(88, altitudeRef.current + 38 * dt)
          setTilt(12)
        } else if (!dragRef.current) {
          setTilt((t) => t * 0.85)
        }

        progressRef.current = Math.min(LANDING_START_PROGRESS, progressRef.current + 2.05 * dt)
        setProgress(progressRef.current)
        setAltitude(altitudeRef.current)
        collectNearPlane()

        if (progressRef.current >= LANDING_START_PROGRESS) {
          setPhase('landing')
          phaseRef.current = 'landing'
          setGearDown(true)
          setHint('Denpasar ahead — hold ↓ to land!')
          playSound('tap')
          landingAssist.current = 0
        } else if (progressRef.current > 68 && progressRef.current < 74) {
          setHint('Island hopping!')
        } else if (progressRef.current > 42 && progressRef.current < 48) {
          setHint('Still over the ocean...')
        } else if (progressRef.current > 18 && progressRef.current < 24) {
          setHint('Over the big blue sea!')
        }
      } else if (current === 'landing') {
        progressRef.current = Math.min(100, progressRef.current + 1.6 * dt)
        landingAssist.current += dt

        if (holdRef.current === 'down') {
          altitudeRef.current = Math.min(GROUND_ALT, altitudeRef.current + 34 * dt)
          setTilt(14)
        } else if (holdRef.current === 'up') {
          altitudeRef.current = Math.max(30, altitudeRef.current - 20 * dt)
          setTilt(-8)
        } else {
          // Soft glide toward the runway
          const target = GROUND_ALT - 4
          altitudeRef.current += (target - altitudeRef.current) * Math.min(1, 0.35 * dt)
          setTilt(8)
        }

        // Extra assist after a few seconds so landing always succeeds
        if (landingAssist.current > 5) {
          altitudeRef.current = Math.min(GROUND_ALT, altitudeRef.current + 18 * dt)
          setTilt(12)
        }

        setProgress(progressRef.current)
        setAltitude(altitudeRef.current)

        const onRunway =
          altitudeRef.current >= LANDING_TOUCH_ALT && progressRef.current >= 94
        if (onRunway || progressRef.current >= 100) {
          altitudeRef.current = GROUND_ALT
          progressRef.current = 100
          setAltitude(GROUND_ALT)
          setProgress(100)
          setTilt(0)
          setPhase('landed')
          phaseRef.current = 'landed'
          setHint('Touchdown in Denpasar, Bali!')
          playSound('celebrate')
          stopLoop()
          return
        }

        if (altitudeRef.current > 65) setHint('Almost there — keep holding ↓!')
        else setHint('Hold ↓ to descend to the runway!')
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return stopLoop
  }, [collectNearPlane, phase, playSound])

  const startTakeoff = () => {
    progressRef.current = 0
    altitudeRef.current = GROUND_ALT
    takeoffAssist.current = 0
    landingAssist.current = 0
    setProgress(0)
    setAltitude(GROUND_ALT)
    setTilt(0)
    setGearDown(true)
    setItems(makeCollectibles())
    setScore(0)
    setPhase('takeoff')
    phaseRef.current = 'takeoff'
    setHint('Speeding down the runway...')
    playSound('whoosh')
  }

  const restart = () => {
    stopLoop()
    holdRef.current = null
    dragRef.current = false
    progressRef.current = 0
    altitudeRef.current = GROUND_ALT
    takeoffAssist.current = 0
    landingAssist.current = 0
    setPhase('ready')
    phaseRef.current = 'ready'
    setProgress(0)
    setAltitude(GROUND_ALT)
    setTilt(0)
    setGearDown(true)
    setItems(makeCollectibles())
    setScore(0)
    setHint('Ready for takeoff in Phuket!')
    playSound('tap')
  }

  const steeringEnabled = phase === 'takeoff' || phase === 'flying' || phase === 'landing'

  const onStagePointer = (clientY: number) => {
    const stage = stageRef.current
    if (!stage || !steeringEnabled) return
    const rect = stage.getBoundingClientRect()
    const ratio = (clientY - rect.top) / rect.height
    const minAlt = phase === 'takeoff' ? 28 : 8
    const maxAlt = phase === 'landing' || phase === 'takeoff' ? GROUND_ALT : 88
    const next = Math.min(maxAlt, Math.max(minAlt, ratio * 100))
    altitudeRef.current = next
    setAltitude(next)
    setTilt(next < altitude ? -10 : next > altitude ? 10 : 0)
  }

  const currentStop =
    ROUTE_LABELS.reduce((best, stop) => (progress >= stop.at ? stop : best), ROUTE_LABELS[0])
      ?.label ?? 'Phuket'

  const showRunway = phase === 'ready' || phase === 'takeoff' || phase === 'landing' || phase === 'landed'
  const runwaySide = phase === 'ready' || phase === 'takeoff' ? 'left' : 'right'

  return (
    <section
      className={`flight-game scenery-${scenery} phase-${phase}`}
      aria-label="Airplane flight"
    >
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
          if (!steeringEnabled) return
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
          if (phase === 'flying') setTilt(0)
        }}
        onPointerCancel={() => {
          dragRef.current = false
          if (phase === 'flying') setTilt(0)
        }}
      >
        {showRunway && (
          <div className={`flight-runway ${runwaySide}`} aria-hidden="true">
            <div className="runway-strip">
              <span className="runway-mark">
                {runwaySide === 'left' ? 'HKT' : 'DPS'}
              </span>
            </div>
          </div>
        )}

        {phase === 'flying' &&
          items.map((item) => {
            if (item.taken) return null
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

        <div
          className={`flight-plane-wrap ${phase === 'takeoff' ? 'rolling' : ''}`}
          style={{ top: `${altitude}%` }}
        >
          <Airplane tilt={tilt} gearDown={gearDown} />
          {(phase === 'takeoff' || phase === 'landing') && altitude >= GROUND_ALT - 2 && (
            <span className="flight-dust" aria-hidden="true" />
          )}
        </div>

        {phase === 'landed' && (
          <div className="flight-landing" role="status">
            <h2>Welcome to Bali!</h2>
            <p>Touchdown in Denpasar.</p>
            <p className="flight-landing-score">Stars & friends: {score}</p>
          </div>
        )}
      </div>

      <div className="flight-controls">
        {phase === 'ready' && (
          <button type="button" className="flight-go" onClick={startTakeoff}>
            ✈️ Take off!
          </button>
        )}

        {steeringEnabled && (
          <>
            <button
              type="button"
              className={`flight-steer ${phase === 'takeoff' ? 'highlight' : ''}`}
              aria-label="Fly up"
              onPointerDown={() => {
                holdRef.current = 'up'
                playSound('tap')
              }}
              onPointerUp={() => {
                holdRef.current = null
              }}
              onPointerLeave={() => {
                holdRef.current = null
              }}
            >
              ↑
            </button>
            <button
              type="button"
              className={`flight-steer ${phase === 'landing' ? 'highlight' : ''}`}
              aria-label="Fly down"
              onPointerDown={() => {
                holdRef.current = 'down'
                playSound('tap')
              }}
              onPointerUp={() => {
                holdRef.current = null
              }}
              onPointerLeave={() => {
                holdRef.current = null
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
