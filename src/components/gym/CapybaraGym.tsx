import { useState } from 'react'
import { GYM_CAPYS, type GymCapy as GymCapyProfile } from '../../data/gymCapys'
import type { SoundKind } from '../../hooks/useSounds'
import { GymCapy, type WorkoutKind } from './GymCapy'
import './gym.css'

type Phase = 'select' | 'train' | 'buff'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

const WORKOUTS: Array<{ id: WorkoutKind; label: string; emoji: string }> = [
  { id: 'lift', label: 'Lift', emoji: '🏋️' },
  { id: 'jump', label: 'Jump', emoji: '🤸' },
  { id: 'run', label: 'Run', emoji: '🏃' },
  { id: 'flex', label: 'Flex', emoji: '💪' },
]

const MAX_SIZE = 12
const START_SCALE = 0.72
const GROWTH = 0.09

export function CapybaraGym({ onBack, playSound }: Props) {
  const [phase, setPhase] = useState<Phase>('select')
  const [capy, setCapy] = useState<GymCapyProfile | null>(null)
  const [reps, setReps] = useState(0)
  const [workout, setWorkout] = useState<WorkoutKind | null>(null)
  const [message, setMessage] = useState('Tap a workout!')

  const sizeLevel = Math.min(MAX_SIZE, reps)
  const scale = START_SCALE + sizeLevel * GROWTH
  const progress = sizeLevel / MAX_SIZE

  const startTrain = (picked: GymCapyProfile) => {
    setCapy(picked)
    setReps(0)
    setWorkout(null)
    setMessage('Tap a workout and watch them grow!')
    setPhase('train')
    playSound('celebrate')
  }

  const doWorkout = (kind: WorkoutKind) => {
    if (phase !== 'train' || !capy) return
    setWorkout(kind)
    playSound(kind === 'jump' ? 'whoosh' : kind === 'flex' ? 'happy' : 'hit')
    window.setTimeout(() => setWorkout(null), 420)

    setReps((current) => {
      const next = current + 1
      if (next >= MAX_SIZE) {
        setMessage(`${capy.name} is MEGA BIG!`)
        window.setTimeout(() => {
          setPhase('buff')
          playSound('celebrate')
        }, 380)
      } else if (next === 4) {
        setMessage('Getting bigger… keep going!')
      } else if (next === 8) {
        setMessage('Whoa — super strong!')
      } else {
        setMessage(`${kind === 'lift' ? 'Up!' : kind === 'jump' ? 'Boing!' : kind === 'run' ? 'Zoom!' : 'Flex!'} Bigger!`)
      }
      return next
    })
  }

  if (phase === 'select') {
    return (
      <div className="gym-shell">
        <header className="gym-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="gym-title">Capybara Gym</h1>
          <span className="gym-chip">Workout</span>
        </header>
        <div className="gym-select">
          <p className="gym-lead">Who wants to get big?</p>
          <div className="gym-grid">
            {GYM_CAPYS.map((friend) => (
              <button
                key={friend.id}
                type="button"
                className="gym-card"
                style={{ ['--accent' as string]: friend.accent }}
                onClick={() => startTrain(friend)}
              >
                <GymCapy capy={friend} size={108} scale={0.92} />
                <span className="gym-card-name">{friend.name}</span>
                <span className="gym-card-vibe">{friend.vibe}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!capy) return null

  if (phase === 'buff') {
    return (
      <div className="gym-shell done">
        <header className="gym-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="gym-title">Gym star!</h1>
          <span className="gym-chip win">💪</span>
        </header>
        <div className="gym-done">
          <div className="gym-done-banner" role="status">
            {capy.name} got HUGE!
          </div>
          <GymCapy capy={capy} size={210} scale={1.55} celebrating />
          <p className="gym-lead">Biggest capy in the gym.</p>
          <div className="gym-done-actions">
            <button type="button" className="gym-primary" onClick={() => startTrain(capy)}>
              Train again
            </button>
            <button type="button" className="gym-secondary" onClick={() => setPhase('select')}>
              Pick friend
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="gym-shell">
      <header className="gym-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="gym-title">
          {capy.name}
          <small>Capybara Gym</small>
        </h1>
        <span className="gym-chip">{sizeLevel} / {MAX_SIZE}</span>
      </header>

      <div className="gym-progress">
        <span>Size</span>
        <div className="gym-meter">
          <i style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <p className="gym-hint" aria-live="polite">
        {message}
      </p>

      <div className="gym-floor">
        <div className="gym-rack" aria-hidden />
        <div className="gym-mat" aria-hidden />
        <GymCapy capy={capy} size={200} scale={scale} workout={workout} />
      </div>

      <div className="gym-controls">
        {WORKOUTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`gym-workout ${workout === item.id ? 'active' : ''}`}
            onClick={() => doWorkout(item.id)}
          >
            <span aria-hidden>{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
