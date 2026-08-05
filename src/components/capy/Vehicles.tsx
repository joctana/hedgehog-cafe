import type { CSSProperties } from 'react'

type TruckProps = {
  size?: number
  load?: number
  dumping?: boolean
}

export function DumpTruck({ size = 200, load = 0, dumping = false }: TruckProps) {
  const style = { width: size, height: size * 0.62 } as CSSProperties
  const sandH = Math.max(0, Math.min(1, load)) * 28

  return (
    <div className={`capy-truck ${dumping ? 'dumping' : ''}`} style={style} aria-hidden>
      <svg viewBox="0 0 220 130" className="capy-vehicle-svg">
        <ellipse cx="110" cy="122" rx="90" ry="8" fill="rgba(0,0,0,0.12)" />
        {/* bed */}
        <g className="truck-bed">
          <path d="M20 48 L150 48 L150 95 L28 95 Z" fill="#f5c518" stroke="#c99500" strokeWidth="2" />
          <path d="M28 52 L142 52 L142 70 L28 70 Z" fill="#e6b000" opacity="0.4" />
          {sandH > 0 && (
            <ellipse
              cx="88"
              cy={90 - sandH * 0.35}
              rx="48"
              ry={8 + sandH * 0.35}
              fill="#d2b48c"
            />
          )}
        </g>
        {/* cab */}
        <path d="M150 55 L200 55 L205 95 L150 95 Z" fill="#ffd84d" stroke="#c99500" strokeWidth="2" />
        <path d="M158 60 L195 60 L198 82 L158 82 Z" fill="#7ec8ff" opacity="0.85" />
        {/* wheels */}
        <circle cx="50" cy="100" r="16" fill="#222" />
        <circle cx="50" cy="100" r="7" fill="#888" />
        <circle cx="110" cy="100" r="16" fill="#222" />
        <circle cx="110" cy="100" r="7" fill="#888" />
        <circle cx="180" cy="100" r="16" fill="#222" />
        <circle cx="180" cy="100" r="7" fill="#888" />
        {/* Carlos peeking in cab */}
        <ellipse cx="176" cy="72" rx="10" ry="9" fill="#b88960" />
        <path d="M166 62 Q176 52 186 62" fill="#ffd84d" />
      </svg>
    </div>
  )
}

type ExcavatorProps = {
  size?: number
  load?: number
  digging?: boolean
}

export function Excavator({ size = 200, load = 0, digging = false }: ExcavatorProps) {
  const style = { width: size, height: size * 0.72 } as CSSProperties
  const sand = Math.max(0, Math.min(1, load))

  return (
    <div className={`capy-excavator ${digging ? 'digging' : ''}`} style={style} aria-hidden>
      <svg viewBox="0 0 220 160" className="capy-vehicle-svg">
        <ellipse cx="90" cy="150" rx="70" ry="8" fill="rgba(0,0,0,0.12)" />
        {/* tracks */}
        <rect x="20" y="118" width="120" height="22" rx="10" fill="#3a3a3a" />
        <rect x="28" y="122" width="104" height="14" rx="6" fill="#555" />
        {/* body */}
        <rect x="40" y="78" width="90" height="44" rx="8" fill="#f5c518" stroke="#c99500" strokeWidth="2" />
        <rect x="55" y="85" width="40" height="28" rx="4" fill="#7ec8ff" opacity="0.85" />
        {/* Carlos in cab */}
        <ellipse cx="74" cy="98" rx="9" ry="8" fill="#b88960" />
        <path d="M65 90 Q74 80 83 90" fill="#ffd84d" />
        {/* boom */}
        <g className="ex-arm">
          <path d="M120 90 L175 45" stroke="#e6b000" strokeWidth="14" strokeLinecap="round" />
          <path d="M175 45 L200 78" stroke="#f5c518" strokeWidth="12" strokeLinecap="round" />
          {/* bucket */}
          <path
            d="M188 72 L210 72 L215 95 L185 95 Z"
            fill="#d4a017"
            stroke="#a67c00"
            strokeWidth="2"
          />
          {sand > 0.05 && (
            <ellipse cx="200" cy="88" rx={10 + sand * 4} ry={4 + sand * 6} fill="#d2b48c" />
          )}
        </g>
      </svg>
    </div>
  )
}
