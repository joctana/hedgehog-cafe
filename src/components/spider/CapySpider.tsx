import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { SpiderCapy } from './SpiderCapy'
import { Troublemaker, baddieLabel, type BaddieKind } from './Troublemaker'
import './spider.css'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Baddie = {
  id: number
  kind: BaddieKind
  x: number
  y: number
  drift: number
  duration: number
  caught: boolean
}

type WebShot = {
  id: number
  len: number
  angle: number
  ox: number
  oy: number
}

const GOAL = 5
const KINDS: BaddieKind[] = ['snatcher', 'bot', 'gloom']
const SPOTS = [
  { x: 6, y: 8 },
  { x: 58, y: 4 },
  { x: 30, y: 18 },
  { x: 14, y: 32 },
  { x: 64, y: 26 },
]

let serial = 1

function makeBaddie(slot: number): Baddie {
  serial += 1
  const spot = SPOTS[slot % SPOTS.length]
  return {
    id: serial,
    kind: KINDS[serial % KINDS.length],
    x: spot.x,
    y: spot.y,
    drift: 16 + (serial % 5) * 6,
    duration: 2.6 + (serial % 4) * 0.35,
    caught: false,
  }
}

function stock(): Baddie[] {
  return [0, 1, 2].map(makeBaddie)
}

export function CapySpider({ onBack, playSound }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const wristRef = useRef<HTMLSpanElement>(null)
  const caughtIds = useRef(new Set<number>())
  const webSerial = useRef(0)
  const [baddies, setBaddies] = useState<Baddie[]>(() => stock())
  const [webs, setWebs] = useState<WebShot[]>([])
  const [caught, setCaught] = useState(0)
  const [shooting, setShooting] = useState(false)
  const [phase, setPhase] = useState<'play' | 'done'>('play')
  const [message, setMessage] = useState('Tap a bad guy to shoot a web!')

  const shootTo = (x: number, y: number) => {
    const stage = stageRef.current
    const wrist = wristRef.current
    if (!stage || !wrist) return
    const rect = stage.getBoundingClientRect()
    const wristBox = wrist.getBoundingClientRect()
    const ox = wristBox.left + wristBox.width / 2 - rect.left
    const oy = wristBox.top + wristBox.height / 2 - rect.top
    const dx = x - ox
    const dy = y - oy
    webSerial.current += 1
    const id = webSerial.current
    setWebs((current) => [
      ...current,
      { id, len: Math.hypot(dx, dy), angle: (Math.atan2(dy, dx) * 180) / Math.PI, ox, oy },
    ])
    setShooting(true)
    window.setTimeout(() => setShooting(false), 280)
    window.setTimeout(() => setWebs((current) => current.filter((web) => web.id !== id)), 680)
  }

  const pointInStage = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const onSky = (event: MouseEvent<HTMLDivElement>) => {
    if (phase !== 'play') return
    if (event.target !== event.currentTarget) return
    const point = pointInStage(event.clientX, event.clientY)
    shootTo(point.x, point.y)
    playSound('whoosh')
    setMessage('Thwip! Now catch a bad guy.')
  }

  const catchBaddie = (baddie: Baddie, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (phase !== 'play') return
    const box = event.currentTarget.getBoundingClientRect()
    const point = pointInStage(box.left + box.width / 2, box.top + box.height / 2)
    shootTo(point.x, point.y)
    playSound('whoosh')

    if (baddie.caught || caughtIds.current.has(baddie.id)) return
    caughtIds.current.add(baddie.id)
    const total = caughtIds.current.size
    setBaddies((current) => current.map((item) => (item.id === baddie.id ? { ...item, caught: true } : item)))
    setCaught(total)
    window.setTimeout(() => playSound('hit'), 180)

    if (total >= GOAL) {
      setMessage('The city is safe!')
      window.setTimeout(() => {
        setPhase('done')
        playSound('celebrate')
      }, 650)
      return
    }

    setMessage('Gotcha! Wrapped up.')
    const slot = baddie.id
    window.setTimeout(() => {
      setBaddies((current) => current.map((item) => (item.id === baddie.id ? makeBaddie(slot) : item)))
    }, 720)
  }

  const playAgain = () => {
    caughtIds.current = new Set()
    setBaddies(stock())
    setWebs([])
    setCaught(0)
    setPhase('play')
    setMessage('Tap a bad guy to shoot a web!')
    playSound('celebrate')
  }

  return (
    <div className={`sp-shell ${phase === 'done' ? 'done' : ''}`}>
      <header className="sp-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="sp-title">
          {phase === 'done' ? 'City saved!' : 'Capybara Spiderman'}
          <small>{phase === 'done' ? 'Every troublemaker is tangled.' : message}</small>
        </h1>
        <span className="sp-chip">🕸️ {phase === 'done' ? GOAL : caught}/{GOAL}</span>
      </header>

      {phase === 'done' ? (
        <div className="sp-done">
          <SpiderCapy size={210} />
          <div className="sp-done-row">
            {KINDS.map((kind) => (
              <Troublemaker key={kind} kind={kind} webbed size={110} />
            ))}
          </div>
          <p className="sp-lead">Webs wrapped the bad guys. Nobody got hurt.</p>
          <div className="sp-done-actions">
            <button type="button" className="sp-again" onClick={playAgain}>
              Web again
            </button>
            <button type="button" className="sp-home" onClick={onBack}>
              Games
            </button>
          </div>
        </div>
      ) : (
        <div className="sp-stage" ref={stageRef} onClick={onSky}>
          <div className="skyline" aria-hidden>
            <span className="moon" />
            <span className="bldg b1" />
            <span className="bldg b2" />
            <span className="bldg b3" />
            <span className="bldg b4" />
            <span className="bldg b5" />
          </div>

          {baddies.map((baddie) => (
            <button
              key={baddie.id}
              type="button"
              className={`baddie ${baddie.caught ? 'caught' : ''}`}
              style={{
                left: `${baddie.x}%`,
                top: `${baddie.y}%`,
                ['--drift' as string]: `${baddie.drift}px`,
                animationDuration: `${baddie.duration}s`,
              }}
              aria-label={baddie.caught ? `${baddieLabel(baddie.kind)} is webbed` : `Shoot a web at the ${baddieLabel(baddie.kind)}`}
              onClick={(event) => catchBaddie(baddie, event)}
            >
              <Troublemaker kind={baddie.kind} webbed={baddie.caught} />
            </button>
          ))}

          {webs.map((web) => (
            <span
              key={web.id}
              className="web-shot"
              style={{
                left: web.ox,
                top: web.oy,
                width: web.len,
                ['--angle' as string]: `${web.angle}deg`,
              }}
            />
          ))}

          <div className="hero">
            <SpiderCapy size="clamp(150px, 28vh, 240px)" shooting={shooting} />
            <span className="wrist-anchor" ref={wristRef} />
          </div>
        </div>
      )}
    </div>
  )
}
