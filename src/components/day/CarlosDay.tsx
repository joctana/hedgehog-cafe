import { useEffect, useRef, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { DayCapy } from './DayCapy'
import './day.css'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Step = 'wake' | 'dress' | 'to-store' | 'shop' | 'home' | 'cook' | 'eat' | 'bed' | 'done'

const STEPS: Step[] = ['wake', 'dress', 'to-store', 'shop', 'home', 'cook', 'eat', 'bed']
const FOODS = [
  { id: 'orange', name: 'Oranges', glyph: '🍊' },
  { id: 'corn', name: 'Corn', glyph: '🌽' },
  { id: 'melon', name: 'Melon', glyph: '🍈' },
] as const

export function CarlosDay({ onBack, playSound }: Props) {
  const timer = useRef<number | null>(null)
  const kit = useRef({ shirt: false, shorts: false })
  const [step, setStep] = useState<Step>('wake')
  const [awake, setAwake] = useState(false)
  const [shirtOn, setShirtOn] = useState(false)
  const [shortsOn, setShortsOn] = useState(false)
  const [miles, setMiles] = useState(0)
  const [cart, setCart] = useState<string[]>([])
  const [cook, setCook] = useState(0)
  const [bites, setBites] = useState(0)
  const [tucked, setTucked] = useState(false)

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const later = (next: Step, ms = 700) => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setMiles(0)
      setStep(next)
    }, ms)
  }

  const wake = () => {
    if (step !== 'wake' || awake) return
    setAwake(true)
    playSound('happy')
  }

  const getDressed = () => {
    if (step !== 'wake' || !awake) return
    setStep('dress')
    playSound('tap')
  }

  const wear = (piece: 'shirt' | 'shorts') => {
    if (step !== 'dress' || kit.current[piece]) return
    kit.current = { ...kit.current, [piece]: true }
    setShirtOn(kit.current.shirt)
    setShortsOn(kit.current.shorts)
    playSound('happy')
    if (kit.current.shirt && kit.current.shorts) later('to-store', 800)
  }

  const drive = () => {
    if (step !== 'to-store' && step !== 'home') return
    if (miles >= 3) return
    const next = miles + 1
    setMiles(next)
    playSound('whoosh')
    if (next >= 3) later(step === 'to-store' ? 'shop' : 'cook', 800)
  }

  const grab = (id: string) => {
    if (step !== 'shop' || cart.includes(id)) return
    const next = [...cart, id]
    setCart(next)
    playSound('tap')
    if (next.length >= FOODS.length) later('home', 800)
  }

  const cookStep = () => {
    if (step !== 'cook' || cook >= 3) return
    const next = cook + 1
    setCook(next)
    playSound(next === 1 ? 'wash' : 'happy')
    if (next >= 3) later('eat', 800)
  }

  const bite = () => {
    if (step !== 'eat' || bites >= 3) return
    const next = bites + 1
    setBites(next)
    playSound('eat')
    if (next >= 3) later('bed', 800)
  }

  const tuck = () => {
    if (step !== 'bed' || tucked) return
    setTucked(true)
    playSound('sleep')
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setStep('done')
      playSound('celebrate')
    }, 1100)
  }

  const playAgain = () => {
    if (timer.current) window.clearTimeout(timer.current)
    kit.current = { shirt: false, shorts: false }
    setAwake(false)
    setShirtOn(false)
    setShortsOn(false)
    setMiles(0)
    setCart([])
    setCook(0)
    setBites(0)
    setTucked(false)
    setStep('wake')
    playSound('celebrate')
  }

  const index = step === 'done' ? STEPS.length : STEPS.indexOf(step)
  const message =
    step === 'done'
      ? 'He slept tight.'
      : step === 'wake'
        ? awake
          ? 'Good morning, Carlos!'
          : 'Carlos is still snoozing.'
        : step === 'dress'
          ? shirtOn && shortsOn
            ? 'All dressed. Off to the shop!'
            : shirtOn
              ? 'Shirt on. Now the shorts!'
              : shortsOn
                ? 'Shorts on. Now the shirt!'
                : 'Get Carlos dressed.'
          : step === 'to-store'
            ? miles >= 3
              ? 'At the supermarket!'
              : 'Drive to the supermarket.'
            : step === 'shop'
              ? cart.length >= FOODS.length
                ? 'Basket is full!'
                : 'Tap food for the basket.'
              : step === 'home'
                ? miles >= 3
                  ? 'Home again!'
                  : 'Drive back home.'
                : step === 'cook'
                  ? cook >= 3
                    ? 'Dinner is ready.'
                    : 'Wash, cook, then serve.'
                  : step === 'eat'
                    ? bites >= 3
                      ? 'All gone. Yum!'
                      : 'Tap the bowl for a bite.'
                    : tucked
                      ? 'Good night, Carlos.'
                      : 'Time for bed.'

  return (
    <div className={`day-shell step-${step} ${tucked ? 'tucked' : ''}`}>
      <header className="day-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="day-title">
          {step === 'done' ? 'What a day!' : 'Carlos’s Day'}
          <small>{message}</small>
        </h1>
        <span className="day-chip">☀️ {index}/{STEPS.length}</span>
      </header>

      {step === 'done' ? (
        <div className="day-done">
          <DayCapy size={200} asleep shirt shorts />
          <p className="day-lead">Wake, dress, shop, cook, eat, and sleep.</p>
          <div className="day-done-actions">
            <button type="button" className="day-again" onClick={playAgain}>
              Another day
            </button>
            <button type="button" className="day-home" onClick={onBack}>
              Games
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="day-scene">
            {step === 'wake' || step === 'bed' ? (
              <Bedroom asleep={!awake || tucked} night={step === 'bed'} shirt={shirtOn} shorts={shortsOn} />
            ) : null}
            {step === 'dress' ? <Closet shirt={shirtOn} shorts={shortsOn} /> : null}
            {step === 'to-store' || step === 'home' ? (
              <Road miles={miles} headingHome={step === 'home'} />
            ) : null}
            {step === 'shop' ? <Market cart={cart} onGrab={grab} /> : null}
            {step === 'cook' || step === 'eat' ? <Kitchen cook={cook} bites={step === 'eat' ? bites : 0} eating={step === 'eat'} /> : null}
          </div>
          <div className="day-actions">
            {step === 'wake' && !awake ? (
              <button type="button" className="day-action" onClick={wake}>
                <span aria-hidden>🌞</span>Wake up
              </button>
            ) : null}
            {step === 'wake' && awake ? (
              <button type="button" className="day-action" onClick={getDressed}>
                <span aria-hidden>👕</span>Get dressed
              </button>
            ) : null}
            {step === 'dress' && !(shirtOn && shortsOn) ? (
              <>
                <button type="button" className={`day-action half shirt-btn ${shirtOn ? 'worn' : ''}`} onClick={() => wear('shirt')}>
                  <span aria-hidden>👕</span>
                  {shirtOn ? 'Shirt on' : 'Shirt'}
                </button>
                <button type="button" className={`day-action half shorts-btn ${shortsOn ? 'worn' : ''}`} onClick={() => wear('shorts')}>
                  <span aria-hidden>🩳</span>
                  {shortsOn ? 'Shorts on' : 'Shorts'}
                </button>
              </>
            ) : null}
            {step === 'dress' && shirtOn && shortsOn ? <p className="day-hint">Looking sharp!</p> : null}
            {(step === 'to-store' || step === 'home') && miles < 3 ? (
              <button type="button" className="day-action" onClick={drive}>
                <span aria-hidden>🚗</span>
                {step === 'home' ? 'Drive home' : 'Drive'}
              </button>
            ) : null}
            {(step === 'to-store' || step === 'home') && miles >= 3 ? <p className="day-hint">We made it!</p> : null}
            {step === 'shop' && cart.length < FOODS.length ? <p className="day-hint">Tap a food up on the shelf.</p> : null}
            {step === 'shop' && cart.length >= FOODS.length ? <p className="day-hint">Basket is full!</p> : null}
            {step === 'cook' && cook < 3 ? (
              <button type="button" className="day-action" onClick={cookStep}>
                <span aria-hidden>{cook === 0 ? '💧' : cook === 1 ? '🔥' : '🍽️'}</span>
                {cook === 0 ? 'Wash' : cook === 1 ? 'Cook' : 'Serve'}
              </button>
            ) : null}
            {step === 'cook' && cook >= 3 ? <p className="day-hint">Dinner is ready!</p> : null}
            {step === 'eat' && bites < 3 ? (
              <button type="button" className="day-action" onClick={bite}>
                <span aria-hidden>😋</span>Take a bite
              </button>
            ) : null}
            {step === 'eat' && bites >= 3 ? <p className="day-hint">All gone!</p> : null}
            {step === 'bed' && !tucked ? (
              <button type="button" className="day-action" onClick={tuck}>
                <span aria-hidden>🌙</span>Tuck in
              </button>
            ) : null}
            {step === 'bed' && tucked ? <p className="day-hint">Good night.</p> : null}
          </div>
        </>
      )}
    </div>
  )
}

