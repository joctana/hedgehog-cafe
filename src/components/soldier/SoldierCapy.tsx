import type { CSSProperties } from 'react'

type Props = {
  size?: number | string
  /** Olive practice shirt. */
  uniform?: boolean
  /** Helmet. */
  gear?: boolean
  /** Green night-vision goggles over the eyes. */
  goggles?: boolean
  /** Chubby toy blaster, only on the range. */
  blaster?: boolean
  /** Brief pop when a piece of kit lands. */
  dressing?: boolean
  /** Nudge when a paper target is starred. */
  shooting?: boolean
}

/** Carlos the capybara, dressed for paper-target practice. */
export function SoldierCapy({
  size = 160,
  uniform = true,
  gear = true,
  goggles = false,
  blaster = false,
  dressing = false,
  shooting = false,
}: Props) {
  const style = {
    width: size,
    height: typeof size === 'number' ? size * 0.95 : undefined,
  } as CSSProperties

  return (
    <div
      className={['soldier-capy', dressing ? 'dressing' : '', shooting ? 'shooting' : ''].filter(Boolean).join(' ')}
      style={style}
      aria-hidden
    >
      <svg viewBox="0 0 180 170" className="soldier-svg">
        <ellipse cx="90" cy="160" rx="48" ry="8" fill="rgba(0,0,0,0.15)" />
        <ellipse cx="58" cy="148" rx="12" ry="14" fill="#8f6540" />
        <ellipse cx="122" cy="148" rx="12" ry="14" fill="#8f6540" />
        <g className="plain-torso">
          <ellipse cx="90" cy="118" rx="52" ry="38" fill="#b88960" />
          <ellipse cx="90" cy="128" rx="34" ry="22" fill="#c99a70" />
        </g>
        <g className={`uniform-kit ${uniform ? 'on' : ''}`}>
          <ellipse cx="90" cy="118" rx="52" ry="38" fill="#4d7c0f" />
          <ellipse cx="90" cy="128" rx="34" ry="22" fill="#65a30d" />
          <circle cx="90" cy="126" r="8" fill="#facc15" />
          <text x="90" y="129" textAnchor="middle" fontSize="9" fontWeight="800" fill="#3f6212">
            ★
          </text>
        </g>
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
        <g className={`gear-kit ${gear ? 'on' : ''}`}>
          <ellipse cx="90" cy="46" rx="36" ry="8" fill="#3f6212" />
          <path d="M58 46 Q90 14 122 46" fill="#4d7c0f" />
          <rect x="78" y="20" width="24" height="8" rx="2" fill="#facc15" />
        </g>
        <g className={`goggle-kit ${goggles ? 'on' : ''}`}>
          <path d="M62 70 H118" stroke="#14532d" strokeWidth="5" strokeLinecap="round" />
          <rect x="60" y="64" width="26" height="16" rx="6" fill="#166534" />
          <rect x="94" y="64" width="26" height="16" rx="6" fill="#166534" />
          <circle cx="73" cy="72" r="6" fill="#4ade80" />
          <circle cx="107" cy="72" r="6" fill="#4ade80" />
          <circle cx="71" cy="70" r="2" fill="#ecfccb" />
          <circle cx="105" cy="70" r="2" fill="#ecfccb" />
        </g>
        {blaster && (
          <g className="toy-blaster">
            <rect x="124" y="112" width="40" height="16" rx="8" fill="#84cc16" />
            <rect x="156" y="114" width="16" height="12" rx="5" fill="#facc15" />
            <circle className="pew-dot" cx="176" cy="120" r="5" fill="#fef08a" />
          </g>
        )}
      </svg>
    </div>
  )
}
