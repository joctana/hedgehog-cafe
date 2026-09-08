import { useMemo, useState } from 'react'
import {
  CHEF,
  GUESTS,
  RECIPES,
  STATIONS,
  type CafeCapy as CafeCapyProfile,
  type Recipe,
  type StationId,
} from '../../data/cafeCapys'
import type { SoundKind } from '../../hooks/useSounds'
import { CafeCapy } from './CafeCapy'
import './capycafe.css'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Table = {
  id: number
  guest: CafeCapyProfile
  recipe: Recipe
  eating: boolean
}

type CookPhase = 'pick' | 'cook' | 'serve'

const MEALS_TO_WIN = 5
const TABLE_COUNT = 3

function pickRecipe(avoid?: string): Recipe {
  const pool = RECIPES.filter((recipe) => recipe.id !== avoid)
  return pool[Math.floor(Math.random() * pool.length)]
}

function pickGuest(used: string[]): CafeCapyProfile {
  const pool = GUESTS.filter((guest) => !used.includes(guest.id))
  const source = pool.length ? pool : GUESTS
  return source[Math.floor(Math.random() * source.length)]
}

function makeTables(): Table[] {
  const used: string[] = []
  return Array.from({ length: TABLE_COUNT }, (_, id) => {
    const guest = pickGuest(used)
    used.push(guest.id)
    return { id, guest, recipe: pickRecipe(), eating: false }
  })
}

