import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { DecorItem } from '../data/hedgehogs'
import type { AnimState, CareAction } from '../hooks/useHedgehogCare'
import { usePetStroke } from '../hooks/usePetStroke'
import type { HedgehogProfile } from '../data/hedgehogs'
import { CareTray } from './CareTray'
import { DecorPicker } from './DecorPicker'
import { HappinessMeter } from './HappinessMeter'
import { Hedgehog } from './Hedgehog'

interface CareSceneProps {
  profile: HedgehogProfile
  happiness: number
  doneActions: CareAction[]
  unlockedDecor: DecorItem[]
  activeDecor: DecorItem | null
  anim: AnimState
  heartBurst: number
  celebrating: boolean
  onBack: () => void
  onCare: (action: CareAction) => void
  onDecor: (decor: DecorItem) => void
  onDismissCelebration: () => void
  playSound: (kind: 'tap' | 'happy' | 'eat' | 'sleep' | 'celebrate') => void
}

interface Ghost {
  emoji: string
  x: number
  y: number
}

interface Particle {
  id: number
  left: number
  top: number
  kind: 'heart' | 'sparkle'
}

export function CareScene({
  profile,
  happiness,
  doneActions,
  unlockedDecor,
  activeDecor,
  anim,
  heartBurst,
  celebrating,
  onBack,
  onCare,
  onDecor,
  onDismissCelebration,
  playSound,
}: CareSceneProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [ghost, setGhost] = useState<Ghost | null>(null)
  const [activeTool, setActiveTool] = useState<CareAction | null>(null)
  const [hint, setHint] = useState('Feed, pet, or tuck in!')
  const [particles, setParticles] = useState<Particle[]>([])
  const dragAction = useRef<CareAction | null>(null)

  const spawnParticles = useCallback(() => {
    const next: Particle[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      left: 30 + Math.random() * 40,
      top: 35 + Math.random() * 30,
      kind: i % 2 === 0 ? 'heart' : 'sparkle',
    }))
    setParticles(next)
    window.setTimeout(() => setParticles([]), 1100)
  }, [])

  useEffect(() => {
    if (heartBurst > 0) spawnParticles()
  }, [heartBurst, spawnParticles])

  useEffect(() => {
    if (celebrating) playSound('celebrate')
  }, [celebrating, playSound])

  const handleStrokeComplete = useCallback(() => {
    onCare('pet')
    playSound('happy')
    setHint('So soft!')
  }, [onCare, playSound])

  const { stroking, petHandlers } = usePetStroke({
    onStrokeComplete: handleStrokeComplete,
  })

  const finishCare = useCallback(
    (action: CareAction) => {
      onCare(action)
      if (action === 'feed' || action === 'drink') playSound('eat')
      else if (action === 'nap') playSound('sleep')
      else playSound('happy')

      const hints: Record<CareAction, string> = {
        feed: 'Yum yum!',
        drink: 'Sip sip!',
        pet: 'So soft!',
        brush: 'Spiky and shiny!',
        nap: 'Night night...',
      }
      setHint(hints[action])
    },
    [onCare, playSound],
  )

  const onTapTool = (action: CareAction) => {
    if (action === 'pet') {
      setHint('Stroke their back!')
      playSound('tap')
      return
    }
    finishCare(action)
  }

  const onDragStart = (action: CareAction, emoji: string, event: ReactPointerEvent<HTMLButtonElement>) => {
    dragAction.current = action
    setActiveTool(action)
    setGhost({ emoji, x: event.clientX, y: event.clientY })
    playSound('tap')
    event.currentTarget.setPointerCapture(event.pointerId)

    const onMove = (moveEvent: PointerEvent) => {
      setGhost({ emoji, x: moveEvent.clientX, y: moveEvent.clientY })
    }

    const onUp = (upEvent: PointerEvent) => {
      const stage = stageRef.current
      const actionId = dragAction.current
      dragAction.current = null
      setActiveTool(null)
      setGhost(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)

      if (!stage || !actionId) return
      const rect = stage.getBoundingClientRect()
      const inside =
        upEvent.clientX >= rect.left &&
        upEvent.clientX <= rect.right &&
        upEvent.clientY >= rect.top &&
        upEvent.clientY <= rect.bottom

      if (inside) finishCare(actionId)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <section className="scene care-scene" aria-label={`Caring for ${profile.name}`}>
      <div className="window-glow" aria-hidden="true" />
      <div className="cafe-floor" aria-hidden="true" />

      <header className="care-header">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to café">
          ← Café
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2 className="care-title">{profile.name}</h2>
          <HappinessMeter value={happiness} />
        </div>
        <div style={{ width: 96 }} aria-hidden="true" />
      </header>

      <div className="care-stage" ref={stageRef}>
        <p className="care-hint">{hint}</p>
        <div className="floating-hearts" aria-hidden="true">
          {particles.map((particle) =>
            particle.kind === 'heart' ? (
              <span
                key={particle.id}
                className="heart"
                style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
              >
                ❤️
              </span>
            ) : (
              <span
                key={particle.id}
                className="sparkle"
                style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
              />
            ),
          )}
        </div>
        <Hedgehog
          profile={profile}
          size="lg"
          anim={anim}
          decor={activeDecor}
          stroking={stroking}
          petHandlers={petHandlers}
        />
      </div>

      <div>
        <CareTray
          doneActions={doneActions}
          activeTool={activeTool}
          onTap={onTapTool}
          onDragStart={onDragStart}
        />
        <DecorPicker unlocked={unlockedDecor} active={activeDecor} onSelect={onDecor} />
      </div>

      {ghost && (
        <div className="drag-ghost" style={{ left: ghost.x, top: ghost.y }} aria-hidden="true">
          {ghost.emoji}
        </div>
      )}

      {celebrating && (
        <div className="celebration" role="dialog" aria-label="Celebration">
          <div className="celebration-card">
            <h2>{profile.name} is so happy!</h2>
            <p>You are a wonderful café helper.</p>
            <button type="button" onClick={onDismissCelebration}>
              Yay!
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