function Bedroom({
  asleep,
  night,
  shirt,
  shorts,
}: {
  asleep: boolean
  night: boolean
  shirt: boolean
  shorts: boolean
}) {
  return (
    <div className={`bedroom ${night ? 'night' : 'morning'}`}>
      <div className="window" aria-hidden>
        <span className={night ? 'moon' : 'sun'} />
      </div>
      <div className="bed">
        <DayCapy size="clamp(180px, 34vh, 260px)" asleep={asleep} shirt={shirt} shorts={shorts} />
        <div className="blanket" />
      </div>
    </div>
  )
}

function Closet({ shirt, shorts }: { shirt: boolean; shorts: boolean }) {
  return (
    <div className="closet">
      <div className="wardrobe" aria-hidden>
        <span />
        <span />
      </div>
      <DayCapy size="clamp(200px, 40vh, 280px)" shirt={shirt} shorts={shorts} />
    </div>
  )
}

function Road({ miles, headingHome }: { miles: number; headingHome: boolean }) {
  const left = headingHome ? 70 - miles * 20 : 8 + miles * 20
  return (
    <div className="trip">
      <div className="skyline" aria-hidden>
        <div className="house">
          <b>Home</b>
        </div>
        <div className="mart">
          <b>Shop</b>
        </div>
      </div>
      <div className="street">
        <div className={`day-car ${headingHome ? 'homebound' : ''}`} style={{ left: `${left}%` }}>
          <svg viewBox="0 0 180 90" className="day-svg">
            <ellipse cx="90" cy="78" rx="60" ry="8" fill="rgba(0,0,0,0.15)" />
            <path d="M24 58 Q40 28 78 26 H132 Q160 30 166 52 V66 H24 Z" fill="#fb923c" />
            <path d="M70 32 H126 Q142 34 146 48 H64 Q66 36 70 32 Z" fill="#e0f2fe" />
            <circle cx="96" cy="44" r="10" fill="#b88960" />
            <circle cx="92" cy="43" r="1.4" fill="#1f2937" />
            <circle cx="100" cy="43" r="1.4" fill="#1f2937" />
            <circle cx="52" cy="66" r="12" fill="#111827" />
            <circle cx="132" cy="66" r="12" fill="#111827" />
            <circle cx="52" cy="66" r="5" fill="#e5e7eb" />
            <circle cx="132" cy="66" r="5" fill="#e5e7eb" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function Market({ cart, onGrab }: { cart: string[]; onGrab: (id: string) => void }) {
  return (
    <div className="market">
      <div className="shelves">
        {FOODS.map((food) => {
          const taken = cart.includes(food.id)
          return (
            <button key={food.id} type="button" className={`shelf-item ${taken ? 'taken' : ''}`} onClick={() => onGrab(food.id)}>
              <span aria-hidden>{food.glyph}</span>
              {taken ? 'In basket' : food.name}
            </button>
          )
        })}
      </div>
      <div className="basket" aria-label="Shopping basket">
        <span className="basket-label">Basket</span>
        <div className="basket-foods">
          {cart.length === 0 ? <em>Empty</em> : cart.map((id) => <span key={id}>{FOODS.find((food) => food.id === id)?.glyph}</span>)}
        </div>
      </div>
    </div>
  )
}

function Kitchen({ cook, bites, eating }: { cook: number; bites: number; eating: boolean }) {
  const left = eating ? Math.max(0, 3 - bites) : cook === 0 ? 2 : 3
  return (
    <div className="kitchen">
      <div className={`meal stage-${cook} bites-${bites}`} aria-hidden>
        {cook < 2 && !eating ? (
          <>
            <span className="orange" />
            <span className="corn" />
          </>
        ) : (
          <span className="bowl">
            <i style={{ transform: `scale(${left / 3})` }} />
          </span>
        )}
      </div>
      <DayCapy size={150} shirt shorts />
    </div>
  )
}
