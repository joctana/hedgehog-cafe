import { useEffect, useMemo, useState } from 'react'
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
import { Dish, type DishStage } from './FoodArt'
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
  bites: number
}

type CookPhase = 'pick' | 'cook' | 'serve'

const MEALS_TO_WIN = 5
const TABLE_COUNT = 3
const BITES_PER_MEAL = 5

const STAGE_LABEL: Record<DishStage, string> = {
  raw: 'Fresh from the garden',
  washed: 'Rinsed and shiny',
  chopped: 'Chopped up small',
  cooked: 'Hot from the pot',
  plated: 'Ready to serve!',
}

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
    return { id, guest, recipe: pickRecipe(), eating: false, bites: 0 }
  })
}

function stageFor(recipe: Recipe, stepsDone: number): DishStage {
  const done = recipe.steps.slice(0, stepsDone)
  if (done.includes('plate')) return 'plated'
  if (done.includes('cook')) return 'cooked'
  if (done.includes('chop')) return 'chopped'
  if (done.includes('wash')) return 'washed'
  return 'raw'
}

export function CapybaraCafe({ onBack, playSound }: Props) {
  const [tables, setTables] = useState<Table[]>(() => makeTables())
  const [activeTable, setActiveTable] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<CookPhase>('pick')
  const [meals, setMeals] = useState(0)
  const [coins, setCoins] = useState(0)
  const [message, setMessage] = useState('Tap a hungry friend to take their order!')
  const [won, setWon] = useState(false)
  const [stationPop, setStationPop] = useState<StationId | null>(null)

  const cooking = useMemo(
    () => (activeTable === null ? null : tables.find((table) => table.id === activeTable) ?? null),
    [activeTable, tables],
  )

  const nextStation = cooking && phase === 'cook' ? cooking.recipe.steps[step] : null
  const counterStage = cooking ? stageFor(cooking.recipe, phase === 'serve' ? cooking.recipe.steps.length : step) : null
  const anyEating = tables.some((table) => table.eating)

  useEffect(() => {
    if (!anyEating) return
    const timer = window.setInterval(() => {
      setTables((current) =>
        current.map((table) =>
          table.eating ? { ...table, bites: Math.min(BITES_PER_MEAL, table.bites + 1) } : table,
        ),
      )
    }, 190)
    return () => window.clearInterval(timer)
  }, [anyEating])

  const startOrder = (table: Table) => {
    if (won || meals >= MEALS_TO_WIN || table.eating) return
    if (phase !== 'pick') {
      setMessage(`Finish the ${cooking?.recipe.name ?? 'order'} first!`)
      playSound('tap')
      return
    }
    setActiveTable(table.id)
    setStep(0)
    setPhase('cook')
    setMessage(`${table.guest.name} wants ${table.recipe.name}!`)
    playSound('happy')
  }

  const tapStation = (station: StationId) => {
    if (won || meals >= MEALS_TO_WIN || phase !== 'cook' || !cooking) return
    const needed = cooking.recipe.steps[step]
    if (station !== needed) {
      setMessage(`Try ${STATIONS.find((item) => item.id === needed)?.label ?? 'the glowing button'}!`)
      playSound('tap')
      return
    }

    setStationPop(station)
    window.setTimeout(() => setStationPop(null), 280)

    const sound: SoundKind =
      station === 'wash' ? 'wash' : station === 'chop' ? 'hit' : station === 'cook' ? 'whoosh' : 'happy'
    playSound(sound)

    const next = step + 1
    setStep(next)
    if (next >= cooking.recipe.steps.length) {
      setPhase('serve')
      setMessage(`Tap ${cooking.guest.name} to serve the ${cooking.recipe.name}!`)
      playSound('celebrate')
    } else {
      setMessage(STAGE_LABEL[stageFor(cooking.recipe, next)])
    }
  }

  const serveTable = (table: Table) => {
    if (won || meals >= MEALS_TO_WIN || phase !== 'serve' || !cooking) return
    if (table.id !== cooking.id) {
      setMessage(`This plate is for ${cooking.guest.name}!`)
      playSound('tap')
      return
    }

    playSound('eat')
    const nextMeals = meals + 1
    setTables((current) =>
      current.map((item) => (item.id === table.id ? { ...item, eating: true, bites: 0 } : item)),
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
            bites: 0,
          }
        }),
      )
      setMessage('Yum! Who is next?')
      playSound('happy')
    }, 1400)
  }

  const playAgain = () => {
    setTables(makeTables())
    setActiveTable(null)
    setStep(0)
    setPhase('pick')
    setMeals(0)
    setCoins(0)
    setWon(false)
    setMessage('Tap a hungry friend to take their order!')
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
          <div className="cc-done-scene">
            <div className="cc-done-crew">
              <CafeCapy capy={CHEF} size={140} chef />
              {GUESTS.slice(0, 3).map((guest, index) => (
                <div className="cc-done-guest" key={guest.id}>
                  <CafeCapy capy={guest} size={104} eating />
                  <Dish recipe={RECIPES[index]} stage="plated" size={98} />
                </div>
              ))}
            </div>
            <div className="cc-done-table" />
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

      <div className="cc-dining" role="list">
        {tables.map((table) => {
          const isActive = cooking?.id === table.id
          const canServe = phase === 'serve' && isActive
          const bubbleStage: DishStage = isActive && counterStage ? counterStage : 'plated'
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
              <span className="cc-table-name">{table.guest.name}</span>

              <div className="cc-guest-area">
                {!table.eating && (
                  <div className={`cc-order-bubble ${isActive ? 'live' : ''}`}>
                    <Dish recipe={table.recipe} stage={bubbleStage} size={116} />
                    <span className="cc-order-name">{table.recipe.name}</span>
                  </div>
                )}
                <CafeCapy
                  capy={table.guest}
                  size="clamp(84px, 14vh, 150px)"
                  eating={table.eating}
                  waiting={!isActive && !table.eating}
                />
              </div>

              <div className={`cc-tabletop ${table.eating ? '' : 'set'}`}>
                {table.eating && (
                  <div className="cc-served">
                    <Dish recipe={table.recipe} stage="plated" size={140} bites={table.bites} />
                  </div>
                )}
              </div>

              {canServe && <span className="cc-serve-tag">Serve!</span>}
              {table.eating && <span className="cc-coin-pop">+{table.recipe.coins} 🍊</span>}
              {table.eating && table.bites >= BITES_PER_MEAL && <span className="cc-yum">Yum!</span>}
            </button>
          )
        })}
      </div>

      <div className="cc-kitchen">
        <div className={`cc-chef ${cooking ? 'busy' : ''}`} aria-hidden>
          <CafeCapy capy={CHEF} size="clamp(80px, 13vh, 140px)" chef />
          <span className="cc-chef-name">Chef Carlos</span>
        </div>

        <div className="cc-counter">
          {cooking && counterStage ? (
            <>
              <Dish recipe={cooking.recipe} stage={counterStage} size={220} />
              <p className="cc-counter-label">
                {cooking.recipe.name} · {STAGE_LABEL[counterStage]}
              </p>
            </>
          ) : (
            <>
              <ul className="cc-menu" aria-label="Today's menu">
                {RECIPES.map((recipe) => (
                  <li key={recipe.id} className="cc-menu-item">
                    <Dish recipe={recipe} stage="plated" size={78} />
                    <span>{recipe.name}</span>
                  </li>
                ))}
              </ul>
              <p className="cc-counter-empty">Today's menu — tap a friend to start cooking</p>
            </>
          )}
        </div>

        <ol className="cc-steps" aria-label="Recipe steps">
          {(cooking?.recipe.steps ?? []).map((id, index) => {
            const station = STATIONS.find((item) => item.id === id)
            const done = index < step
            return (
              <li
                key={`${id}-${index}`}
                className={['cc-step', done ? 'done' : '', index === step ? 'now' : ''].join(' ').trim()}
              >
                <span aria-hidden>{done ? '✅' : station?.emoji}</span>
                {station?.label}
              </li>
            )
          })}
        </ol>
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
