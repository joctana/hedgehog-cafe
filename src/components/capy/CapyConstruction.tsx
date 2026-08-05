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
const DIG_AMOUNT = 40
const TRUCK_PILE_X = 16
const TRUCK_PAD_X = [48, 62, 76]

export function CapyConstruction({ onBack, playSound }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [vehicle, setVehicle] = useState<Vehicle>('excavator')
  const [bucket, setBucket] = useState(0)
  const [truckLoad, setTruckLoad] = useState(0)
  const [truckX, setTruckX] = useState(TRUCK_PILE_X)
  const [pads, setPads] = useState(() => Array.from({ length: PAD_COUNT }, () => 0))
  const [pile, setPile] = useState(100)
  const [digging, setDigging] = useState(false)
  const [dumping, setDumping] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('Tap Dig, then Pour!')

  const progress = useMemo(() => {
    const total = pads.reduce((sum, p) => sum + Math.min(PAD_GOAL, p), 0)
    return total / (PAD_COUNT * PAD_GOAL)
  }, [pads])

  const nextPadIndex = useCallback((list: number[]) => {
    const idx = list.findIndex((p) => p < PAD_GOAL)
    return idx < 0 ? 0 : idx
  }, [])

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
    setTruckX(TRUCK_PILE_X)
    setPads(Array.from({ length: PAD_COUNT }, () => 0))
    setPile(100)
    setBusy(false)
    setMessage('Tap Dig, then Pour!')
    playSound('celebrate')
  }

  const selectVehicle = (next: Vehicle) => {
    if (busy) return
    setVehicle(next)
    playSound('tap')
    if (next === 'excavator') {
      setMessage('Excavator: Dig, then Pour!')
    } else {
      setMessage('Dump truck: Get sand, then Dump!')
      setTruckX(TRUCK_PILE_X)
    }
  }

  /** Excavator: scoop sand into the bucket. */
  const excavatorDig = () => {
    if (phase !== 'work' || busy) return
    if (pile <= 0) {
      setMessage('No more sand in the pile — pour what you have!')
      playSound('tap')
      return
    }
    if (bucket >= 95) {
      setMessage('Bucket full — tap Pour!')
      playSound('tap')
      return
    }

    setDigging(true)
    window.setTimeout(() => setDigging(false), 320)
    playSound('hit')

    const take = Math.min(DIG_AMOUNT, pile, 100 - bucket)
    setPile((p) => Math.max(0, p - take * 0.4))
    setBucket((b) => Math.min(100, b + take))
    setMessage('Nice scoop! Now Pour.')
  }

  /** Excavator: empty bucket onto build pads. */
  const excavatorPour = () => {
    if (phase !== 'work' || busy) return
    if (bucket < 8) {
      setMessage('Dig some sand first!')
      playSound('tap')
      return
    }
    playSound('whoosh')
    const amount = bucket
    setBucket(0)
    fillPads(amount)
    setMessage('Sand on the pad — dig again!')
  }

  /** Truck: drive to pile and load (one tap). */
  const truckGetSand = () => {
    if (phase !== 'work' || busy) return
    if (pile <= 0 && truckLoad < 8) {
      setMessage('Sand pile is empty!')
      playSound('tap')
      return
    }
    if (truckLoad >= 95) {
      setMessage('Truck full — tap Dump!')
      playSound('tap')
      return
    }

    setBusy(true)
    setMessage('Driving to the sand…')
    setTruckX(TRUCK_PILE_X)
    playSound('whoosh')

    window.setTimeout(() => {
      setDigging(true)
      playSound('hit')
      const take = Math.min(DIG_AMOUNT + 10, pile, 100 - truckLoad)
      setPile((p) => Math.max(0, p - take * 0.4))
      setTruckLoad((t) => Math.min(100, t + Math.max(take, 25)))
      window.setTimeout(() => {
        setDigging(false)
        setBusy(false)
        setMessage('Loaded! Tap Dump.')
      }, 280)
    }, 420)
  }

  /** Truck: drive to next pad and dump (one tap). */
  const truckDump = () => {
    if (phase !== 'work' || busy) return
    if (truckLoad < 8) {
      setMessage('Get sand first!')
      playSound('tap')
      return
    }

    const padIdx = nextPadIndex(pads)
    setBusy(true)
    setMessage('Driving to the pad…')
    setTruckX(TRUCK_PAD_X[padIdx] ?? 62)
    playSound('whoosh')

    window.setTimeout(() => {
      setDumping(true)
      playSound('whoosh')
      const amount = truckLoad
      setTruckLoad(0)
      fillPads(amount, padIdx)
      window.setTimeout(() => {
        setDumping(false)
        setBusy(false)
        setMessage('Dumped! Get more sand.')
      }, 400)
    }, 450)
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

        <div className="capy-carlos-onsite" aria-hidden>
          <CarlosCapy size={128} waving={digging || dumping} />
        </div>

        <div className="capy-pile" style={{ ['--pile' as string]: `${Math.max(18, pile)}%` }}>
          <span>Sand</span>
        </div>

        <div
          className={`capy-ex-wrap ${vehicle === 'excavator' ? 'active' : 'parked'}`}
          aria-hidden={vehicle !== 'excavator'}
        >
          <Excavator size={150} load={bucket / 100} digging={digging && vehicle === 'excavator'} />
        </div>

        <div
          className={`capy-truck-wrap ${vehicle === 'truck' ? 'active' : 'parked'}`}
          style={{ left: vehicle === 'truck' ? `${truckX}%` : '72%' }}
          aria-hidden={vehicle !== 'truck'}
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

      <div className="capy-dock" role="tablist" aria-label="Choose a machine">
        <div className="capy-tabs">
          <button
            type="button"
            role="tab"
            aria-selected={vehicle === 'excavator'}
            className={`capy-tab ${vehicle === 'excavator' ? 'active' : ''}`}
            onClick={() => selectVehicle('excavator')}
          >
            🚜 Excavator
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={vehicle === 'truck'}
            className={`capy-tab ${vehicle === 'truck' ? 'active' : ''}`}
            onClick={() => selectVehicle('truck')}
          >
            🚛 Dump truck
          </button>
        </div>

        {vehicle === 'excavator' ? (
          <div className="capy-panel" role="tabpanel" aria-label="Excavator controls">
            <p className="capy-panel-load">
              Bucket: <b>{Math.round(bucket)}%</b>
            </p>
            <div className="capy-controls simple">
              <button
                type="button"
                className="capy-action dig"
                onClick={excavatorDig}
                disabled={busy}
              >
                ⛏️ Dig
              </button>
              <button
                type="button"
                className="capy-action pour"
                onClick={excavatorPour}
                disabled={busy}
              >
                ⬇️ Pour
              </button>
            </div>
          </div>
        ) : (
          <div className="capy-panel" role="tabpanel" aria-label="Dump truck controls">
            <p className="capy-panel-load">
              Truck: <b>{Math.round(truckLoad)}%</b>
            </p>
            <div className="capy-controls simple">
              <button
                type="button"
                className="capy-action dig"
                onClick={truckGetSand}
                disabled={busy}
              >
                ⬆️ Get sand
              </button>
              <button
                type="button"
                className="capy-action pour"
                onClick={truckDump}
                disabled={busy}
              >
                ⏬ Dump
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
