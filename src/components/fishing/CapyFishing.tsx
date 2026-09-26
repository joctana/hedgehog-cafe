import { useRef, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { FisherCapy } from './FisherCapy'
import { MealView } from './MealView'
import { RiverFish, type FishKind } from './RiverFish'
import './fishing.css'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Phase = 'catch' | 'cook' | 'eat' | 'done'
type CookStage = 'raw' | 'clean' | 'grill' | 'plated'

type Swimmer = {
  id: number
  kind: FishKind
  lane: number
  duration: number
  delay: number
  reverse: boolean
  rest: number
  caught: boolean
}

const GOAL = 4
const BITES = 4
const KINDS: FishKind[] = ['koi', 'blue', 'gold', 'pink']

let fishSerial = 1

function makeFish(lane: number): Swimmer {
  fishSerial += 1
  return {
    id: fishSerial,
    kind: KINDS[Math.floor(Math.random() * KINDS.length)],
    lane,
    duration: 7 + Math.random() * 6,
    delay: -Math.random() * 8,
    reverse: Math.random() > 0.5,
    rest: 8 + Math.random() * 70,
    caught: false,
  }
}

function stockPond(): Swimmer[] {
  return [0, 1, 2, 3, 1].map((lane, index) => {
    const fish = makeFish(lane)
    fish.delay = -index * 1.6
    return fish
  })
}

const COOK_ORDER: CookStage[] = ['raw', 'clean', 'grill', 'plated']

const COOK_HINT: Record<CookStage, string> = {
  raw: 'Tap Clean to rinse the fish!',
  clean: 'Tap Grill — onto the fire!',
  grill: 'Tap Plate when they look golden!',
  plated: 'They smell yummy. Time to eat!',
}

export function CapyFishing({ onBack, playSound }: Props) {
  const [phase, setPhase] = useState<Phase>('catch')
  const [fish, setFish] = useState<Swimmer[]>(() => stockPond())
  const [bucket, setBucket] = useState(0)
  const [caughtKinds, setCaughtKinds] = useState<FishKind[]>([])
  const [scooping, setScooping] = useState(false)
  const [cookStage, setCookStage] = useState<CookStage>('raw')
  const [bitesLeft, setBitesLeft] = useState(BITES)
  const [chewing, setChewing] = useState(false)
  const [message, setMessage] = useState('Tap a fish to help Carlos catch it!')
  const catching = useRef(new Set<number>())

  const catchFish = (swimmer: Swimmer) => {
    if (phase !== 'catch' || catching.current.has(swimmer.id) || swimmer.caught) return
    catching.current.add(swimmer.id)
    const total = catching.current.size
    setFish((current) => current.map((item) => (item.id === swimmer.id ? { ...item, caught: true } : item)))
    setBucket(total)
    setCaughtKinds((current) => [...current, swimmer.kind])
    setScooping(true)
    window.setTimeout(() => setScooping(false), 460)
    playSound('bubble')
    setMessage(total >= GOAL ? 'Four fish! Carlos can cook now.' : `${total} of ${GOAL} fish in the bucket!`)

    if (total >= GOAL) {
      window.setTimeout(() => {
        setPhase('cook')
        setMessage(COOK_HINT.raw)
        playSound('celebrate')
      }, 700)
      return
    }

    window.setTimeout(() => {
      setFish((current) => current.filter((item) => item.id !== swimmer.id).concat(makeFish(swimmer.lane)))
    }, 480)
  }

  const cook = (stage: CookStage) => {
    if (phase !== 'cook') return
    const index = COOK_ORDER.indexOf(cookStage)
    const wanted = COOK_ORDER[index + 1]
    if (stage !== wanted) {
      setMessage(COOK_HINT[cookStage])
      playSound('tap')
      return
    }
    setCookStage(stage)
    if (stage === 'clean') {
      playSound('wash')
      setMessage(COOK_HINT.clean)
    } else if (stage === 'grill') {
      playSound('whoosh')
      setMessage('Sizzle! They are getting golden.')
    } else {
      playSound('happy')
      setMessage(COOK_HINT.plated)
    }
  }

  const startEating = () => {
    if (phase !== 'cook' || cookStage !== 'plated') return
    setPhase('eat')
    setBitesLeft(BITES)
    setMessage('Tap the plate for a bite!')
    playSound('happy')
  }

  const takeBite = () => {
    if (phase !== 'eat' || bitesLeft <= 0) return
    const next = bitesLeft - 1
    setBitesLeft(next)
    setChewing(true)
    window.setTimeout(() => setChewing(false), 380)
    playSound('eat')
    if (next <= 0) {
      setMessage('Carlos ate every fish!')
      window.setTimeout(() => {
        setPhase('done')
        playSound('celebrate')
      }, 700)
    } else {
      setMessage(next === 1 ? 'One bite left!' : 'Yum! Another bite?')
    }
  }

  const playAgain = () => {
    catching.current = new Set()
    fishSerial += 10
    setFish(stockPond())
    setBucket(0)
    setCaughtKinds([])
    setCookStage('raw')
    setBitesLeft(BITES)
    setPhase('catch')
    setMessage('Tap a fish to help Carlos catch it!')
    playSound('celebrate')
  }

  const phaseIndex = phase === 'catch' ? 0 : phase === 'cook' ? 1 : 2

  return (
    <div className={`fish-shell phase-${phase}`}>
      <header className="fish-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="fish-title">
          {phase === 'done' ? 'Full tummy!' : 'Capy Fishing'}
          <small>{phase === 'done' ? 'Carlos ate every fish.' : message}</small>
        </h1>
        <span className="fish-chip">
          {phase === 'catch' ? `🐟 ${bucket}/${GOAL}` : phase === 'eat' ? `🍽️ ${bitesLeft}` : phase === 'done' ? '😋' : '🔥'}
        </span>
      </header>

      <ol className="fish-phases" aria-label="Story">
        {['Catch', 'Cook', 'Eat'].map((label, index) => (
          <li key={label} className={index < phaseIndex || phase === 'done' ? 'done' : index === phaseIndex ? 'now' : ''}>
            {label}
          </li>
        ))}
      </ol>

      {phase === 'catch' && (
        <div className="pond">
          <div className="water">
            <span className="lily lily-a" aria-hidden />
            <span className="lily lily-b" aria-hidden />
            {fish.map((swimmer) => (
              <button
                key={swimmer.id}
                type="button"
                className={`river-fish lane-${swimmer.lane} ${swimmer.reverse ? 'reverse' : ''} ${swimmer.caught ? 'caught' : ''}`}
                style={{
                  animationDuration: `${swimmer.duration}s`,
                  animationDelay: `${swimmer.delay}s`,
                  ['--rest' as string]: `${swimmer.rest}%`,
                }}
                aria-label={`Catch the ${swimmer.kind} fish`}
                onClick={() => catchFish(swimmer)}
              >
                <RiverFish kind={swimmer.kind} size="clamp(96px, 16vw, 150px)" flip={swimmer.reverse} />
              </button>
            ))}
          </div>
          <div className="bank">
            <FisherCapy size="clamp(120px, 18vh, 190px)" scooping={scooping} />
            <div className="bucket" aria-hidden>
              <span className="bucket-body" />
              <span className="bucket-fish">
                {caughtKinds.map((kind, index) => (
                  <RiverFish key={`${kind}-${index}`} kind={kind} size={54} />
                ))}
              </span>
            </div>
          </div>
        </div>
      )}

      {phase === 'cook' && (
        <div className="cook-stage">
          <FisherCapy size="clamp(120px, 22vh, 200px)" cooking={cookStage === 'grill'} />
          <div className="cook-meal">
            <MealView stage={cookStage} count={GOAL} size={340} />
            <p className="cook-label">{COOK_HINT[cookStage]}</p>
          </div>
        </div>
      )}

      {phase === 'eat' && (
        <div className="eat-stage">
          <FisherCapy size="clamp(140px, 28vh, 240px)" eating={chewing} showNet={false} />
          <button type="button" className="eat-plate" onClick={takeBite} aria-label="Take a bite">
            <MealView stage="plated" count={bitesLeft} size={300} />
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div className="fish-done">
          <FisherCapy size={200} eating showNet={false} />
          <MealView stage="plated" count={0} size={220} />
          <p className="fish-lead">Four fish, cooked and eaten.</p>
          <div className="fish-done-actions">
            <button type="button" className="fish-again" onClick={playAgain}>
              Fish again
            </button>
            <button type="button" className="fish-home" onClick={onBack}>
              Games
            </button>
          </div>
        </div>
      )}

      {phase === 'cook' && (
        <div className="fish-actions" role="toolbar" aria-label="Cooking steps">
          <button type="button" className={`fish-action ${cookStage === 'raw' ? 'next' : ''}`} onClick={() => cook('clean')}>
            <span aria-hidden>🚿</span>Clean
          </button>
          <button type="button" className={`fish-action ${cookStage === 'clean' ? 'next' : ''}`} onClick={() => cook('grill')}>
            <span aria-hidden>🔥</span>Grill
          </button>
          <button type="button" className={`fish-action ${cookStage === 'grill' ? 'next' : ''}`} onClick={() => cook('plated')}>
            <span aria-hidden>🍽️</span>Plate
          </button>
          <button
            type="button"
            className={`fish-action eat ${cookStage === 'plated' ? 'next' : 'idle'}`}
            onClick={startEating}
          >
            <span aria-hidden>😋</span>Eat
          </button>
        </div>
      )}

      {phase === 'eat' && (
        <div className="fish-actions">
          <button type="button" className="fish-action next bite" onClick={takeBite}>
            <span aria-hidden>😋</span>Bite!
          </button>
        </div>
      )}
    </div>
  )
}
