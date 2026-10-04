import type { CSSProperties } from 'react'

type Props = {
  coat: string
  belly: string
  size?: number | string
  /** Pink bow so Coco is easy to tell apart. */
  bow?: boolean
}

/** A small capybara standing at the bottom of a block tower. */
export function TowerCapy({ coat, belly, size = 120, bow = false }: Props) {
  const style = { width: size } as CSSProperties
  return (
    <div className="tower-capy" style={style} aria-hidden>
      <svg viewBox="0 0 140 120" className="tower-svg">
        <ellipse cx="70" cy="112" rx="36" ry="6" fill="rgba(0,0,0,0.12)" />
        <ellipse cx="46" cy="100" rx="10" ry="12" fill={coat} />
        <ellipse cx="94" cy="100" rx="10" ry="12" fill={coat} />
        <ellipse cx="70" cy="78" rx="40" ry="28" fill={coat} />
        <ellipse cx="70" cy="86" rx="24" ry="16" fill={belly} />
        <ellipse cx="70" cy="46" rx="32" ry="26" fill={coat} />
        <ellipse cx="70" cy="54" rx="18" ry="12" fill={belly} />
        <ellipse cx="44" cy="30" rx="8" ry="10" fill={coat} />
        <ellipse cx="96" cy="30" rx="8" ry="10" fill={coat} />
        <ellipse cx="44" cy="30" rx="4" ry="5" fill={belly} />
        <ellipse cx="96" cy="30" rx="4" ry="5" fill={belly} />
        <ellipse cx="58" cy="46" rx="4" ry="5" fill="#2a1c12" />
        <ellipse cx="82" cy="46" rx="4" ry="5" fill="#2a1c12" />
        <circle cx="57" cy="44" r="1.3" fill="#fff" />
        <circle cx="81" cy="44" r="1.3" fill="#fff" />
        <ellipse cx="70" cy="56" rx="10" ry="7" fill={belly} />
        <ellipse cx="66" cy="55" rx="2.2" ry="1.6" fill="#2a1c12" />
        <ellipse cx="74" cy="55" rx="2.2" ry="1.6" fill="#2a1c12" />
        <path d="M62 64 Q70 70 78 64" stroke="#6b4428" strokeWidth="2" fill="none" strokeLinecap="round" />
        {bow && (
          <g>
            <circle cx="56" cy="22" r="6" fill="#fb7185" />
            <circle cx="70" cy="20" r="6" fill="#fb7185" />
            <circle cx="63" cy="24" r="3.2" fill="#be185d" />
          </g>
        )}
      </svg>
    </div>
  )
}
