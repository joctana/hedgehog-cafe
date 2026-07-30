import { useCallback, useEffect, useRef, useState } from 'react'
import { F1_DRIVERS, RIVAL_NAMES, type F1Driver } from '../../data/f1Drivers'
import type { SoundKind } from '../../hooks/useSounds'
import { useSpeech } from '../../hooks/useSpeech'
import { RaceCar } from './RaceCar'
import './f1.css'

type Phase = 'select' | 'racing' | 'crash' | 'win'

type Rival = {
  id: number
  name: string
  progress: number
  driver: F1Driver
}

type Props = {
  muted: boolean
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

const RACE_DISTANCE = 100
const CRASH_MARKS = [38, 68]
const MAX_CRASHES = CRASH_MARKS.length

const RIVAL_LIVERIES: F1Driver[] = [
  {
    id: 'rival-norris',
    name: 'Norris',
    team: 'apxgp',
    teamName: 'McLaren',
    number: '4',
    primary: '#ff8700',
    secondary: '#111827',
    accent: '#f8fafc',
  },
  {
    id: 'rival-leclerc',
    name: 'Leclerc',
    team: 'ferrari',
    teamName: 'Ferrari',
    number: '16',
    primary: '#dc0000',
    secondary: '#fff200',
    accent: '#ffffff',
  },
  {
    id: 'rival-russell',
    name: 'Russell',
    team: 'redbull',
    teamName: 'Mercedes',
    number: '63',
    primary: '#00d2be',
    secondary: '#111827',
    accent: '#f8fafc',
  },
]

export function F1Race({ muted, onBack, playSound }: Props) {
  const { speak, stop } = useSpeech(muted)
  const [phase, setPhase] = useState<Phase>('select')
  const [driver, setDriver] = useState<F1Driver | null>(null)
  const [progress, setProgress] = useState(0)
  const [lane, setLane] = useState(1)
  const [boosting, setBoosting] = useState(false)
  const [rivals, setRivals] = useState<Rival[]>([])
  const [position, setPosition] = useState(3)
  const [saidP1, setSaidP1] = useState(false)
  const [foam, setFoam] = useState(0)
  const [aimX, setAimX] = useState(50)
  const [sprayOn, setSprayOn] = useState(false)
  const [flameLeft, setFlameLeft] = useState(100)
  const raf = useRef(0)
  const last = useRef(0)
  const boostUntil = useRef(0)
  const sprayRef = useRef(false)
  const progressRef = useRef(0)
  const crashCountRef = useRef(0)
  const wonRef = useRef(false)
  const crashingRef = useRef(false)

  const resetRace = useCallback(
    (picked: F1Driver) => {
      stop()
      wonRef.current = false
      crashingRef.current = false
      progressRef.current = 0
      crashCountRef.current = 0
      setDriver(picked)
      setProgress(0)
      setLane(1)
      setBoosting(false)
      setPosition(3)
      setSaidP1(false)
      setFoam(0)
      setFlameLeft(100)
      setSprayOn(false)
      boostUntil.current = 0
      setRivals(
        RIVAL_LIVERIES.map((d, i) => ({
          id: i + 1,
          name: RIVAL_NAMES[i] ?? d.name,
          progress: 1 + i * 2,
          driver: d,
        })),
      )
      setPhase('racing')
      playSound('celebrate')
    },
    [playSound, stop],
  )

  const startFireFight = useCallback(() => {
    if (crashingRef.current || wonRef.current) return
    crashingRef.current = true
    playSound('hit')
    setFoam(0)
    setFlameLeft(100)
    setAimX(50)
    setSprayOn(false)
    sprayRef.current = false
    crashCountRef.current += 1
    setPhase('crash')
    speak('Crash! Grab the fire extinguisher!')
  }, [playSound, speak])

  const finishFire = useCallback(() => {
    playSound('happy')
    speak('Fire out! Back on track!')
    crashingRef.current = false
    setPhase('racing')
    last.current = performance.now()
  }, [playSound, speak])

  useEffect(() => {
    if (phase !== 'racing' || !driver) return

    last.current = performance.now()

    const tick = (now: number) => {
      if (wonRef.current || crashingRef.current) return

      const dt = Math.min(0.05, (now - last.current) / 1000)
      last.current = now
      const boosted = now < boostUntil.current
      setBoosting(boosted)

      const playerSpeed = (boosted ? 18 : 11) * dt
      const nextProgress = Math.min(RACE_DISTANCE, progressRef.current + playerSpeed)
      progressRef.current = nextProgress
      setProgress(nextProgress)

      if (nextProgress >= RACE_DISTANCE) {
        wonRef.current = true
        setPhase('win')
        playSound('celebrate')
        speak('We have the driver!')
        return
      }

      if (
        crashCountRef.current < MAX_CRASHES &&
        nextProgress >= CRASH_MARKS[crashCountRef.current]!
      ) {
        startFireFight()
        return
      }

      setRivals((prev) =>
        prev.map((r, i) => ({
          ...r,
          progress: Math.min(
            RACE_DISTANCE - 0.5,
            r.progress + (7.5 + i * 0.8 + Math.sin(now / 600 + i) * 1.2) * dt,
          ),
        })),
      )

      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [phase, driver, playSound, speak, startFireFight])

  useEffect(() => {
    if (phase !== 'racing') return
    const all = [
      { name: 'you', progress },
      ...rivals.map((r) => ({ name: r.name, progress: r.progress })),
    ].sort((a, b) => b.progress - a.progress)
    const pos = all.findIndex((x) => x.name === 'you') + 1
    setPosition(pos)
    if (pos === 1 && progress > 12 && !saidP1) {
      setSaidP1(true)
      speak("You're P1, you're P1, push, push, push!")
      playSound('whoosh')
    }
  }, [progress, rivals, phase, saidP1, speak, playSound])

  useEffect(() => {
    if (phase !== 'crash' || !sprayOn) return
    let done = false
    const id = window.setInterval(() => {
      setFoam((f) => Math.min(100, f + 3.2))
      setFlameLeft((fl) => {
        const next = Math.max(0, fl - 2.8)
        if (next <= 0 && !done) {
          done = true
          window.clearInterval(id)
          queueMicrotask(() => finishFire())
        }
        return next
      })
    }, 50)
    return () => window.clearInterval(id)
  }, [phase, sprayOn, finishFire])

  useEffect(() => () => stop(), [stop])

  const boost = () => {
    if (phase !== 'racing') return
    boostUntil.current = performance.now() + 1400
    setBoosting(true)
    playSound('blast')
  }

  const moveLane = (dir: -1 | 1) => {
    if (phase !== 'racing') return
    setLane((l) => Math.max(0, Math.min(2, l + dir)))
    playSound('tap')
  }

  const onExtinguishPointer = (clientX: number, rect: DOMRect) => {
    const x = ((clientX - rect.left) / rect.width) * 100
    setAimX(Math.max(8, Math.min(92, x)))
  }

  if (phase === 'select') {
    return (
      <div className="f1-shell">
        <header className="f1-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="f1-title">F1 Race</h1>
          <span className="f1-chip">Movie night</span>
        </header>
        <div className="f1-select">
          <p className="f1-select-lead">Choose your driver</p>
          <div className="f1-driver-grid">
            {F1_DRIVERS.map((d) => (
              <button
                key={d.id}
                type="button"
                className="f1-driver-card"
                style={{
                  ['--team' as string]: d.primary,
                  ['--accent' as string]: d.accent,
                }}
                onClick={() => resetRace(d)}
              >
                <span className="f1-driver-num">#{d.number}</span>
                <span className="f1-driver-name">{d.name}</span>
                <span className="f1-driver-team">{d.teamName}</span>
                <span className="f1-driver-car">
                  <RaceCar driver={d} size={88} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!driver) return null

  if (phase === 'crash') {
    return (
      <div className="f1-shell crash-mode">
        <header className="f1-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="f1-title">Fire!</h1>
          <span className="f1-chip danger">Put it out</span>
        </header>

        <div className="f1-crash-stage">
          <p className="f1-crash-msg">Hold the extinguisher on the flames!</p>
          <div
            className="f1-fire-zone"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              sprayRef.current = true
              setSprayOn(true)
              playSound('wash')
              onExtinguishPointer(e.clientX, e.currentTarget.getBoundingClientRect())
            }}
            onPointerMove={(e) => {
              if (!sprayRef.current) return
              onExtinguishPointer(e.clientX, e.currentTarget.getBoundingClientRect())
            }}
            onPointerUp={() => {
              sprayRef.current = false
              setSprayOn(false)
            }}
            onPointerCancel={() => {
              sprayRef.current = false
              setSprayOn(false)
            }}
          >
            <div className="f1-crashed-car">
              <RaceCar
                driver={driver}
                crashed
                flameIntensity={flameLeft / 100}
                size={160}
              />
            </div>
            {sprayOn && (
              <div className="f1-foam-spray" style={{ left: `${aimX}%` }} aria-hidden />
            )}
            <div className="f1-extinguisher" style={{ left: `${aimX}%` }} aria-hidden>
              <span className="f1-ext-body">🧯</span>
            </div>
          </div>
          <div className="f1-fire-meters">
            <label>
              Fire
              <div className="meter">
                <i style={{ width: `${flameLeft}%` }} className="fire-fill" />
              </div>
            </label>
            <label>
              Foam
              <div className="meter">
                <i style={{ width: `${foam}%` }} className="foam-fill" />
              </div>
            </label>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'win') {
    return (
      <div className="f1-shell win-mode">
        <header className="f1-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="f1-title">Chequered flag</h1>
          <span className="f1-chip win">P1</span>
        </header>
        <div className="f1-win">
          <div className="f1-win-banner" role="status">
            We have the driver!
          </div>
          <p className="f1-win-sub">
            {driver.name} · {driver.teamName} · #{driver.number}
          </p>
          <RaceCar driver={driver} size={180} />
          <div className="f1-win-actions">
            <button type="button" className="f1-boost" onClick={() => resetRace(driver)}>
              Race again
            </button>
            <button type="button" className="f1-steer" onClick={() => setPhase('select')}>
              Pick driver
            </button>
          </div>
        </div>
      </div>
    )
  }

  const trackOffset = progress * 18

  return (
    <div className="f1-shell">
      <header className="f1-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="f1-title">
          {driver.name}
          <small>{driver.teamName}</small>
        </h1>
        <span className={`f1-chip ${position === 1 ? 'p1' : ''}`}>P{position}</span>
      </header>

      {position === 1 && saidP1 && (
        <div className="f1-p1-callout" aria-live="polite">
          You&apos;re P1 — push, push, push!
        </div>
      )}

      <div className="f1-hud">
        <div className="f1-lap">
          <span>Lap progress</span>
          <div className="meter">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>
        <ul className="f1-standings">
          {[
            { name: driver.name, progress, you: true },
            ...rivals.map((r) => ({ name: r.name, progress: r.progress, you: false })),
          ]
            .sort((a, b) => b.progress - a.progress)
            .map((row, i) => (
              <li key={row.name} className={row.you ? 'you' : ''}>
                <b>P{i + 1}</b> {row.name}
              </li>
            ))}
        </ul>
      </div>

      <div className="f1-track-wrap">
        <div className="f1-track" style={{ backgroundPosition: `0 ${trackOffset}px` }}>
          {rivals.map((r, idx) => {
            const ahead = r.progress - progress
            const y = 42 - ahead * 2.2
            if (y < -10 || y > 110) return null
            return (
              <div
                key={r.id}
                className="f1-rival"
                style={{
                  top: `${y}%`,
                  left: `${18 + idx * 28}%`,
                }}
              >
                <RaceCar driver={r.driver} size={72} />
              </div>
            )
          })}

          <div
            className={`f1-player ${boosting ? 'boosting' : ''}`}
            style={{ left: `${18 + lane * 28}%` }}
          >
            <RaceCar driver={driver} size={100} />
          </div>
        </div>
      </div>

      <div className="f1-controls">
        <button type="button" className="f1-steer" onClick={() => moveLane(-1)}>
          ◀ Left
        </button>
        <button type="button" className="f1-boost" onClick={boost}>
          🚀 DRS Boost
        </button>
        <button type="button" className="f1-steer" onClick={() => moveLane(1)}>
          Right ▶
        </button>
      </div>
    </div>
  )
}
