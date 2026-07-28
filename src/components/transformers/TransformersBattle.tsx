import { useCallback, useEffect, useRef, useState } from 'react'
import { DECEPTICONS, MOVES, type AttackMove } from '../../data/transformers'
import type { SoundKind } from '../../hooks/useSounds'
import { OptimusPrime, type OptimusForm, type OptimusPose } from './OptimusPrime'
import { Robot } from './Robot'
import './transformers.css'

interface TransformersBattleProps {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Phase = 'intro' | 'ready' | 'battle' | 'victory'
type EnemyPose = 'idle' | 'hit' | 'ko' | 'windup' | 'fly'

const TRANSFORM_MS = 1500

export function TransformersBattle({ onBack, playSound }: TransformersBattleProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [form, setForm] = useState<OptimusForm>('truck')
  const [heroPose, setHeroPose] = useState<OptimusPose>('driveIn')
  const [index, setIndex] = useState(0)
  const [hits, setHits] = useState(0)
  const [energon, setEnergon] = useState(0)
  const [stars, setStars] = useState(0)
  const [enemyPose, setEnemyPose] = useState<EnemyPose>('idle')
  const [hint, setHint] = useState('Optimus is rolling in...')
  const [flash, setFlash] = useState<'none' | 'blast' | 'laser' | 'energon'>('none')
  const [busy, setBusy] = useState(false)
  const [dodgeWindow, setDodgeWindow] = useState(false)
  const [combo, setCombo] = useState(0)
  const dodgeTimer = useRef<number | null>(null)
  const attackTimer = useRef<number | null>(null)
  const transformTimer = useRef<number | null>(null)
  const busyRef = useRef(false)

  const enemy = DECEPTICONS[index]
  const needed = enemy?.hitsToDefeat ?? 1
  const hpLeft = Math.max(0, needed - hits)
  const hpPct = enemy ? (hpLeft / needed) * 100 : 0
  const isTruck = form === 'truck'
  const isTransforming = form === 'toRobot' || form === 'toTruck'

  const clearTimers = useCallback(() => {
    if (dodgeTimer.current) window.clearTimeout(dodgeTimer.current)
    if (attackTimer.current) window.clearTimeout(attackTimer.current)
    dodgeTimer.current = null
    attackTimer.current = null
  }, [])

  const scheduleEnemyAttack = useCallback(() => {
    clearTimers()
    attackTimer.current = window.setTimeout(() => {
      if (busyRef.current) return
      setEnemyPose('windup')
      setDodgeWindow(true)
      setHint('DODGE!')
      playSound('tap')

      dodgeTimer.current = window.setTimeout(() => {
        setDodgeWindow(false)
        setEnemyPose('idle')
        setCombo(0)
        setHint('Almost — dodge next time!')
        playSound('hit')
        attackTimer.current = window.setTimeout(() => {
          if (!busyRef.current) scheduleEnemyAttack()
        }, 2200)
      }, 1600)
    }, 3000)
  }, [clearTimers, playSound])

  useEffect(() => {
    playSound('transform')
    const t1 = window.setTimeout(() => {
      setHeroPose('idle')
      setPhase('ready')
      setHint('Tap TRANSFORM!')
    }, 1400)
    return () => {
      window.clearTimeout(t1)
      clearTimers()
      if (transformTimer.current) window.clearTimeout(transformTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    busyRef.current = busy
  }, [busy])

  const finishToRobot = useCallback(
    (enterBattle: boolean) => {
      setForm('robot')
      setHeroPose('idle')
      setBusy(false)
      if (enterBattle) {
        setPhase('battle')
        setHint(`${DECEPTICONS[0].name} appears!`)
        playSound('celebrate')
        scheduleEnemyAttack()
      } else {
        setHint('Robot mode!')
        playSound('celebrate')
        scheduleEnemyAttack()
      }
    },
    [playSound, scheduleEnemyAttack],
  )

  const finishToTruck = useCallback(() => {
    setForm('truck')
    setHeroPose('idle')
    setBusy(false)
    setHint('Truck mode! Tap RAM!')
    playSound('happy')
    scheduleEnemyAttack()
  }, [playSound, scheduleEnemyAttack])

  const morphToRobot = useCallback(
    (enterBattle = false) => {
      if (busy || isTransforming) return
      clearTimers()
      setDodgeWindow(false)
      setBusy(true)
      setForm('toRobot')
      setHint('TRANSFORM!')
      playSound('transform')
      if (transformTimer.current) window.clearTimeout(transformTimer.current)
      transformTimer.current = window.setTimeout(
        () => finishToRobot(enterBattle),
        TRANSFORM_MS,
      )
    },
    [busy, clearTimers, finishToRobot, isTransforming, playSound],
  )

  const morphToTruck = useCallback(() => {
    if (phase !== 'battle' || busy || isTransforming || form !== 'robot') return
    clearTimers()
    setDodgeWindow(false)
    setBusy(true)
    setForm('toTruck')
    setHint('Back to truck!')
    playSound('transform')
    if (transformTimer.current) window.clearTimeout(transformTimer.current)
    transformTimer.current = window.setTimeout(finishToTruck, TRANSFORM_MS)
  }, [busy, clearTimers, finishToTruck, form, isTransforming, phase, playSound])

  const startTransform = () => {
    if (phase !== 'ready') return
    setPhase('battle')
    morphToRobot(true)
  }

  const dodge = () => {
    if (!dodgeWindow || busy) return
    clearTimers()
    setDodgeWindow(false)
    setEnemyPose('idle')
    setCombo((c) => c + 1)
    setEnergon((e) => Math.min(5, e + 1))
    setStars((s) => s + 1)
    setHint(isTruck ? 'Truck dodge!' : 'Nice dodge!')
    playSound('happy')
    scheduleEnemyAttack()
  }

  const advanceOrWin = useCallback(() => {
    setStars((s) => s + 3)
    if (index >= DECEPTICONS.length - 1) {
      clearTimers()
      setPhase('victory')
      setHeroPose('win')
      setHint('Autobots win!')
      playSound('celebrate')
      window.setTimeout(() => {
        setForm('toTruck')
        playSound('transform')
      }, 900)
      window.setTimeout(() => {
        setForm('truck')
        setHeroPose('driveOut')
        setHint('Roll out!')
      }, 900 + TRANSFORM_MS)
      return
    }
    setIndex((i) => i + 1)
    setHits(0)
    setEnemyPose('idle')
    setBusy(false)
    setCombo(0)
    setHint('Next Decepticon!')
    playSound('transform')
    scheduleEnemyAttack()
  }, [clearTimers, index, playSound, scheduleEnemyAttack])

  const attack = useCallback(
    (move: AttackMove) => {
      if (phase !== 'battle' || busy || !enemy || isTransforming) return

      if (move === 'ram' && !isTruck) {
        setHint('Transform to truck first!')
        playSound('tap')
        return
      }
      if (move !== 'ram' && isTruck) {
        setHint('Transform to robot for that move!')
        playSound('tap')
        return
      }

      const moveInfo = MOVES[move]
      if (energon < moveInfo.energonCost) {
        setHint('Need more Energon!')
        playSound('tap')
        return
      }

      clearTimers()
      setDodgeWindow(false)
      setBusy(true)
      setHeroPose(move === 'ram' ? 'ram' : 'attack')
      setEnemyPose(move === 'laser' ? 'fly' : 'hit')
      setFlash(move === 'punch' || move === 'ram' ? 'blast' : move === 'laser' ? 'laser' : 'energon')
      playSound(move === 'laser' || move === 'ram' ? 'blast' : move === 'energon' ? 'transform' : 'hit')

      const weakBonus = enemy.weakness === move ? 1 : 0
      const totalDamage = moveInfo.damage + weakBonus
      const nextHits = Math.min(needed, hits + totalDamage)
      const gainedEnergon = move === 'energon' ? -moveInfo.energonCost : 1

      if (move === 'ram') setHint('TRUCK RAM!')
      else if (weakBonus) setHint(`Super effective ${moveInfo.label}!`)
      else setHint(move === 'energon' ? 'ENERGON SMASH!' : `${moveInfo.label}!`)

      window.setTimeout(() => setFlash('none'), 220)
      window.setTimeout(() => setHeroPose('idle'), 420)

      window.setTimeout(() => {
        setHits(nextHits)
        setEnergon((e) => Math.max(0, Math.min(5, e + gainedEnergon)))
        setCombo((c) => c + 1)
        setStars((s) => s + 1 + weakBonus + (move === 'ram' ? 1 : 0))

        if (nextHits >= needed) {
          setEnemyPose('ko')
          setHint(`${enemy.name} is down!`)
          playSound('celebrate')
          window.setTimeout(advanceOrWin, 1000)
        } else {
          setEnemyPose('idle')
          setBusy(false)
          scheduleEnemyAttack()
        }
      }, 320)
    },
    [
      advanceOrWin,
      busy,
      clearTimers,
      enemy,
      energon,
      hits,
      isTransforming,
      isTruck,
      needed,
      phase,
      playSound,
      scheduleEnemyAttack,
    ],
  )

  const restart = () => {
    clearTimers()
    if (transformTimer.current) window.clearTimeout(transformTimer.current)
    setPhase('intro')
    setForm('truck')
    setHeroPose('driveIn')
    setIndex(0)
    setHits(0)
    setEnergon(0)
    setStars(0)
    setEnemyPose('idle')
    setBusy(false)
    setDodgeWindow(false)
    setCombo(0)
    setHint('Optimus is rolling in...')
    playSound('transform')
    window.setTimeout(() => {
      setHeroPose('idle')
      setPhase('ready')
      setHint('Tap TRANSFORM!')
    }, 1400)
  }

  return (
    <section
      className={`tf-battle flash-${flash} ${dodgeWindow ? 'dodge-mode' : ''}`}
      aria-label="Transformers battle"
    >
      <div className="tf-sky" aria-hidden="true" />
      <div className="tf-ground" aria-hidden="true" />

      <header className="tf-header">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Home
        </button>
        <div className="tf-title-block">
          <h1>Transformers</h1>
          <p>
            {phase === 'victory'
              ? 'Victory!'
              : phase === 'battle'
                ? `Battle ${index + 1} / ${DECEPTICONS.length}`
                : 'Roll out!'}
          </p>
        </div>
        <div className="tf-stars" aria-label={`${stars} stars`}>
          ⭐ {stars}
        </div>
      </header>

      <p className="tf-hint">{hint}</p>

      {phase === 'battle' && enemy && (
        <div className="tf-status-row">
          <div className="tf-hp" aria-label={`${enemy.name} energy`}>
            <span>{enemy.name}</span>
            <div className="tf-hp-track">
              <div className="tf-hp-fill" style={{ width: `${hpPct}%` }} />
            </div>
          </div>
          <div className="tf-energon" aria-label={`Energon ${energon} of 5`}>
            <span>Energon</span>
            <div className="tf-energon-pips">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < energon ? 'filled' : ''} />
              ))}
            </div>
          </div>
          {combo > 1 && <div className="tf-combo">Combo x{combo}</div>}
        </div>
      )}

