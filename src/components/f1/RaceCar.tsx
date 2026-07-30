import type { CSSProperties } from 'react'
import type { F1Driver } from '../../data/f1Drivers'

interface RaceCarProps {
  driver: F1Driver
  crashed?: boolean
  compact?: boolean
  size?: number
  flameIntensity?: number
  /** Degrees — default 0 faces up the track (direction of travel). */
  rotate?: number
}

/** Top-down Formula 1 car, nose pointing up (race direction). */
export function RaceCar({
  driver,
  crashed = false,
  compact = false,
  size,
  flameIntensity = 1,
  rotate = 0,
}: RaceCarProps) {
  const style = {
    ['--car']: driver.primary,
    ['--car-2']: driver.secondary,
    ['--car-3']: driver.accent,
    ...(size
      ? { width: size * 0.48, height: size }
      : compact
        ? undefined
        : undefined),
    ...(rotate ? { transform: `rotate(${rotate}deg)` } : {}),
  } as CSSProperties

  return (
    <div
      className={`f1-car ${crashed ? 'crashed' : ''} ${compact ? 'compact' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 80 160" className="f1-car-svg">
        {/* shadow */}
        <ellipse cx="40" cy="150" rx="22" ry="6" fill="rgba(0,0,0,0.22)" />

        {/* rear wing */}
        <rect x="18" y="128" width="44" height="8" rx="2" fill="var(--car-2)" />
        <rect x="22" y="122" width="36" height="6" rx="1.5" fill="var(--car)" />
        <rect x="36" y="118" width="8" height="12" fill="#111827" />

        {/* rear wheels */}
        <rect x="4" y="108" width="14" height="22" rx="3" fill="#111" />
        <rect x="62" y="108" width="14" height="22" rx="3" fill="#111" />
        <rect x="7" y="112" width="8" height="14" rx="2" fill="#555" />
        <rect x="65" y="112" width="8" height="14" rx="2" fill="#555" />

        {/* sidepods + floor */}
        <path
          d="M22 50 L58 50 L62 90 L58 120 L22 120 L18 90 Z"
          fill="var(--car)"
        />
        <path
          d="M26 58 L54 58 L56 95 L54 112 L26 112 L24 95 Z"
          fill="var(--car-2)"
          opacity="0.55"
        />

        {/* engine cover / spine */}
        <path d="M34 48 L46 48 L48 118 L32 118 Z" fill="var(--car)" />
        <path d="M36 52 L44 52 L45 110 L35 110 Z" fill="var(--car-3)" opacity="0.35" />

        {/* halo / cockpit */}
        <ellipse cx="40" cy="62" rx="10" ry="14" fill="#0f172a" />
        <ellipse cx="40" cy="60" rx="7" ry="10" fill="#1e293b" />
        <ellipse cx="40" cy="58" rx="4" ry="5" fill="#334155" />

        {/* nose */}
        <path d="M34 48 L46 48 L43 18 L40 8 L37 18 Z" fill="var(--car)" />
        <path d="M38 20 L42 20 L41 12 L39 12 Z" fill="var(--car-3)" opacity="0.7" />

        {/* front wing */}
        <rect x="16" y="14" width="48" height="7" rx="2" fill="var(--car-2)" />
        <rect x="20" y="10" width="40" height="5" rx="1.5" fill="var(--car)" />
        <rect x="37" y="8" width="6" height="10" fill="#111827" />

        {/* front wheels */}
        <rect x="6" y="22" width="13" height="20" rx="3" fill="#111" />
        <rect x="61" y="22" width="13" height="20" rx="3" fill="#111" />
        <rect x="9" y="26" width="7" height="12" rx="2" fill="#555" />
        <rect x="64" y="26" width="7" height="12" rx="2" fill="#555" />

        {/* number on nose */}
        <text
          x="40"
          y="42"
          textAnchor="middle"
          fill="var(--car-3)"
          fontFamily="Fredoka, Nunito, sans-serif"
          fontSize="11"
          fontWeight="800"
        >
          {driver.number}
        </text>

        {crashed && flameIntensity > 0.05 && (
          <g opacity={flameIntensity}>
            <ellipse cx="40" cy="95" rx="16" ry="22" fill="#f97316" className="flame" />
            <ellipse cx="32" cy="88" rx="10" ry="16" fill="#ef4444" className="flame" />
            <ellipse cx="48" cy="90" rx="9" ry="14" fill="#fbbf24" className="flame" />
            <ellipse cx="40" cy="78" rx="7" ry="10" fill="#fb923c" className="flame" />
          </g>
        )}
      </svg>
    </div>
  )
}
