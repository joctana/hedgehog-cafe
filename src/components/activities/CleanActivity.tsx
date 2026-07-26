import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { CLEAN_SPOTS_NEEDED, createDirtSpots } from '../../data/careActivities'
import type { HedgehogProfile } from '../../data/hedgehogs'
import type { SoundKind } from '../../hooks/useSounds'
import { Hedgehog } from '../Hedgehog'
import './activities.css'

interface CleanActivityProps {
  profile: HedgehogProfile
  onComplete: () => void
  onCancel: () => void
  playSound: (kind: SoundKind) => void
}

interface Bubble {
  id: number
  left: number
  top: number
}

export function CleanActivity({ profile, onComplete, onCancel, playSound }: CleanActivityProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const spots = useMemo(() => createDirtSpots(), [])
  const cleanedRef = useRef<Set<string>>(new Set())
  const [cleaned, setCleaned] = useState<string[]>([])
  const [scrubbing, setScrubbing] = useState(false)
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [hint, setHint] = useState('Drag the sponge onto the dirt!')
  const [finished, setFinished] = useState(false)
  const dragging = useRef(false)
  const completing = useRef(false)

  const spawnBubbles = (x: number, y: number) => {
    const id = Date.now()
    setBubbles([
      { id, left: x, top: y },
      { id: id + 1, left: x + 6, top: y - 8 },
    ])
    window.setTimeout(() => setBubbles([]), 900)
  }

  const tryCleanAt = (clientX: number, clientY: number) => {
    if (finished || completing.current || !stageRef.current) return
    const stageRect = stageRef.current.getBoundingClientRect()

    for (const spot of spots) {
      if (cleanedRef.current.has(spot.id)) continue
      const spotX = stageRect.left + (spot.x / 100) * stageRect.width
      const spotY = stageRect.top + (spot.y / 100) * stageRect.height
      const dist = Math.hypot(clientX - spotX, clientY - spotY)
      if (dist < 48) {
        cleanedRef.current.add(spot.id)
        const next = [...cleanedRef.current]
        setCleaned(next)
        playSound('wash')
        spawnBubbles(spot.x, spot.y)

        if (next.length >= CLEAN_SPOTS_NEEDED) {
          completing.current = true
          setFinished(true)
          setHint('Sparkly clean!')
          playSound('bubble')
          window.setTimeout(onComplete, 800)
        } else {
          setHint('Keep scrubbing!')
        }
        break
      }
    }
  }

  const onSpongeDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (finished) return
    dragging.current = true
    setScrubbing(true)
    setGhost({ x: event.clientX, y: event.clientY })
    playSound('tap')
    event.currentTarget.setPointerCapture(event.pointerId)

    const onMove = (moveEvent: PointerEvent) => {
      if (!dragging.current) return
      setGhost({ x: moveEvent.clientX, y: moveEvent.clientY })
      tryCleanAt(moveEvent.clientX, moveEvent.clientY)
    }

    const onUp = () => {
      dragging.current = false
      setScrubbing(false)
      setGhost(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div className="activity-panel clean-activity" aria-label="Bath time">
      <div className="activity-top">
        <button type="button" className="back-btn" onClick={onCancel}>
          ← Back
        </button>
        <p className="activity-title">Bath time!</p>
        <div className="bite-meter" aria-label={`${cleaned.length} of ${CLEAN_SPOTS_NEEDED} clean`}>
          {Array.from({ length: CLEAN_SPOTS_NEEDED }, (_, i) => (
            <span key={i} className={i < cleaned.length ? 'filled' : ''}>
              ✨
            </span>
          ))}
        </div>
      </div>

      <p className="care-hint activity-hint">{hint}</p>

      <div className="activity-stage dirty-stage" ref={stageRef}>
        <Hedgehog
          profile={profile}
          size="lg"
          anim={scrubbing ? 'clean' : finished ? 'happy' : 'idle'}
        />
        {spots.map((spot) =>
          cleaned.includes(spot.id) ? null : (
            <span
              key={spot.id}
              className="dirt-spot"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-hidden="true"
            />
          ),
        )}
        {bubbles.map((bubble) => (
          <span
            key={bubble.id}
            className="soap-bubble"
            style={{ left: `${bubble.left}%`, top: `${bubble.top}%` }}
            aria-hidden="true"
          >
            🫧
          </span>
        ))}
      </div>

      <div className="food-tray">
        <button
          type="button"
          className={`care-tool food-tool ${scrubbing ? 'dragging' : ''}`}
          aria-label="Sponge"
          onPointerDown={onSpongeDown}
        >
          <span aria-hidden="true">🧽</span>
        </button>
      </div>

      {ghost && (
        <div className="drag-ghost" style={{ left: ghost.x, top: ghost.y }} aria-hidden="true">
          🧽
        </div>
      )}
    </div>
  )
}
