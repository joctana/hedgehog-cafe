import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { FEED_BITES_NEEDED, FOODS } from '../../data/careActivities'
import type { HedgehogProfile } from '../../data/hedgehogs'
import type { SoundKind } from '../../hooks/useSounds'
import { Hedgehog } from '../Hedgehog'
import './activities.css'

interface FeedActivityProps {
  profile: HedgehogProfile
  onComplete: () => void
  onCancel: () => void
  playSound: (kind: SoundKind) => void
}

export function FeedActivity({ profile, onComplete, onCancel, playSound }: FeedActivityProps) {
  const mouthRef = useRef<HTMLDivElement>(null)
  const [bites, setBites] = useState(0)
  const [ghost, setGhost] = useState<{ emoji: string; x: number; y: number } | null>(null)
  const [eating, setEating] = useState(false)
  const [hint, setHint] = useState('Drag a snack to their mouth!')
  const [finished, setFinished] = useState(false)
  const dragEmoji = useRef<string | null>(null)

  const registerBite = (emoji: string) => {
    if (finished) return
    playSound('eat')
    setEating(true)
    window.setTimeout(() => setEating(false), 500)
    setHint(`${emoji} Yum yum!`)

    setBites((prev) => {
      const next = prev + 1
      if (next >= FEED_BITES_NEEDED) {
        setFinished(true)
        setHint('Tummy full!')
        playSound('happy')
        window.setTimeout(onComplete, 700)
      }
      return next
    })
  }

  const onFoodDown = (emoji: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (finished) return
    dragEmoji.current = emoji
    setGhost({ emoji, x: event.clientX, y: event.clientY })
    playSound('tap')
    event.currentTarget.setPointerCapture(event.pointerId)

    const onMove = (moveEvent: PointerEvent) => {
      setGhost({ emoji, x: moveEvent.clientX, y: moveEvent.clientY })
    }

    const onUp = (upEvent: PointerEvent) => {
      const mouth = mouthRef.current
      const food = dragEmoji.current
      dragEmoji.current = null
      setGhost(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)

      if (!mouth || !food) return
      const rect = mouth.getBoundingClientRect()
      const pad = 28
      const inside =
        upEvent.clientX >= rect.left - pad &&
        upEvent.clientX <= rect.right + pad &&
        upEvent.clientY >= rect.top - pad &&
        upEvent.clientY <= rect.bottom + pad

      if (inside) registerBite(food)
      else setHint('Drop it on their mouth!')
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div className="activity-panel feed-activity" aria-label="Feeding time">
      <div className="activity-top">
        <button type="button" className="back-btn" onClick={onCancel}>
          ← Back
        </button>
        <p className="activity-title">Snack time!</p>
        <div className="bite-meter" aria-label={`${bites} of ${FEED_BITES_NEEDED} bites`}>
          {Array.from({ length: FEED_BITES_NEEDED }, (_, i) => (
            <span key={i} className={i < bites ? 'filled' : ''}>
              🍽️
            </span>
          ))}
        </div>
      </div>

      <p className="care-hint activity-hint">{hint}</p>

      <div className="activity-stage">
        <div className="mouth-target" ref={mouthRef} aria-hidden="true" />
        <Hedgehog profile={profile} size="lg" anim={eating ? 'eat' : 'idle'} />
      </div>

      <div className="food-tray" role="toolbar" aria-label="Snacks">
        {FOODS.map((food) => (
          <button
            key={food.id}
            type="button"
            className="care-tool food-tool"
            aria-label={food.label}
            onPointerDown={(event) => onFoodDown(food.emoji, event)}
          >
            <span aria-hidden="true">{food.emoji}</span>
          </button>
        ))}
      </div>

      {ghost && (
        <div className="drag-ghost" style={{ left: ghost.x, top: ghost.y }} aria-hidden="true">
          {ghost.emoji}
        </div>
      )}
    </div>
  )
}
