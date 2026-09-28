import type { CSSProperties } from 'react'

type Props = {
  size?: number | string
  /** Blue police hat and shirt. */
  officer?: boolean
}

/** Carlos the capybara. Pass officer for the police uniform. */
export function CopCapy({ size = 160, officer = true }: Props) {
  const style = {
    width: size,
    height: typeof size === 'number' ? size * 0.95 : undefined,
  } as CSSProperties

  return (
    <div className="cop-capy" style={style} aria-hidden>
      <svg viewBox="0 0 180 170" className="cop-svg">
        <ellipse cx="90" cy="160" rx="48" ry="8" fill="rgba(0,0,0,0.15)" />
        <ellipse cx="58" cy="148" rx="12" ry="14" fill="#8f6540" />
        <ellipse cx="122" cy="148" rx="12" ry="14" fill="#8f6540" />
        <ellipse cx="90" cy="118" rx="52" ry="38" fill={officer ? '#1d4ed8' : '#b88960'} />
        <ellipse cx="90" cy="128" rx="34" ry="22" fill={officer ? '#3b82f6' : '#c99a70'} />
        {officer && <circle cx="90" cy="126" r="8" fill="#facc15" />}
        {officer && <text x="90" y="129" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1e3a8a">★</text>}
        <ellipse cx="90" cy="74" rx="42" ry="36" fill="#b88960" />
        <ellipse cx="90" cy="86" rx="26" ry="16" fill="#c99a70" />
        <ellipse cx="56" cy="52" rx="10" ry="12" fill="#8f6540" />
        <ellipse cx="124" cy="52" rx="10" ry="12" fill="#8f6540" />
        <ellipse cx="56" cy="52" rx="5" ry="6" fill="#d4a882" />
        <ellipse cx="124" cy="52" rx="5" ry="6" fill="#d4a882" />
        <ellipse cx="74" cy="72" rx="5" ry="6" fill="#2a1c12" />
        <ellipse cx="106" cy="72" rx="5" ry="6" fill="#2a1c12" />
        <circle cx="72" cy="70" r="1.6" fill="#fff" />
        <circle cx="104" cy="70" r="1.6" fill="#fff" />
        <ellipse cx="90" cy="90" rx="14" ry="10" fill="#c99a70" />
        <ellipse cx="85" cy="88" rx="3" ry="2.2" fill="#2a1c12" />
        <ellipse cx="95" cy="88" rx="3" ry="2.2" fill="#2a1c12" />
        <path d="M80 98 Q90 106 100 98" stroke="#6b4428" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {officer && (
          <g>
            <ellipse cx="90" cy="40" rx="40" ry="10" fill="#1e3a8a" />
            <path d="M54 40 Q90 12 126 40" fill="#1d4ed8" />
            <rect x="78" y="18" width="24" height="10" rx="2" fill="#facc15" />
          </g>
        )}
      </svg>
    </div>
  )
}
