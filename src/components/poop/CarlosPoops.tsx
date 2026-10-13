import { useEffect, useRef, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { PoopCapy } from './PoopCapy'
import './poop.css'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
}

type Step = 'potty' | 'wipe' | 'shower' | 'dress' | 'done'

const STEPS: Step[] = ['potty', 'wipe', 'shower', 'dress']
const WIPES = 3
const RINSES = 3

export function CarlosPoops({ onBack, playSound }: Props) {
  const timer = useRef<number | null>(null)
  const kit = useRef({ shirt: false, shorts: false })
  const [step, setStep] = useState<Step>('potty')
  const [went, setWent] = useState(false)
  const [wipes, setWipes] = useState(0)
  const [rinses, setRinses] = useState(0)
  const [shirtOn, setShirtOn] = useState(false)
  const [shortsOn, setShortsOn] = useState(false)

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const later = (next: Step, ms = 700) => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStep(next), ms)
  }

  const goPotty = () => {
    if (step !== 'potty' || went) return
    setWent(true)
    playSound('tap')
  }

  const toWipe = () => {
    if (step !== 'potty' || !went) return
    setStep('wipe')
    playSound('happy')
  }

  const wipe = () => {
    if (step !== 'wipe' || wipes >= WIPES) return
    const next = wipes + 1
    setWipes(next)
    playSound('tap')
    if (next >= WIPES) later('shower', 800)
  }

  const shower = () => {
    if (step !== 'shower' || rinses >= RINSES) return
    const next = rinses + 1
    setRinses(next)
    playSound(next === 2 ? 'bubble' : 'wash')
    if (next >= RINSES) later('dress', 800)
  }

  const wear = (piece: 'shirt' | 'shorts') => {
    if (step !== 'dress' || kit.current[piece]) return
    kit.current = { ...kit.current, [piece]: true }
    setShirtOn(kit.current.shirt)
    setShortsOn(kit.current.shorts)
    playSound('happy')
    if (kit.current.shirt && kit.current.shorts) {
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        setStep('done')
        playSound('celebrate')
      }, 800)
    }
  }

  const playAgain = () => {
    if (timer.current) window.clearTimeout(timer.current)
    kit.current = { shirt: false, shorts: false }
    setWent(false)
    setWipes(0)
    setRinses(0)
    setShirtOn(false)
    setShortsOn(false)
    setStep('potty')
    playSound('celebrate')
  }

  const index = step === 'done' ? STEPS.length : STEPS.indexOf(step) + 1
  const message =
    step === 'done'
      ? 'Fresh and dressed.'
      : step === 'potty'
        ? went
          ? 'He did it!'
          : 'Carlos needs the potty.'
        : step === 'wipe'
          ? wipes >= WIPES
            ? 'Bottom is clean.'
            : 'Wipe his butt.'
          : step === 'shower'
            ? rinses >= RINSES
              ? 'Squeaky clean.'
              : rinses === 0
                ? 'Turn on the water.'
                : rinses === 1
                  ? 'Add some bubbles.'
                  : 'Rinse him off.'
            : shirtOn && shortsOn
              ? 'Looking fresh!'
              : 'Get him dressed.'

  const showerLabel = rinses === 0 ? 'Turn on water' : rinses === 1 ? 'Bubbles' : 'Rinse'

  return (
    <div className={`poop-shell step-${step}`}>
      <header className="poop-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="poop-title">
          {step === 'done' ? 'All clean!' : 'Carlos Poops'}
          <small>{message}</small>
        </h1>
        <span className="poop-chip">🚽 {index}/{STEPS.length}</span>
      </header>

      {step === 'done' ? (
        <div className="poop-done">
          <PoopCapy size={210} shirt shorts sparkle />
          <p className="poop-lead">Potty, wipe, shower, and clothes.</p>
          <div className="poop-done-actions">
            <button type="button" className="poop-again" onClick={playAgain}>
              Another potty
            </button>
            <button type="button" className="poop-home" onClick={onBack}>
              Games
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="poop-scene">
            {step === 'potty' ? <PottyRoom went={went} /> : null}
            {step === 'wipe' ? <WipeRoom wipes={wipes} /> : null}
            {step === 'shower' ? <ShowerRoom rinses={rinses} /> : null}
            {step === 'dress' ? <DressRoom shirt={shirtOn} shorts={shortsOn} /> : null}
          </div>
          <div className="poop-actions">
            {step === 'potty' && !went ? (
              <button type="button" className="poop-action" onClick={goPotty}>
                <span aria-hidden>🚽</span>Go potty
              </button>
            ) : null}
            {step === 'potty' && went ? (
              <button type="button" className="poop-action" onClick={toWipe}>
                <span aria-hidden>🧻</span>Time to wipe
              </button>
            ) : null}
            {step === 'wipe' && wipes < WIPES ? (
              <button type="button" className="poop-action" onClick={wipe}>
                <span aria-hidden>🧻</span>Wipe
              </button>
            ) : null}
            {step === 'wipe' && wipes >= WIPES ? <p className="poop-hint">All clean!</p> : null}
            {step === 'shower' && rinses < RINSES ? (
              <button type="button" className="poop-action" onClick={shower}>
                <span aria-hidden>{rinses === 1 ? '🫧' : '🚿'}</span>
                {showerLabel}
              </button>
            ) : null}
            {step === 'shower' && rinses >= RINSES ? <p className="poop-hint">Time for clothes!</p> : null}
            {step === 'dress' && !(shirtOn && shortsOn) ? (
              <>
                <button type="button" className={`poop-action half shirt-btn ${shirtOn ? 'worn' : ''}`} onClick={() => wear('shirt')}>
                  <span aria-hidden>👕</span>
                  {shirtOn ? 'Shirt on' : 'Shirt'}
                </button>
                <button type="button" className={`poop-action half shorts-btn ${shortsOn ? 'worn' : ''}`} onClick={() => wear('shorts')}>
                  <span aria-hidden>🩳</span>
                  {shortsOn ? 'Shorts on' : 'Shorts'}
                </button>
              </>
            ) : null}
            {step === 'dress' && shirtOn && shortsOn ? <p className="poop-hint">Looking fresh!</p> : null}
          </div>
        </>
      )}
    </div>
  )
}

