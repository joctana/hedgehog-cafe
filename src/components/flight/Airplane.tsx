import './flight.css'

interface AirplaneProps {
  tilt?: number
  gearDown?: boolean
}

/** Side-view Airbus A320 inspired by AirAsia's red-and-white livery. */
export function Airplane({ tilt = 0, gearDown = false }: AirplaneProps) {
  return (
    <div
      className={`flight-plane ${gearDown ? 'gear-down' : ''}`}
      style={{ transform: `rotate(${tilt}deg)` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 260 110" className="flight-plane-svg">
        <defs>
          <linearGradient id="aaRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff3b3f" />
            <stop offset="55%" stopColor="#e31c23" />
            <stop offset="100%" stopColor="#b51218" />
          </linearGradient>
          <linearGradient id="aaWing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#d7d7d7" />
          </linearGradient>
        </defs>

        {/* main wing (behind fuselage cues) */}
        <path
          d="M108 58 L48 86 L62 90 L128 64 Z"
          fill="url(#aaWing)"
          stroke="#b0b0b0"
          strokeWidth="1"
        />
        {/* far wing tip hint */}
        <path d="M150 52 L188 40 L194 44 L156 58 Z" fill="#e8e8e8" opacity="0.9" />

        {/* engines */}
        <g>
          <rect x="86" y="70" width="34" height="16" rx="7" fill="#efefef" stroke="#b8b8b8" />
          <circle cx="88" cy="78" r="7" fill="#333" />
          <circle cx="88" cy="78" r="3.5" fill="#777" />
          <rect x="148" y="66" width="30" height="14" rx="6" fill="#efefef" stroke="#b8b8b8" opacity="0.85" />
        </g>

        {/* fuselage */}
        <path
          d="M36 56
             C48 40, 70 34, 110 34
             L190 34
             C214 34, 232 42, 242 52
             C248 56, 248 62, 242 64
             C232 72, 214 76, 190 76
             L110 76
             C74 76, 52 70, 36 56 Z"
          fill="url(#aaRed)"
        />

        {/* white belly stripe */}
        <path
          d="M58 62
             C78 68, 110 70, 170 70
             C200 70, 220 68, 234 62
             C220 72, 198 74, 170 74
             C110 74, 78 72, 58 62 Z"
          fill="#ffffff"
          opacity="0.95"
        />

        {/* cockpit windows */}
        <path d="M214 44 C222 44, 230 48, 234 54 L218 54 C214 50, 212 46, 214 44 Z" fill="#7ec8ff" />
        <rect x="198" y="44" width="10" height="8" rx="2" fill="#9ad4ff" opacity="0.95" />

        {/* passenger windows */}
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={86 + i * 12} cy={50} r="2.4" fill="#9ad4ff" />
        ))}

        {/* AirAsia-style wordmark */}
        <text
          x="128"
          y="64"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Nunito, Fredoka, sans-serif"
          fontSize="11"
          fontWeight="800"
          letterSpacing="0.5"
        >
          airasia
        </text>

        {/* vertical stabilizer (tail) — red with white swoosh */}
        <path d="M48 56 L18 18 L40 18 L62 48 Z" fill="url(#aaRed)" />
        <path d="M40 28 L28 22 L36 22 L48 34 Z" fill="#ffffff" />
        <path d="M48 56 L30 56 L34 66 L54 60 Z" fill="#c41218" />

        {/* nose cone highlight */}
        <ellipse cx="236" cy="56" rx="8" ry="7" fill="#ff5a5f" />

        {/* A320-style wingtip fence / sharklet */}
        <path d="M48 86 L40 74 L46 74 L56 86 Z" fill="#e31c23" />
        <path d="M194 40 L202 28 L206 30 L198 44 Z" fill="#e31c23" opacity="0.9" />

        {gearDown ? (
          <g className="landing-gear">
            <rect x="108" y="76" width="4" height="18" rx="1" fill="#333" />
            <circle cx="110" cy="96" r="5" fill="#222" />
            <circle cx="110" cy="96" r="2" fill="#888" />
            <rect x="164" y="74" width="4" height="16" rx="1" fill="#333" />
            <circle cx="166" cy="92" r="5" fill="#222" />
            <circle cx="166" cy="92" r="2" fill="#888" />
            <rect x="220" y="64" width="3" height="14" rx="1" fill="#333" />
            <circle cx="221.5" cy="80" r="4" fill="#222" />
          </g>
        ) : (
          <g opacity="0.35">
            <rect x="112" y="74" width="10" height="3" rx="1" fill="#222" />
            <rect x="168" y="72" width="10" height="3" rx="1" fill="#222" />
          </g>
        )}
      </svg>
    </div>
  )
}
