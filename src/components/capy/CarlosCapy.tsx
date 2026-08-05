import type { CSSProperties } from 'react'

type Props = {
  size?: number
  waving?: boolean
}

/** Carlos the capybara in a yellow hard hat. */
export function CarlosCapy({ size = 160, waving = false }: Props) {
  const style = { width: size, height: size * 0.95 } as CSSProperties

  return (
    <div className={`capy-carlos ${waving ? 'waving' : ''}`} style={style} aria-hidden>
      <svg viewBox="0 0 180 170" className="capy-carlos-svg">
        <ellipse cx="90" cy="160" rx="48" ry="8" fill="rgba(0,0,0,0.12)" />

        {/* body */}
        <ellipse cx="90" cy="118" rx="52" ry="38" fill="#a67c52" />
        <ellipse cx="90" cy="124" rx="40" ry="28" fill="#b88960" />

        {/* legs */}
        <ellipse cx="58" cy="148" rx="12" ry="14" fill="#8f6540" />
        <ellipse cx="122" cy="148" rx="12" ry="14" fill="#8f6540" />

        {/* head */}
        <ellipse cx="90" cy="78" rx="42" ry="36" fill="#b88960" />
        <ellipse cx="90" cy="88" rx="28" ry="20" fill="#c99a70" />

        {/* ears */}
        <ellipse cx="58" cy="58" rx="10" ry="12" fill="#8f6540" />
        <ellipse cx="122" cy="58" rx="10" ry="12" fill="#8f6540" />
        <ellipse cx="58" cy="58" rx="5" ry="6" fill="#d4a882" />
        <ellipse cx="122" cy="58" rx="5" ry="6" fill="#d4a882" />

        {/* eyes */}
        <ellipse cx="74" cy="74" rx="5" ry="6" fill="#2a1c12" />
        <ellipse cx="106" cy="74" rx="5" ry="6" fill="#2a1c12" />
        <circle cx="72" cy="72" r="1.8" fill="#fff" />
        <circle cx="104" cy="72" r="1.8" fill="#fff" />

        {/* snout */}
        <ellipse cx="90" cy="92" rx="16" ry="12" fill="#c99a70" />
        <ellipse cx="84" cy="90" rx="3.5" ry="2.5" fill="#2a1c12" />
        <ellipse cx="96" cy="90" rx="3.5" ry="2.5" fill="#2a1c12" />
        <path d="M82 100 Q90 106 98 100" stroke="#6b4428" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* hard hat */}
        <ellipse cx="90" cy="48" rx="44" ry="16" fill="#f5c518" />
        <path d="M50 48 Q50 22 90 18 Q130 22 130 48 Z" fill="#ffd84d" />
        <path d="M55 46 Q90 28 125 46" fill="#f0b800" opacity="0.35" />
        {/* name tag */}
        <rect x="68" y="30" width="44" height="20" rx="3" fill="#fff" />
        <text
          x="90"
          y="41"
          textAnchor="middle"
          fontFamily="Fredoka, Nunito, sans-serif"
          fontSize="8"
          fontWeight="800"
          fill="#1a1a1a"
        >
          CARLOS
        </text>
        <text x="90" y="48" textAnchor="middle" fontSize="7" fill="#1a1a1a">
          ♥
        </text>
      </svg>
    </div>
  )
}