function PottyRoom({ went }: { went: boolean }) {
  return (
    <div className="poop-potty">
      <PoopCapy pose="sit" size="clamp(200px, 38vh, 280px)" />
      <div className="poop-throne">
        <div className="poop-bowl">{went ? <Plop /> : <span className="poop-hole" />}</div>
      </div>
    </div>
  )
}

function Plop() {
  return (
    <svg viewBox="0 0 80 70" className="poop-plop" aria-hidden>
      <ellipse cx="40" cy="58" rx="26" ry="7" fill="rgba(0,0,0,0.15)" />
      <path
        d="M20 46 Q14 28 30 24 Q26 12 42 16 Q50 6 58 18 Q72 22 64 42 Q72 54 48 52 Q36 62 22 50 Z"
        fill="#8b5a2b"
      />
      <circle cx="36" cy="32" r="2" fill="#3f2412" />
      <circle cx="48" cy="32" r="2" fill="#3f2412" />
      <path d="M36 40 Q42 45 48 40" stroke="#3f2412" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function WipeRoom({ wipes }: { wipes: number }) {
  return (
    <div className="poop-wipe">
      <PoopCapy pose="back" spots={WIPES - wipes} size="clamp(220px, 42vh, 300px)" />
      {wipes > 0 ? (
        <div key={wipes} className="poop-paper" aria-hidden>
          🧻
        </div>
      ) : null}
    </div>
  )
}

function ShowerRoom({ rinses }: { rinses: number }) {
  return (
    <div className={`poop-shower rinses-${rinses}`}>
      <div className="poop-head" aria-hidden>
        <i />
      </div>
      {rinses > 0 ? (
        <div className="poop-water" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : null}
      {rinses > 1 ? (
        <div className="poop-bubbles" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      ) : null}
      <PoopCapy pose="stand" sparkle={rinses >= RINSES} size="clamp(180px, 34vh, 250px)" />
    </div>
  )
}

function DressRoom({ shirt, shorts }: { shirt: boolean; shorts: boolean }) {
  return (
    <div className="poop-dress">
      <div className="poop-towel" aria-hidden>
        <span />
        <span />
      </div>
      <PoopCapy pose="stand" shirt={shirt} shorts={shorts} size="clamp(200px, 40vh, 280px)" />
    </div>
  )
}
