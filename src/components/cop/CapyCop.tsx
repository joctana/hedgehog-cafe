import { useEffect, useRef, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { CopCar, SpeederCar, type Driver } from './Cars'
import { CopCapy } from './CopCapy'
import './cop.css'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Speeder = {
  id: number
  lane: number
  body: string
  driver: Driver
  duration: number
  delay: number
  rest: number
}

type Phase = 'ready' | 'patrol' | 'choice' | 'ticket' | 'jail' | 'done'

const GOAL = 4
const PAINTS = ['#ef4444', '#facc15', '#34d399', '#38bdf8', '#fb7185']
const DRIVERS: Driver[] = ['bunny', 'fox', 'duck', 'frog']

let serial = 1

function makeSpeeder(lane: number): Speeder {
  serial += 1
  return {
    id: serial,
    lane,
    body: PAINTS[serial % PAINTS.length],
    driver: DRIVERS[serial % DRIVERS.length],
    duration: 2.1 + (serial % 4) * 0.35,
    delay: -lane * 0.7,
    rest: 12 + lane * 22,
  }
}

function traffic(): Speeder[] {
  return [0, 1, 2].map(makeSpeeder)
}

export function CapyCop({ onBack, playSound }: Props) {
  const busy = useRef(false)
  const timer = useRef<number | null>(null)
  const popTimer = useRef<number | null>(null)
  const kit = useRef({ shirt: false, hat: false })

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
      if (popTimer.current) window.clearTimeout(popTimer.current)
    }
  }, [])
  const [cars, setCars] = useState<Speeder[]>(() => traffic())
  const [pulled, setPulled] = useState<Speeder | null>(null)
  const [phase, setPhase] = useState<Phase>('ready')
  const [handled, setHandled] = useState(0)
  const [tickets, setTickets] = useState(0)
  const [jailed, setJailed] = useState(0)
  const [shirtOn, setShirtOn] = useState(false)
  const [hatOn, setHatOn] = useState(false)
  const [dressing, setDressing] = useState(false)
  const [message, setMessage] = useState('Time for work! Put on the uniform and hat.')

  const wear = (piece: 'shirt' | 'hat') => {
    if (phase !== 'ready' || kit.current[piece]) return
    kit.current = { ...kit.current, [piece]: true }
    setShirtOn(kit.current.shirt)
    setHatOn(kit.current.hat)
    setDressing(false)
    window.requestAnimationFrame(() => setDressing(true))
    if (popTimer.current) window.clearTimeout(popTimer.current)
    popTimer.current = window.setTimeout(() => setDressing(false), 480)
    if (kit.current.shirt && kit.current.hat) {
      setMessage('Ready for work!')
      playSound('celebrate')
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        setPhase('patrol')
        setMessage('Tap a speeding car!')
        playSound('whoosh')
      }, 1000)
      return
    }
    setMessage(piece === 'shirt' ? 'Uniform on. Now the hat!' : 'Hat on. Now the uniform!')
    playSound('happy')
  }

  const pullOver = (car: Speeder) => {
    if (phase !== 'patrol' || busy.current) return
    busy.current = true
    setPulled(car)
    setPhase('choice')
    setMessage('Pulled over! Ticket or jail?')
    playSound('blast')
  }

  const finishStop = (kind: 'ticket' | 'jail') => {
    if (phase !== 'choice' || !pulled) return
    const total = handled + 1
    setHandled(total)
    if (kind === 'ticket') {
      setTickets((count) => count + 1)
      setPhase('ticket')
      setMessage('A speeding ticket. Please go slower!')
      playSound('happy')
    } else {
      setJailed((count) => count + 1)
      setPhase('jail')
      setMessage('Off to timeout jail.')
      playSound('whoosh')
    }
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      busy.current = false
      if (total >= GOAL) {
        setPhase('done')
        setMessage('The roads are calm.')
        playSound('celebrate')
        return
      }
      setPulled(null)
      setCars(traffic())
      setPhase('patrol')
      setMessage('Tap a speeding car!')
    }, 1500)
  }

  const playAgain = () => {
    busy.current = false
    if (timer.current) window.clearTimeout(timer.current)
    kit.current = { shirt: false, hat: false }
    setCars(traffic())
    setPulled(null)
    setHandled(0)
    setTickets(0)
    setJailed(0)
    setShirtOn(false)
    setHatOn(false)
    setDressing(false)
    setPhase('ready')
    setMessage('Time for work! Put on the uniform and hat.')
    playSound('celebrate')
  }

  return (
    <div className={`cop-shell phase-${phase}`}>
      <header className="cop-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="cop-title">
          {phase === 'done' ? 'Shift complete!' : 'Capybara Cop'}
          <small>{phase === 'done' ? 'Carlos kept the road safe.' : message}</small>
        </h1>
        <span className="cop-chip">
          {phase === 'ready'
            ? `👕 ${Number(shirtOn) + Number(hatOn)}/2`
            : `🚓 ${phase === 'done' ? GOAL : handled}/${GOAL}`}
        </span>
      </header>

      {phase === 'done' ? (
        <div className="cop-done">
          <CopCapy size={180} />
          <CopCar lights />
          <p className="cop-lead">
            {tickets} ticket{tickets === 1 ? '' : 's'} · {jailed} trip{jailed === 1 ? '' : 's'} to jail
          </p>
          <div className="cop-done-actions">
            <button type="button" className="cop-again" onClick={playAgain}>
              Patrol again
            </button>
            <button type="button" className="cop-home" onClick={onBack}>
              Games
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cop-scene">
            {phase === 'ready' ? (
              <div className="locker-room">
                <div className="station-sign" aria-hidden>
                  Police Station
                </div>
                <div className="locker-box" aria-hidden>
                  <span />
                  <span />
                </div>
                <CopCapy size="clamp(220px, 46vh, 320px)" shirt={shirtOn} hat={hatOn} dressing={dressing} />
              </div>
            ) : (
              <>
            <div className="cop-sky" aria-hidden>
              <span className="sun" />
            </div>

            {phase === 'jail' && pulled ? (
              <div className="jail-scene">
                <div className="jail">
                  <div className="jail-sign">Town Jail</div>
                  <div className="jail-bars">
                    <SpeederCar body={pulled.body} driver={pulled.driver} fast={false} />
                  </div>
                  <p className="jail-note">A little timeout. Then they can go.</p>
                </div>
                <CopCapy size={150} />
              </div>
            ) : (
              <div className="road">
                <span className="lane-line" />
                <span className="lane-line lower" />
                {phase === 'patrol' && (
                  <div className="shoulder">
                    <CopCar />
                  </div>
                )}

                {phase === 'patrol' &&
                  cars.map((car) => (
                    <button
                      key={car.id}
                      type="button"
                      className={`speeder lane-${car.lane}`}
                      style={{
                        animationDuration: `${car.duration}s`,
                        animationDelay: `${car.delay}s`,
                        ['--rest' as string]: `${car.rest}%`,
                      }}
                      aria-label="Pull over the speeding car"
                      onClick={() => pullOver(car)}
                    >
                      <SpeederCar body={car.body} driver={car.driver} />
                    </button>
                  ))}

                {pulled && phase !== 'patrol' && (
                  <div className="pullover">
                    <SpeederCar body={pulled.body} driver={pulled.driver} fast={false} />
                    <CopCar lights />
                  </div>
                )}

                {phase === 'ticket' && (
                  <div className="ticket" role="status">
                    <strong>Speeding ticket</strong>
                    <span>Too fast!</span>
                    <span>Please slow down.</span>
                  </div>
                )}
              </div>
            )}
              </>
            )}
          </div>

          <div className="cop-actions">
            {phase === 'ready' ? (
              <>
                <button
                  type="button"
                  className={`cop-action uniform-btn ${shirtOn ? 'worn' : ''}`}
                  aria-pressed={shirtOn}
                  onClick={() => wear('shirt')}
                >
                  <span aria-hidden>👕</span>
                  {shirtOn ? 'Uniform on' : 'Uniform'}
                </button>
                <button
                  type="button"
                  className={`cop-action hat-btn ${hatOn ? 'worn' : ''}`}
                  aria-pressed={hatOn}
                  onClick={() => wear('hat')}
                >
                  <span aria-hidden>🧢</span>
                  {hatOn ? 'Hat on' : 'Hat'}
                </button>
              </>
            ) : phase === 'choice' ? (
              <>
                <button type="button" className="cop-action ticket-btn" onClick={() => finishStop('ticket')}>
                  <span aria-hidden>🎫</span>Ticket
                </button>
                <button type="button" className="cop-action jail-btn" onClick={() => finishStop('jail')}>
                  <span aria-hidden>🏢</span>Jail
                </button>
              </>
            ) : (
              <p className="cop-hint">{phase === 'patrol' ? 'They are going too fast. Tap one!' : message}</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

