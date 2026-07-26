import { useCallback, useEffect, useState } from 'react'
import type { ActivityKind } from '../data/careActivities'
import type { DecorItem, HedgehogProfile } from '../data/hedgehogs'
import type { AnimState, CareAction } from '../hooks/useHedgehogCare'
import { usePetStroke } from '../hooks/usePetStroke'
import type { SoundKind } from '../hooks/useSounds'
import { CleanActivity } from './activities/CleanActivity'
import { FeedActivity } from './activities/FeedActivity'
import { SleepActivity } from './activities/SleepActivity'
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
  playSound: (kind: SoundKind) => void
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
  const [activity, setActivity] = useState<ActivityKind | null>(null)
  const [hint, setHint] = useState('Feed, clean, or tuck in!')
  const [particles, setParticles] = useState<Particle[]>([])

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

  const finishSimpleCare = useCallback(
    (action: CareAction) => {
      onCare(action)
      if (action === 'drink') {
        playSound('eat')
        setHint('Sip sip!')
      } else if (action === 'pet') {
        playSound('happy')
        setHint('So soft!')
      }
    },
    [onCare, playSound],
  )

  const onTapTool = (action: CareAction) => {
    if (action === 'pet') {
      setHint('Stroke their back!')
      playSound('tap')
      return
    }
    finishSimpleCare(action)
  }

  const openActivity = (kind: ActivityKind) => {
    playSound('tap')
    setActivity(kind)
  }

  const completeActivity = (action: CareAction, doneHint: string) => {
    onCare(action)
    setHint(doneHint)
    setActivity(null)
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

      <div className="care-stage">
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
          onTap={onTapTool}
          onOpenActivity={openActivity}
        />
        <DecorPicker unlocked={unlockedDecor} active={activeDecor} onSelect={onDecor} />
      </div>

      {activity === 'feed' && (
        <FeedActivity
          profile={profile}
          playSound={playSound}
          onCancel={() => setActivity(null)}
          onComplete={() => completeActivity('feed', 'Tummy full!')}
        />
      )}

      {activity === 'clean' && (
        <CleanActivity
          profile={profile}
          playSound={playSound}
          onCancel={() => setActivity(null)}
          onComplete={() => completeActivity('clean', 'Sparkly clean!')}
        />
      )}

      {activity === 'sleep' && (
        <SleepActivity
          profile={profile}
          playSound={playSound}
          onCancel={() => setActivity(null)}
          onComplete={() => completeActivity('sleep', 'Sweet dreams!')}
        />
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
