import { useEffect, useRef, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { PaperTarget } from './PaperTarget'
import { SoldierCapy } from './SoldierCapy'
import './soldier.css'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Phase = 'gear' | 'day' | 'goggles' | 'night' | 'done'

type Target = {
  id: number
  x: number
  y: number
}

const DAY_GOAL = 4
const NIGHT_GOAL = 4

const DAY_SPOTS: Target[] = [
  { id: 1, x: 24, y: 0 },
  { id: 2, x: 44, y: 6 },
  { id: 3, x: 60, y: 24 },
  { id: 4, x: 76, y: 18 },
]

const NIGHT_SPOTS: Target[] = [
  { id: 11, x: 26, y: 20 },
  { id: 12, x: 46, y: 0 },
  { id: 13, x: 62, y: 22 },
  { id: 14, x: 78, y: 4 },
]

export function CapySoldier({ onBack, playSound }: Props) {
  const timer = useRef<number | null>(null)
  const popTimer = useRef<number | null>(null)
  const shotTimer = useRef<number | null>(null)
  const kit = useRef({ uniform: false, gear: false })
  const starred = useRef(new Set<number>())
  const dayCount = useRef(0)
  const nightCount = useRef(0)

  const [phase, setPhase] = useState<Phase>('gear')
  const [uniformOn, setUniformOn] = useState(false)
  const [gearOn, setGearOn] = useState(false)
  const [gogglesOn, setGogglesOn] = useState(false)
  const [dressing, setDressing] = useState(false)
  const [shooting, setShooting] = useState(false)
  const [dayHits, setDayHits] = useState(0)
  const [nightHits, setNightHits] = useState(0)
  const [message, setMessage] = useState('Practice time! Put on the uniform and gear.')

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
      if (popTimer.current) window.clearTimeout(popTimer.current)
      if (shotTimer.current) window.clearTimeout(shotTimer.current)
    }
  }, [])

  const bump = () => {
    setDressing(false)
    window.requestAnimationFrame(() => setDressing(true))
    if (popTimer.current) window.clearTimeout(popTimer.current)
    popTimer.current = window.setTimeout(() => setDressing(false), 480)
  }

  const wear = (piece: 'uniform' | 'gear') => {
    if (phase !== 'gear' || kit.current[piece]) return
    kit.current = { ...kit.current, [piece]: true }
    setUniformOn(kit.current.uniform)
    setGearOn(kit.current.gear)
    bump()
    if (kit.current.uniform && kit.current.gear) {
      setMessage('Ready to practice!')
      playSound('celebrate')
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        setPhase('day')
        setMessage('Tap a paper target!')
        playSound('whoosh')
      }, 900)
      return
    }
    setMessage(piece === 'uniform' ? 'Uniform on. Now the gear!' : 'Gear on. Now the uniform!')
    playSound('happy')
  }

  const wearGoggles = () => {
    if (phase !== 'goggles' || gogglesOn) return
    setGogglesOn(true)
    bump()
    setMessage('Night vision on!')
    playSound('transform')
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setPhase('night')
      setMessage('Tap a paper target!')
    }, 700)
  }

  const pew = (target: Target) => {
    if ((phase !== 'day' && phase !== 'night') || starred.current.has(target.id)) return
    starred.current.add(target.id)
    setShooting(true)
    if (shotTimer.current) window.clearTimeout(shotTimer.current)
    shotTimer.current = window.setTimeout(() => setShooting(false), 280)
    playSound('hit')
    if (phase === 'day') {
      dayCount.current += 1
      const total = dayCount.current
      setDayHits(total)
      if (total >= DAY_GOAL) {
        setMessage('The sun went down.')
        if (timer.current) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => {
          setPhase('goggles')
          setMessage('Put on the night-vision goggles.')
          playSound('whoosh')
        }, 900)
      } else {
        setMessage('Pew! Just paper.')
      }
      return
    }
    nightCount.current += 1
    const total = nightCount.current
    setNightHits(total)
    if (total >= NIGHT_GOAL) {
      setMessage('Every paper target has a star.')
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        setPhase('done')
        playSound('celebrate')
      }, 700)
      return
    }
    setMessage('Pew! The goggles help.')
  }

  const playAgain = () => {
    if (timer.current) window.clearTimeout(timer.current)
    kit.current = { uniform: false, gear: false }
    starred.current = new Set()
    dayCount.current = 0
    nightCount.current = 0
    setUniformOn(false)
    setGearOn(false)
    setGogglesOn(false)
    setDressing(false)
    setShooting(false)
    setDayHits(0)
    setNightHits(0)
    setPhase('gear')
    setMessage('Practice time! Put on the uniform and gear.')
    playSound('celebrate')
  }

  const nightLook = phase === 'goggles' || phase === 'night'
  const targets = phase === 'day' ? DAY_SPOTS : phase === 'night' ? NIGHT_SPOTS : []
  const chip =
    phase === 'gear'
      ? `🪖 ${Number(uniformOn) + Number(gearOn)}/2`
      : phase === 'day'
        ? `🎯 ${dayHits}/${DAY_GOAL}`
        : phase === 'goggles'
          ? '🌙'
          : `🥽 ${phase === 'done' ? NIGHT_GOAL : nightHits}/${NIGHT_GOAL}`

  return (
    <div className={`soldier-shell phase-${phase} ${nightLook ? 'is-night' : ''} ${gogglesOn ? 'has-goggles' : ''}`}>
      <header className="soldier-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="soldier-title">
          {phase === 'done' ? 'Range complete!' : 'Capybara Soldier'}
          <small>{phase === 'done' ? 'Carlos only starred paper.' : message}</small>
        </h1>
        <span className="soldier-chip">{chip}</span>
      </header>

      {phase === 'done' ? (
        <div className="soldier-done">
          <SoldierCapy size={190} goggles blaster />
          <div className="done-papers">
            <PaperTarget hit />
            <PaperTarget hit />
            <PaperTarget hit />
          </div>
          <p className="soldier-lead">
            {DAY_GOAL} in the sun · {NIGHT_GOAL} at night. Nobody got hurt.
          </p>
          <div className="soldier-done-actions">
            <button type="button" className="soldier-again" onClick={playAgain}>
              Practice again
            </button>
            <button type="button" className="soldier-home" onClick={onBack}>
              Games
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="soldier-scene">
            {phase === 'gear' ? (
              <div className="gear-room">
                <div className="range-sign" aria-hidden>
                  Target Range
                </div>
                <div className="kit-locker" aria-hidden>
                  <span />
                  <span />
                </div>
                <SoldierCapy
                  size="clamp(220px, 46vh, 320px)"
                  uniform={uniformOn}
                  gear={gearOn}
                  dressing={dressing}
                />
              </div>
            ) : (
              <div className={`range ${nightLook ? 'night' : 'day'} ${gogglesOn ? 'nvg' : ''}`}>
                <div className="range-sky" aria-hidden>
                  {nightLook ? <span className="moon" /> : <span className="sun" />}
                  {nightLook && (
                    <>
                      <i className="star s1" />
                      <i className="star s2" />
                      <i className="star s3" />
                    </>
                  )}
                </div>
                <div className="range-field">
                  {targets.map((target) => {
                    const hit = starred.current.has(target.id)
                    return (
                      <button
                        key={target.id}
                        type="button"
                        className={`target-btn ${hit ? 'hit' : ''}`}
                        style={{ left: `${target.x}%`, top: `${target.y}%` }}
                        aria-label={hit ? 'Paper target already starred' : 'Pew the paper target'}
                        onClick={() => pew(target)}
                      >
                        <PaperTarget hit={hit} />
                      </button>
                    )
                  })}
                  <div className="shooter">
                    <SoldierCapy
                      size="clamp(140px, 24vh, 200px)"
                      goggles={gogglesOn}
                      blaster
                      dressing={dressing}
                      shooting={shooting}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="soldier-actions">
            {phase === 'gear' ? (
              <>
                <button
                  type="button"
                  className={`soldier-action uniform-btn ${uniformOn ? 'worn' : ''}`}
                  aria-pressed={uniformOn}
                  onClick={() => wear('uniform')}
                >
                  <span aria-hidden>👕</span>
                  {uniformOn ? 'Uniform on' : 'Uniform'}
                </button>
                <button
                  type="button"
                  className={`soldier-action gear-btn ${gearOn ? 'worn' : ''}`}
                  aria-pressed={gearOn}
                  onClick={() => wear('gear')}
                >
                  <span aria-hidden>🪖</span>
                  {gearOn ? 'Gear on' : 'Gear'}
                </button>
              </>
            ) : phase === 'goggles' ? (
              <button type="button" className="soldier-action goggles-btn" onClick={wearGoggles}>
                <span aria-hidden>🥽</span>
                Night goggles
              </button>
            ) : (
              <p className="soldier-hint">Paper only. Tap a target!</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
