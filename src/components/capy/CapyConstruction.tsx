import { useCallback, useMemo, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { CarlosCapy } from './CarlosCapy'
import { DumpTruck, Excavator } from './Vehicles'
import './capy.css'

type Phase = 'intro' | 'work' | 'done'
type Vehicle = 'excavator' | 'truck'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

const PAD_GOAL = 100
const PAD_COUNT = 3
const DIG_AMOUNT = 34

export function CapyConstruction({ onBack, playSound }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [vehicle, setVehicle] = useState<Vehicle>('excavator')
  const [bucket, setBucket] = useState(0)
  const [truckLoad, setTruckLoad] = useState(0)
  const [truckX, setTruckX] = useState(18)
  const [pads, setPads] = useState(() => Array.from({ length: PAD_COUNT }, () => 0))
  const [pile, setPile] = useState(100)
  const [digging, setDigging] = useState(false)
  const [dumping, setDumping] = useState(false)
  const [message, setMessage] = useState('Pick a machine and move that sand!')

  const progress = useMemo(() => {
    const total = pads.reduce((sum, p) => sum + Math.min(PAD_GOAL, p), 0)
    return total / (PAD_COUNT * PAD_GOAL)
  }, [pads])

  const nearestPad = useCallback(() => {
    const targets = [35, 55, 78]
    let best = 0
    let bestDist = Infinity
    targets.forEach((t, i) => {
      const d = Math.abs(truckX - t)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    return best
  }, [truckX])

  const checkWin = useCallback(
    (nextPads: number[]) => {
      if (nextPads.every((p) => p >= PAD_GOAL)) {
        setPhase('done')
        playSound('celebrate')
        setMessage('Work with kindness!')
      }
    },
    [playSound],
  )

  const fillPads = useCallback(
    (amount: number, preferIdx?: number) => {
      setPads((prev) => {
        const next = [...prev]
        let left = amount
        const order =
          preferIdx == null
            ? Array.from({ length: PAD_COUNT }, (_, i) => i)
            : [
                preferIdx,
                ...Array.from({ length: PAD_COUNT }, (_, i) => i).filter((i) => i !== preferIdx),
              ]
        for (const i of order) {
          if (left <= 0) break
          const room = PAD_GOAL - next[i]!
          if (room <= 0) continue
          const add = Math.min(room, left)
          next[i] = next[i]! + add
          left -= add
        }
        checkWin(next)
        return next
      })
    },
    [checkWin],
  )

  const startWork = () => {
    setPhase('work')
    setVehicle('excavator')
    setBucket(0)
    setTruckLoad(0)
    setTruckX(18)
    setPads(Array.from({ length: PAD_COUNT }, () => 0))
    setPile(100)
    setMessage('Dig sand, then dump it on the build pads!')
    playSound('celebrate')
  }

  const dig = () => {
    if (phase !== 'work') return
    if (pile <= 0) {
      setMessage('Sand pile is empty — dump what you’ve got!')
      playSound('tap')
      return
    }

    setDigging(true)
    window.setTimeout(() => setDigging(false), 320)
    playSound('hit')

    if (vehicle === 'excavator') {
      const take = Math.min(DIG_AMOUNT, pile, 100 - bucket)
      if (take <= 0) {
        setMessage('Bucket full! Pour into the truck or a pad.')
        return
      }
      setPile((p) => Math.max(0, p - take * 0.45))
      setBucket((b) => Math.min(100, b + take))
      setMessage('Nice scoop, Carlos!')
      return
    }

    if (truckX > 32) {
      setMessage('Drive left to the sand pile to load up!')
      playSound('tap')
      return
    }
    const take = Math.min(DIG_AMOUNT, pile, 100 - truckLoad)
    if (take <= 0) {
      setMessage('Truck is full — drive to a pad and dump!')
      return
    }
    setPile((p) => Math.max(0, p - take * 0.45))
    setTruckLoad((t) => Math.min(100, t + take))
    setMessage('Sand loaded in the dump truck!')
  }

  const pour = () => {
    if (phase !== 'work') return

    if (vehicle === 'excavator') {
      if (bucket < 8) {
        setMessage('Dig some sand first!')
        playSound('tap')
        return
      }
      playSound('whoosh')
      const truckNearby = truckX < 42
      if (truckNearby && truckLoad < 95) {
        const give = Math.min(bucket, 100 - truckLoad)
        setBucket((b) => b - give)
        setTruckLoad((t) => Math.min(100, t + give))
        setMessage('Loaded the dump truck!')
        return
      }
      const amount = bucket
      setBucket(0)
      fillPads(amount)
      setMessage('Sand on the pad — keep going!')
      return
    }

    if (truckLoad < 8) {
      setMessage('Load sand first!')
      playSound('tap')
      return
    }
    if (truckX < 30) {
      setMessage('Drive right to the build pads, then dump!')
      playSound('tap')
      return
    }
    setDumping(true)
    window.setTimeout(() => setDumping(false), 450)
    playSound('whoosh')
    const amount = truckLoad
    setTruckLoad(0)
    fillPads(amount, nearestPad())
    setMessage('Dump complete — kind work!')
  }

  const moveTruck = (dir: -1 | 1) => {
    if (phase !== 'work' || vehicle !== 'truck') return
    setTruckX((x) => Math.max(12, Math.min(82, x + dir * 14)))
    playSound('tap')
  }

  if (phase === 'intro') {
    return (
      <div className="capy-shell">
        <header className="capy-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="capy-title">Capy Construction</h1>
          <span className="capy-chip">Carlos</span>
        </header>

        <div className="capy-intro">
          <div className="capy-signs">
            <div className="capy-sign">
              CARLOS
              <span>♥</span>
            </div>
            <div className="capy-sign kindness">
              WORK WITH KINDNESS
              <span>♥</span>
            </div>
          </div>
          <CarlosCapy size={200} waving />
          <p className="capy-lead">
            Carlos the capybara builds with dump trucks, excavators, and lots of kindness.
          </p>
          <button type="button" className="capy-primary" onClick={startWork}>
            Let&apos;s dig!
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="capy-shell done">
        <header className="capy-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="capy-title">Job done!</h1>
          <span className="capy-chip win">♥</span>
        </header>
        <div className="capy-done">
          <div className="capy-done-banner" role="status">
            Work with kindness!
          </div>
          <CarlosCapy size={220} waving />
          <p className="capy-lead">Great building, Carlos.</p>
          <div className="capy-done-actions">
            <button type="button" className="capy-primary" onClick={startWork}>
              Build again
            </button>
            <button type="button" className="capy-secondary" onClick={onBack}>
              Games
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="capy-shell">
      <header className="capy-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="capy-title">
          Carlos
          <small>Capy Construction</small>
        </h1>
        <span className="capy-chip">{Math.round(progress * 100)}%</span>
      </header>

      <div className="capy-progress">
        <span>Build pads</span>
        <div className="capy-meter">
          <i style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <p className="capy-hint" aria-live="polite">
        {message}
      </p>

      <div className="capy-site">
        <div className="capy-sky" aria-hidden />
        <div className="capy-hills" aria-hidden />

        <div className="capy-sign-site left" aria-hidden>
          CARLOS ♥
        </div>
        <div className="capy-sign-site right" aria-hidden>
          WORK WITH KINDNESS ♥
        </div>
        <div className="capy-cone" aria-hidden />

        <div className="capy-pile" style={{ ['--pile' as string]: `${Math.max(18, pile)}%` }}>
          <span>Sand</span>
        </div>

        <div className={`capy-ex-wrap ${vehicle === 'excavator' ? 'active' : ''}`}>
          <Excavator size={150} load={bucket / 100} digging={digging && vehicle === 'excavator'} />
        </div>

        <div
          className={`capy-truck-wrap ${vehicle === 'truck' ? 'active' : ''}`}
          style={{ left: `${truckX}%` }}
        >
          <DumpTruck size={150} load={truckLoad / 100} dumping={dumping} />
        </div>

        <div className="capy-pads">
          {pads.map((fill, i) => (
            <div key={i} className="capy-pad">
              <div className="capy-pad-sand" style={{ height: `${Math.min(100, fill)}%` }} />
              <span>Pad {i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="capy-vehicle-pick">
        <button
          type="button"
          className={`capy-pick ${vehicle === 'excavator' ? 'active' : ''}`}
          onClick={() => {
            setVehicle('excavator')
            playSound('tap')
            setMessage('Excavator ready — dig, then pour!')
          }}
        >
          🚜 Excavator
        </button>
        <button
          type="button"
          className={`capy-pick ${vehicle === 'truck' ? 'active' : ''}`}
          onClick={() => {
            setVehicle('truck')
            playSound('tap')
            setMessage('Dump truck ready — load, drive, dump!')
          }}
        >
          🚛 Dump truck
        </button>
      </div>

      <div className={`capy-controls ${vehicle}`}>
        {vehicle === 'truck' && (
          <button type="button" className="capy-steer" onClick={() => moveTruck(-1)}>
            ◀
          </button>
        )}
        <button type="button" className="capy-action dig" onClick={dig}>
          {vehicle === 'excavator' ? '⛏️ Dig' : '⬆️ Load'}
        </button>
        <button type="button" className="capy-action pour" onClick={pour}>
          {vehicle === 'excavator' ? '⬇️ Pour' : '⏬ Dump'}
        </button>
        {vehicle === 'truck' && (
          <button type="button" className="capy-steer" onClick={() => moveTruck(1)}>
            ▶
          </button>
        )}
      </div>
    </div>
  )
}
