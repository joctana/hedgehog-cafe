import { useCallback, useMemo, useState } from 'react'
import { BLUEY_CHARACTERS, type BlueyCharacter } from '../../data/blueyCharacters'
import type { SoundKind } from '../../hooks/useSounds'
import {
  BlueyPup,
  HAIR_TUFTS,
  TUFT_TARGETS,
  type HairTuftId,
} from './BlueyPup'
import './bluey.css'

type Phase = 'select' | 'cut' | 'done'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Tool = 'scissors' | 'clippers'

type Clipping = {
  id: number
  x: number
  y: number
  color: string
  rot: number
}

export function BlueyBarber({ onBack, playSound }: Props) {
  const [phase, setPhase] = useState<Phase>('select')
  const [character, setCharacter] = useState<BlueyCharacter | null>(null)
  const [cutTufts, setCutTufts] = useState<Set<HairTuftId>>(() => new Set())
  const [tool, setTool] = useState<Tool>('scissors')
  const [clippings, setClippings] = useState<Clipping[]>([])
  const [clipId, setClipId] = useState(0)

  const cutProgress = cutTufts.size / HAIR_TUFTS.length

  const startCut = (picked: BlueyCharacter) => {
    setCharacter(picked)
    setCutTufts(new Set())
    setClippings([])
    setTool('scissors')
    setPhase('cut')
    playSound('celebrate')
  }

  const snip = useCallback(
    (tuft: HairTuftId, clientX?: number, clientY?: number) => {
      if (!character || phase !== 'cut') return

      setCutTufts((prev) => {
        if (prev.has(tuft)) return prev
        const next = new Set(prev)
        next.add(tuft)

        playSound(tool === 'clippers' ? 'whoosh' : 'tap')

        const color = Math.random() > 0.5 ? character.patch : character.coat
        const baseX = clientX ?? window.innerWidth / 2
        const baseY = clientY ?? window.innerHeight / 2
        const startId = clipId
        const burst: Clipping[] = Array.from({ length: 5 }, (_, i) => ({
          id: startId + i,
          x: baseX + (Math.random() - 0.5) * 40,
          y: baseY + (Math.random() - 0.5) * 20,
          color,
          rot: Math.random() * 360,
        }))
        setClipId((n) => n + 5)
        setClippings((c) => [...c, ...burst])
        window.setTimeout(() => {
          setClippings((c) => c.filter((p) => !burst.some((b) => b.id === p.id)))
        }, 900)

        if (next.size >= HAIR_TUFTS.length) {
          window.setTimeout(() => {
            setPhase('done')
            playSound('celebrate')
          }, 350)
        }

        return next
      })
    },
    [character, phase, tool, clipId, playSound],
  )

  const remaining = useMemo(
    () => HAIR_TUFTS.filter((t) => !cutTufts.has(t)).length,
    [cutTufts],
  )

  if (phase === 'select') {
    return (
      <div className="bluey-shell">
        <header className="bluey-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="bluey-title">Bluey Barber</h1>
          <span className="bluey-chip">Haircuts!</span>
        </header>
        <div className="bluey-select">
          <p className="bluey-lead">Who needs a haircut?</p>
          <div className="bluey-grid">
            {BLUEY_CHARACTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="bluey-card"
                style={{
                  ['--accent' as string]: c.accent,
                  ['--coat' as string]: c.coat,
                }}
                onClick={() => startCut(c)}
              >
                <BlueyPup character={c} cutProgress={0} cutTufts={new Set()} size={110} />
                <span className="bluey-card-name">{c.name}</span>
                <span className="bluey-card-role">{c.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!character) return null

  if (phase === 'done') {
    return (
      <div className="bluey-shell done">
        <header className="bluey-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="bluey-title">All done!</h1>
          <span className="bluey-chip win">⭐</span>
        </header>
        <div className="bluey-done">
          <div className="bluey-done-banner" role="status">
            Looking gorgeous, {character.name}!
          </div>
          <div className="bluey-chair done-chair">
            <BlueyPup
              character={character}
              cutProgress={1}
              cutTufts={new Set(HAIR_TUFTS)}
              size={240}
              happy
            />
            <div className="bluey-cape" aria-hidden />
          </div>
          <div className="bluey-done-actions">
            <button
              type="button"
              className="bluey-primary"
              onClick={() => startCut(character)}
            >
              Cut again
            </button>
            <button type="button" className="bluey-secondary" onClick={() => setPhase('select')}>
              Pick friend
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bluey-shell">
      <header className="bluey-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="bluey-title">
          {character.name}
          <small>Barber shop</small>
        </h1>
        <span className="bluey-chip">{remaining} left</span>
      </header>

      <div className="bluey-progress">
        <span>Haircut</span>
        <div className="bluey-meter">
          <i style={{ width: `${cutProgress * 100}%` }} />
        </div>
      </div>

      <p className="bluey-hint">
        Tap the fluffy bits with your {tool === 'scissors' ? 'scissors' : 'clippers'}!
      </p>

      <div className="bluey-shop">
        <div className="bluey-mirror" aria-hidden />
        <div className="bluey-chair">
          <BlueyPup
            character={character}
            cutProgress={cutProgress}
            cutTufts={cutTufts}
            size={230}
          />
          <div className="bluey-cape" aria-hidden />

          {HAIR_TUFTS.map((tuft) => {
            if (cutTufts.has(tuft)) return null
            const t = TUFT_TARGETS[tuft]
            return (
              <button
                key={tuft}
                type="button"
                className={`bluey-tuft-hit tool-${tool}`}
                style={{ left: t.left, top: t.top }}
                aria-label={`Cut ${t.label}`}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId)
                  snip(tuft, e.clientX, e.clientY)
                }}
              />
            )
          })}
        </div>
      </div>

      <div className="bluey-tools">
        <button
          type="button"
          className={`bluey-tool ${tool === 'scissors' ? 'active' : ''}`}
          onClick={() => {
            setTool('scissors')
            playSound('tap')
          }}
        >
          ✂️ Scissors
        </button>
        <button
          type="button"
          className={`bluey-tool ${tool === 'clippers' ? 'active' : ''}`}
          onClick={() => {
            setTool('clippers')
            playSound('whoosh')
          }}
        >
          💈 Clippers
        </button>
      </div>

      <div className="bluey-clippings" aria-hidden>
        {clippings.map((c) => (
          <span
            key={c.id}
            className="bluey-clip"
            style={{
              left: c.x,
              top: c.y,
              background: c.color,
              transform: `rotate(${c.rot}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
