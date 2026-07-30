import type { CSSProperties } from 'react'
import type { F1Driver } from '../../data/f1Drivers'

interface RaceCarProps {
  driver: F1Driver
  crashed?: boolean
  compact?: boolean
  size?: number
  flameIntensity?: number
}

export function RaceCar({
  driver,
  crashed = false,
  compact = false,
  size,
  flameIntensity = 1,
}: RaceCarProps) {
  const style = {
    ['--car']: driver.primary,
    ['--car-2']: driver.secondary,
    ['--car-3']: driver.accent,
    ...(size ? { width: size, height: size * 0.375 } : {}),
  } as CSSProperties

  return (
    <div
      className={`f1-car ${crashed ? 'crashed' : ''} ${compact ? 'compact' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 160 60" className="f1-car-svg">
        <ellipse cx="80" cy="48" rx="54" ry="8" fill="rgba(0,0,0,0.18)" />
        <path
          d="M20 36 C28 24, 48 18, 78 18 L118 18 C136 18, 148 26, 150 34 L146 42 L28 42 Z"
          fill="var(--car)"
        />
        <path d="M54 20 L96 20 L102 30 L48 30 Z" fill="var(--car-2)" opacity="0.9" />
        <rect x="70" y="22" width="28" height="10" rx="3" fill="#111827" />
        <circle cx="46" cy="42" r="10" fill="#111" />
        <circle cx="46" cy="42" r="4" fill="#999" />
        <circle cx="118" cy="42" r="10" fill="#111" />
        <circle cx="118" cy="42" r="4" fill="#999" />
        <text
          x="34"
          y="34"
          fill="var(--car-3)"
          fontFamily="Fredoka, Nunito, sans-serif"
          fontSize="12"
          fontWeight="800"
        >
          {driver.number}
        </text>
        {crashed && flameIntensity > 0.05 && (
          <g opacity={flameIntensity}>
            <circle cx="96" cy="16" r="8" fill="#f97316" className="flame" />
            <circle cx="108" cy="12" r="6" fill="#ef4444" className="flame" />
            <circle cx="88" cy="10" r="5" fill="#fbbf24" className="flame" />
            <circle cx="102" cy="6" r="4" fill="#fb923c" className="flame" />
          </g>
        )}
      </svg>
    </div>
  )
}