      <div className={`tf-arena phase-${phase}`}>
        <OptimusPrime
          form={form}
          pose={heroPose}
          onClick={
            phase === 'ready'
              ? startTransform
              : phase === 'battle' && !busy && !dodgeWindow
                ? isTruck
                  ? () => morphToRobot(false)
                  : morphToTruck
                : undefined
          }
        />

        {phase === 'battle' && enemy && (
          <Robot
            profile={enemy}
            pose={enemyPose}
            size="lg"
            mirror
            onClick={() => attack(isTruck ? 'ram' : 'punch')}
          />
        )}

        {phase === 'victory' && form === 'robot' && (
          <div className="tf-victory-badge" aria-hidden="true">
            ⭐
          </div>
        )}
      </div>

      <div className="tf-controls">
        {phase === 'intro' && (
          <button type="button" className="tf-blast transform" disabled>
            Rolling out...
          </button>
        )}

        {phase === 'ready' && (
          <button type="button" className="tf-blast transform" onClick={startTransform}>
            🚛 TRANSFORM!
          </button>
        )}

        {phase === 'battle' && isTransforming && (
          <button type="button" className="tf-blast transform" disabled>
            Transforming...
          </button>
        )}

        {phase === 'battle' &&
          !isTransforming &&
          (dodgeWindow ? (
            <button type="button" className="tf-blast dodge" onClick={dodge}>
              🛡️ DODGE!
            </button>
          ) : (
            <div className="tf-move-row">
              <button
                type="button"
                className={`tf-move transform-toggle ${isTruck ? 'to-robot' : 'to-truck'}`}
                disabled={busy}
                onClick={() => (isTruck ? morphToRobot(false) : morphToTruck())}
              >
                <span aria-hidden="true">{isTruck ? '🤖' : '🚛'}</span>
                {isTruck ? 'Robot' : 'Truck'}
              </button>

              {isTruck ? (
                <button
                  type="button"
                  className="tf-move ram"
                  disabled={busy}
                  onClick={() => attack('ram')}
                >
                  <span aria-hidden="true">{MOVES.ram.emoji}</span>
                  Ram
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="tf-move"
                    disabled={busy}
                    onClick={() => attack('punch')}
                  >
                    <span aria-hidden="true">{MOVES.punch.emoji}</span>
                    Punch
                  </button>
                  <button
                    type="button"
                    className="tf-move laser"
                    disabled={busy}
                    onClick={() => attack('laser')}
                  >
                    <span aria-hidden="true">{MOVES.laser.emoji}</span>
                    Laser
                  </button>
                  <button
                    type="button"
                    className={`tf-move energon ${energon >= MOVES.energon.energonCost ? 'ready' : ''}`}
                    disabled={busy || energon < MOVES.energon.energonCost}
                    onClick={() => attack('energon')}
                  >
                    <span aria-hidden="true">{MOVES.energon.emoji}</span>
                    Energon
                  </button>
                </>
              )}
            </div>
          ))}

        {phase === 'victory' && (
          <>
            <button type="button" className="tf-blast win" onClick={restart}>
              Play again!
            </button>
            <button type="button" className="tf-secondary" onClick={onBack}>
              Back home
            </button>
          </>
        )}
      </div>
    </section>
  )
}
