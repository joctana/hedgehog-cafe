import { useCallback, useEffect, useState } from 'react'
import { DECEPTICONS, OPTIMUS } from '../../data/transformers'
import type { SoundKind } from '../../hooks/useSounds'
import { Robot } from './Robot'
import './transformers.css'

interface TransformersBattleProps {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type EnemyPose = 'idle' | 'hit' | 'ko'
type HeroPose = 'idle' | 'attack' | 'win'

export function TransformersBattle({ onBack, playSound }: TransformersBattleProps) {
  const [index, setIndex] = useState(0)
  const [hits, setHits] = useState(0)
  const [heroPose, setHeroPose] = useState<HeroPose>('idle')
  const [enemyPose, setEnemyPose] = useState<EnemyPose>('idle')
  const [hint, setHint] = useState('Tap BLAST or the Decepticon!')
  const [flash, setFlash] = useState(false)
  const [won, setWon] = useState(false)
  const [busy, setBusy] = useState(false)

  const enemy = DECEPTICONS[index]
  const needed = enemy?.hitsToDefeat ?? 1
  const hpLeft = Math.max(0, needed - hits)
  const hpPct = enemy ? (hpLeft / needed) * 100 : 0

  useEffect(() => {
    if (!enemy) return
    setHint(enemy.taunt)
  }, [enemy])

  const advanceOrWin = useCallback(() => {
    if (index >= DECEPTICONS.length - 1) {
      setWon(true)
      setHeroPose('win')
      setHint('Autobots win!')
      playSound('celebrate')
      return
    }
    setIndex((i) => i + 1)
    setHits(0)
    setEnemyPose('idle')
    setBusy(false)
    playSound('transform')
  }, [index, playSound])

  const blast = useCallback(() => {
    if (busy || won || !enemy) return
    setBusy(true)
    setHeroPose('attack')
    setEnemyPose('hit')
    setFlash(true)
    playSound('blast')
    setHint('BOOM!')

    window.setTimeout(() => setFlash(false), 180)
    window.setTimeout(() => setHeroPose('idle'), 350)

    const nextHits = hits + 1
    window.setTimeout(() => {
      if (nextHits >= needed) {
        setHits(needed)
        setEnemyPose('ko')
        setHint(`${enemy.name} is down!`)
        playSound('hit')
        window.setTimeout(advanceOrWin, 900)
      } else {
        setHits(nextHits)
        setEnemyPose('idle')
        setHint('Again! Keep blasting!')
        playSound('hit')
        setBusy(false)
      }
    }, 280)
  }, [advanceOrWin, busy, enemy, hits, needed, playSound, won])

  const restart = () => {
    setIndex(0)
    setHits(0)
    setHeroPose('idle')
    setEnemyPose('idle')
    setWon(false)
    setBusy(false)
    setHint('Tap BLAST or the Decepticon!')
    playSound('transform')
  }

  return (
    <section className={`tf-battle ${flash ? 'flash' : ''}`} aria-label="Transformers battle">
      <div className="tf-sky" aria-hidden="true" />
      <div className="tf-ground" aria-hidden="true" />

      <header className="tf-header">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Home
        </button>
        <div className="tf-title-block">
          <h1>Transformers</h1>
          <p>{won ? 'Victory!' : `Battle ${index + 1} / ${DECEPTICONS.length}`}</p>
        </div>
        <div style={{ width: 96 }} aria-hidden="true" />
      </header>

      <p className="tf-hint">{hint}</p>

      {!won && enemy && (
        <div className="tf-hp" aria-label={`${enemy.name} energy`}>
          <span>{enemy.name}</span>
          <div className="tf-hp-track">
            <div className="tf-hp-fill" style={{ width: `${hpPct}%` }} />
          </div>
        </div>
      )}

      <div className="tf-arena">
        <Robot profile={OPTIMUS} pose={heroPose} size="lg" />
        {!won && enemy ? (
          <Robot
            profile={enemy}
            pose={enemyPose}
            size="lg"
            mirror
            onClick={blast}
          />
        ) : (
          <div className="tf-victory-badge" aria-hidden="true">
            ⚡
          </div>
        )}
      </div>

      <div className="tf-controls">
        {won ? (
          <>
            <button type="button" className="tf-blast win" onClick={restart}>
              Play again!
            </button>
            <button type="button" className="tf-secondary" onClick={onBack}>
              Back home
            </button>
          </>
        ) : (
          <button
            type="button"
            className="tf-blast"
            onClick={blast}
            disabled={busy}
            aria-label="Blast"
          >
            💥 BLAST!
          </button>
        )}
      </div>
    </section>
  )
}
