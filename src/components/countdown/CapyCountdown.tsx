import { useEffect, useRef, useState } from 'react'
import type { SoundKind } from '../../hooks/useSounds'
import { useSpeech } from '../../hooks/useSpeech'
import { CountdownCapy } from './CountdownCapy'
import { DADDY_VISIT, DADDY_VISIT_LABEL, padCount, sleepLine, sleepPillowStates, splitCountdown, type CountdownParts } from './countdown'
import './countdown.css'

type Props = {
  onBack: () => void
  playSound: (kind: SoundKind) => void
  muted: boolean
}

const SMALL_UNITS = [
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

export function CapyCountdown({ onBack, playSound, muted }: Props) {
  const celebrated = useRef(false)
  const cheerTimer = useRef<number | null>(null)
  const { speak, stop } = useSpeech(muted)
  const [parts, setParts] = useState<CountdownParts>(() => splitCountdown(DADDY_VISIT.getTime(), Date.now()))
  const [cheer, setCheer] = useState(false)
  const line = sleepLine(parts.days, parts.done)

  useEffect(() => {
    const tick = () => {
      const next = splitCountdown(DADDY_VISIT.getTime(), Date.now())
      setParts(next)
      if (next.done && !celebrated.current) {
        celebrated.current = true
        playSound('celebrate')
      }
    }
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [playSound])

  useEffect(() => {
    return () => {
      if (cheerTimer.current) window.clearTimeout(cheerTimer.current)
      stop()
    }
  }, [stop])

  const cheerOn = () => {
    setCheer(true)
    playSound(parts.done ? 'celebrate' : 'happy')
    speak(line, { rate: 0.92, pitch: 1.15 })
    if (cheerTimer.current) window.clearTimeout(cheerTimer.current)
    cheerTimer.current = window.setTimeout(() => setCheer(false), 1800)
  }

  return (
    <div className={`count-shell ${parts.done ? 'arrived' : ''}`}>
      <header className="count-top">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to games">
          ← Games
        </button>
        <h1 className="count-title">
          {parts.done ? 'Daddy time!' : 'Capy Countdown'}
          <small>{parts.done ? "It's time to see Daddy." : 'Until you see Daddy'}</small>
        </h1>
        <span className="count-chip">💛</span>
      </header>

      <div className="count-scene">
        <button type="button" className="count-buddy" onClick={cheerOn}>
          <CountdownCapy size="clamp(110px, 20vh, 170px)" excited={cheer || parts.done} />
          <span className={`count-bubble ${cheer || parts.done ? 'show' : ''}`}>{line}</span>
        </button>

        <SleepRow daysLeft={parts.days} />

        <div className="count-board" role="timer" aria-live="polite" aria-atomic="true">
          <div className="count-unit sleeps">
            <strong>{padCount(parts.days)}</strong>
            <span>Sleeps</span>
          </div>
          <div className="count-rest">
            {SMALL_UNITS.map((unit) => (
              <div className="count-unit small" key={unit.key}>
                <strong key={unit.key === 'seconds' ? parts.seconds : unit.key}>{padCount(parts[unit.key])}</strong>
                <span>{unit.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="count-when">{DADDY_VISIT_LABEL}</p>
      </div>
    </div>
  )
}

function SleepRow({ daysLeft }: { daysLeft: number }) {
  const pillows = sleepPillowStates(daysLeft)
  return (
    <div className="sleep-row">
      {pillows.map((slept, index) => (
        <div
          key={index}
          className={`sleep-pillow ${slept ? 'slept' : ''}`}
          role="img"
          aria-label={slept ? 'Sleep finished' : 'Sleep still to come'}
        >
          <span className="sleep-crease" />
          {slept ? <span className="sleep-night">🌙⭐</span> : null}
        </div>
      ))}
    </div>
  )
}
