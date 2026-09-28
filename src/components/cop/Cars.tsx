export type Driver = 'bunny' | 'fox' | 'duck' | 'frog'

type SpeederProps = {
  body: string
  driver: Driver
  fast?: boolean
}

const FACE: Record<Driver, { fill: string; ear: string }> = {
  bunny: { fill: '#fbcfe8', ear: '#f9a8d4' },
  fox: { fill: '#fdba74', ear: '#ea580c' },
  duck: { fill: '#fde68a', ear: '#f59e0b' },
  frog: { fill: '#86efac', ear: '#22c55e' },
}

export function SpeederCar({ body, driver, fast = true }: SpeederProps) {
  const face = FACE[driver]
  return (
    <span className={`speeder-car ${fast ? 'fast' : 'stopped'}`} aria-hidden>
      <svg viewBox="0 0 180 90" className="cop-svg">
        <ellipse cx="90" cy="78" rx="60" ry="7" fill="rgba(0,0,0,0.2)" />
        <path d="M28 58 Q40 28 78 26 H130 Q156 28 162 50 V64 H28 Z" fill={body} />
        <path d="M70 30 H124 Q142 32 146 46 H64 Q66 34 70 30 Z" fill="#e0f2fe" />
        <circle cx="52" cy="66" r="12" fill="#111827" />
        <circle cx="132" cy="66" r="12" fill="#111827" />
        <circle cx="52" cy="66" r="5" fill="#d1d5db" />
        <circle cx="132" cy="66" r="5" fill="#d1d5db" />
        <circle cx="108" cy="42" r="9" fill={face.fill} />
        {driver === 'bunny' && (
          <>
            <ellipse cx="102" cy="30" rx="3" ry="8" fill={face.ear} />
            <ellipse cx="114" cy="30" rx="3" ry="8" fill={face.ear} />
          </>
        )}
        {driver === 'fox' && <path d="M100 36 L108 28 L112 38" fill={face.ear} />}
        <circle cx="105" cy="41" r="1.4" fill="#1f2937" />
        <circle cx="111" cy="41" r="1.4" fill="#1f2937" />
        <path d="M105 46 Q108 49 112 46" stroke="#1f2937" strokeWidth="1.2" fill="none" />
      </svg>
    </span>
  )
}

export function CopCar({ lights = false }: { lights?: boolean }) {
  return (
    <span className={`cop-car ${lights ? 'lights' : ''}`} aria-hidden>
      <svg viewBox="0 0 200 100" className="cop-svg">
        <ellipse cx="100" cy="88" rx="70" ry="8" fill="rgba(0,0,0,0.2)" />
        <path d="M24 64 Q36 34 78 32 H150 Q176 34 184 56 V72 H24 Z" fill="#f8fafc" />
        <path d="M24 64 H184 V74 H24 Z" fill="#1e3a8a" />
        <text x="72" y="72" fontSize="10" fontWeight="800" fill="#f8fafc" fontFamily="Nunito, sans-serif">
          POLICE
        </text>
        <path d="M70 36 H140 Q158 38 164 52 H62 Q64 40 70 36 Z" fill="#bae6fd" />
        <ellipse cx="100" cy="40" rx="3.2" ry="6" fill="#8f6540" />
        <ellipse cx="116" cy="40" rx="3.2" ry="6" fill="#8f6540" />
        <circle cx="108" cy="50" r="11" fill="#b88960" />
        <ellipse cx="108" cy="54" rx="6" ry="4" fill="#c99a70" />
        <ellipse cx="108" cy="42" rx="13" ry="4.5" fill="#1d4ed8" />
        <rect x="102" y="38" width="12" height="4" rx="1" fill="#facc15" />
        <circle cx="104" cy="49" r="1.4" fill="#1f2937" />
        <circle cx="112" cy="49" r="1.4" fill="#1f2937" />
        <ellipse cx="108" cy="53" rx="2.2" ry="1.4" fill="#6b4428" />
        <circle cx="48" cy="74" r="13" fill="#111827" />
        <circle cx="150" cy="74" r="13" fill="#111827" />
        <circle cx="48" cy="74" r="5" fill="#e5e7eb" />
        <circle cx="150" cy="74" r="5" fill="#e5e7eb" />
        <g className="light-bar">
          <rect x="86" y="22" width="36" height="10" rx="3" fill="#1f2937" />
          <rect x="88" y="24" width="14" height="6" rx="2" fill="#ef4444" className="red-light" />
          <rect x="106" y="24" width="14" height="6" rx="2" fill="#3b82f6" className="blue-light" />
        </g>
      </svg>
    </span>
  )
}