export function CapybaraCafe({ onBack, playSound }: Props) {
  const [tables, setTables] = useState<Table[]>(() => makeTables())
  const [activeTable, setActiveTable] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<CookPhase>('pick')
  const [meals, setMeals] = useState(0)
  const [coins, setCoins] = useState(0)
  const [message, setMessage] = useState('Tap a hungry friend!')
  const [won, setWon] = useState(false)
  const [stationPop, setStationPop] = useState<StationId | null>(null)

  const cooking = useMemo(
    () => (activeTable === null ? null : tables.find((table) => table.id === activeTable) ?? null),
    [activeTable, tables],
  )

  const nextStation = cooking && phase === 'cook' ? cooking.recipe.steps[step] : null

  const startOrder = (table: Table) => {
    if (won || meals >= MEALS_TO_WIN || table.eating) return
    if (phase !== 'pick') {
      setMessage(`Finish ${cooking?.recipe.name ?? 'this meal'} first!`)
      playSound('tap')
      return
    }
    setActiveTable(table.id)
    setStep(0)
    setPhase('cook')
    setMessage(`${table.guest.name} wants ${table.recipe.emoji} ${table.recipe.name}!`)
    playSound('happy')
  }

  const tapStation = (station: StationId) => {
    if (won || meals >= MEALS_TO_WIN || phase !== 'cook' || !cooking) return
    const needed = cooking.recipe.steps[step]
    if (station !== needed) {
      setMessage(`Next: ${STATIONS.find((item) => item.id === needed)?.label ?? 'this'}!`)
      playSound('tap')
      return
    }

    setStationPop(station)
    window.setTimeout(() => setStationPop(null), 280)

    const sound: SoundKind =
      station === 'wash' ? 'wash' : station === 'chop' ? 'hit' : station === 'cook' ? 'whoosh' : 'happy'
    playSound(sound)

    const next = step + 1
    if (next >= cooking.recipe.steps.length) {
      setPhase('serve')
      setMessage(`Serve ${cooking.guest.name}!`)
      playSound('celebrate')
    } else {
      setStep(next)
      const upcoming = cooking.recipe.steps[next]
      setMessage(`${STATIONS.find((item) => item.id === upcoming)?.label ?? 'Next'} time!`)
    }
  }

  const serveTable = (table: Table) => {
    if (won || meals >= MEALS_TO_WIN || phase !== 'serve' || !cooking) return
    if (table.id !== cooking.id) {
      setMessage(`Take it to ${cooking.guest.name}!`)
      playSound('tap')
      return
    }

    playSound('eat')
    const nextMeals = meals + 1
    setTables((current) =>
      current.map((item) => (item.id === table.id ? { ...item, eating: true } : item)),
    )
    setMessage(`${table.guest.name} is munching!`)
    setCoins((value) => value + table.recipe.coins)
    setMeals(nextMeals)
    setActiveTable(null)
    setStep(0)
    setPhase('pick')

    window.setTimeout(() => {
      if (nextMeals >= MEALS_TO_WIN) {
        setWon(true)
        setMessage('The cafe is buzzing!')
        playSound('celebrate')
        return
      }

      setTables((current) =>
        current.map((item) => {
          if (item.id !== table.id) return item
          const seated = current.map((seat) => seat.guest.id)
          return {
            ...item,
            guest: pickGuest(seated.filter((id) => id !== item.guest.id)),
            recipe: pickRecipe(item.recipe.id),
            eating: false,
          }
        }),
      )
      setMessage('Yum! Next friend?')
      playSound('happy')
    }, 1100)
  }

  const playAgain = () => {
    setTables(makeTables())
    setActiveTable(null)
    setStep(0)
    setPhase('pick')
    setMeals(0)
    setCoins(0)
    setWon(false)
    setMessage('Tap a hungry friend!')
    playSound('celebrate')
  }

  if (won) {
    return (
      <div className="cc-shell done">
        <header className="cc-top">
          <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
            ← Games
          </button>
          <h1 className="cc-title">Cafe stars!</h1>
          <span className="cc-chip win">🍊 {coins}</span>
        </header>
        <div className="cc-done">
          <div className="cc-done-banner" role="status">
            Five happy meals!
          </div>
          <div className="cc-done-crew">
            <CafeCapy capy={CHEF} size={150} chef />
            {GUESTS.slice(0, 3).map((guest) => (
              <CafeCapy key={guest.id} capy={guest} size={110} eating />
            ))}
          </div>
          <p className="cc-lead">Carlos and the crew served a full cafe.</p>
          <div className="cc-done-actions">
            <button type="button" className="cc-again" onClick={playAgain}>
              Open again
            </button>
            <button type="button" className="cc-home" onClick={onBack}>
              Games
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cc-shell">
      <header className="cc-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="cc-title">
          Capybara Cafe
          <small>{message}</small>
        </h1>
        <span className="cc-chip">
          🍊 {coins} · {meals}/{MEALS_TO_WIN}
        </span>
      </header>

      <div className="cc-floor">
        <div className="cc-kitchen" aria-hidden>
          <CafeCapy capy={CHEF} size={118} chef />
          <p className="cc-chef-name">Chef Carlos</p>
        </div>

        <div className="cc-dining" role="list">
          {tables.map((table) => {
            const isActive = cooking?.id === table.id
            const canServe = phase === 'serve' && isActive
            return (
              <button
                key={table.id}
                type="button"
                role="listitem"
                className={[
                  'cc-table',
                  isActive ? 'active' : '',
                  canServe ? 'serve-me' : '',
                  table.eating ? 'eating' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ ['--accent' as string]: table.guest.accent }}
                onClick={() => (phase === 'serve' ? serveTable(table) : startOrder(table))}
              >
                <CafeCapy
                  capy={table.guest}
                  size={104}
                  eating={table.eating}
                  waiting={!isActive && phase === 'pick'}
                />
                <span className="cc-table-name">{table.guest.name}</span>
                <span className="cc-ticket">
                  {table.eating ? 'Yum!' : `${table.recipe.emoji} ${table.recipe.name}`}
                </span>
                {canServe && <span className="cc-serve-tag">Serve!</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="cc-stations" role="toolbar" aria-label="Kitchen stations">
        {STATIONS.map((station) => {
          const glow = nextStation === station.id
          return (
            <button
              key={station.id}
              type="button"
              className={[
                'cc-station',
                glow ? 'next' : '',
                stationPop === station.id ? 'pop' : '',
                phase !== 'cook' ? 'idle' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => tapStation(station.id)}
            >
              <span className="cc-station-emoji" aria-hidden>
                {station.emoji}
              </span>
              <span>{station.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
