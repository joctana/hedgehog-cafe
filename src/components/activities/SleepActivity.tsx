import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { HedgehogProfile } from '../../data/hedgehogs'
import type { SoundKind } from '../../hooks/useSounds'
import { Hedgehog } from '../Hedgehog'
import './activities.css'

interface SleepActivityProps {
  profile: HedgehogProfile
  onComplete: () => void
  onCancel: () => void
  playSound: (kind: SoundKind) => void
}

export function SleepActivity({ profile, onComplete, onCancel, playSound }: SleepActivityProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [cover, setCover] = useState(0)
  const [asleep, setAsleep] = useState(false)
  const [hint, setHint] = useState('Pull the blanket up!')
  const dragging = useRef(false)

  const updateCoverFromY = (clientY: number) => {
    const track = trackRef.current
    if (!track || asleep) return
    const rect = track.getBoundingClientRect()
    const ratio = 1 - (clientY - rect.top) / rect.height
    const next = Math.min(1, Math.max(0, ratio))
    setCover(next)

    if (next >= 0.85) {
      setCover(1)
      setAsleep(true)
      setHint('Night night...')
      playSound('sleep')
      window.setTimeout(onComplete, 1200)
    } else if (next > 0.35) {
      setHint('A little higher...')
    }
  }

  const onBlanketDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (asleep) return
    dragging.current = true
    playSound('tap')
    event.currentTarget.setPointerCapture(event.pointerId)
    updateCoverFromY(event.clientY)

    const onMove = (moveEvent: PointerEvent) => {
      if (!dragging.current) return
      updateCoverFromY(moveEvent.clientY)
    }

    const onUp = () => {
      dragging.current = false
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div
      className={`activity-panel sleep-activity ${asleep || cover > 0.4 ? 'night' : ''}`}
      aria-label="Bedtime"
    >
      <div className="night-sky" aria-hidden="true">
        <span className="moon">🌙</span>
        <span className="star s1">✦</span>
        <span className="star s2">✧</span>
        <span className="star s3">✦</span>
      </div>

      <div className="activity-top">
        <button type="button" className="back-btn" onClick={onCancel}>
          ← Back
        </button>
        <p className="activity-title">Bedtime!</p>
        <div style={{ width: 88 }} aria-hidden="true" />
      </div>

      <p className="care-hint activity-hint">{hint}</p>

      <div className="activity-stage sleep-stage" ref={trackRef}>
        <Hedgehog
          profile={profile}
          size="lg"
          anim={asleep ? 'sleep' : cover > 0.5 ? 'sleep' : 'idle'}
          sleepyEyes={cover > 0.45 || asleep}
        />
        <div
          className={`blanket ${asleep ? 'tucked' : ''}`}
          style={{ transform: `translateY(${(1 - cover) * 70}%)` }}
          onPointerDown={onBlanketDown}
          role="slider"
          aria-label="Blanket"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(cover * 100)}
        >
          <div className="blanket-handle">⬆️ Pull up</div>
        </div>
      </div>
    </div>
  )
}
