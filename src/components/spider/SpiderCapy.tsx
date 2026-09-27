import type { CSSProperties } from 'react'

type Props = {
  size?: number | string
  shooting?: boolean
  suited?: boolean
  transforming?: boolean
}

/** Carlos as a normal capybara, then in a red web-slinging suit. */
export function SpiderCapy({ size = 220, shooting = false, suited = false, transforming = false }: Props) {
  const style = {
    width: size,
    height: typeof size === 'number' ? size * 1.05 : undefined,
  } as CSSProperties

  return (
    <div
      className={['spider-capy', suited ? 'suited' : 'plain', transforming ? 'transforming' : '', shooting ? 'shooting' : '']
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-hidden
    >
      <svg viewBox="0 0 200 210" className="spider-capy-svg">
        <ellipse cx="100" cy="198" rx="58" ry="8" fill="rgba(0,0,0,0.28)" />

        <g className="plain-body">
          <ellipse cx="62" cy="168" rx="16" ry="18" fill="#8f6540" />
          <ellipse cx="138" cy="168" rx="16" ry="18" fill="#8f6540" />
          <ellipse cx="100" cy="132" rx="56" ry="40" fill="#b88960" />
          <ellipse cx="100" cy="140" rx="38" ry="26" fill="#c99a70" />
          <ellipse cx="48" cy="124" rx="14" ry="18" fill="#b88960" transform="rotate(16 48 124)" />
          <ellipse cx="152" cy="124" rx="14" ry="18" fill="#b88960" transform="rotate(-16 152 124)" />
          <ellipse cx="100" cy="74" rx="44" ry="38" fill="#b88960" />
          <ellipse cx="100" cy="86" rx="28" ry="18" fill="#c99a70" />
          <ellipse cx="64" cy="50" rx="12" ry="14" fill="#8f6540" />
          <ellipse cx="136" cy="50" rx="12" ry="14" fill="#8f6540" />
          <ellipse cx="64" cy="50" rx="6" ry="7" fill="#d4a882" />
          <ellipse cx="136" cy="50" rx="6" ry="7" fill="#d4a882" />
          <ellipse cx="84" cy="72" rx="6" ry="7" fill="#2a1c12" />
          <ellipse cx="116" cy="72" rx="6" ry="7" fill="#2a1c12" />
          <circle cx="82" cy="70" r="2" fill="#fff" />
          <circle cx="114" cy="70" r="2" fill="#fff" />
          <ellipse cx="100" cy="90" rx="16" ry="11" fill="#c99a70" />
          <ellipse cx="94" cy="88" rx="3.2" ry="2.4" fill="#2a1c12" />
          <ellipse cx="106" cy="88" rx="3.2" ry="2.4" fill="#2a1c12" />
          <path d="M88 100 Q100 110 112 100" stroke="#6b4428" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        <g className="suit-body">
          <ellipse cx="62" cy="168" rx="16" ry="18" fill="#1d4ed8" />
          <ellipse cx="138" cy="168" rx="16" ry="18" fill="#1d4ed8" />

          <ellipse cx="100" cy="132" rx="58" ry="42" fill="#1d4ed8" />
          <path d="M48 118 Q100 96 152 118 L148 150 Q100 168 52 150 Z" fill="#dc2626" />
          <path d="M70 112 Q100 128 130 112" stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" />
          <path d="M64 128 Q100 146 136 128" stroke="#fff" strokeWidth="2" fill="none" opacity="0.65" />
          <path d="M78 108 L100 146 L122 108" stroke="#fff" strokeWidth="1.6" fill="none" opacity="0.55" />

          <ellipse cx="46" cy="118" rx="16" ry="22" fill="#dc2626" transform="rotate(24 46 118)" />
          <ellipse cx="154" cy="112" rx="16" ry="24" fill="#dc2626" transform="rotate(-36 154 112)" />
          <circle cx="168" cy="96" r="8" fill="#fecaca" className="wrist" />

          <ellipse cx="100" cy="72" rx="46" ry="40" fill="#dc2626" />
          <path d="M58 78 Q100 36 142 78 Q100 58 58 78" fill="#b91c1c" />

          <ellipse cx="78" cy="74" rx="16" ry="20" fill="#fff" transform="rotate(-12 78 74)" />
          <ellipse cx="122" cy="74" rx="16" ry="20" fill="#fff" transform="rotate(12 122 74)" />
          <ellipse cx="80" cy="76" rx="7" ry="10" fill="#0f172a" />
          <ellipse cx="124" cy="76" rx="7" ry="10" fill="#0f172a" />
          <circle cx="77" cy="72" r="2.4" fill="#fff" />
          <circle cx="121" cy="72" r="2.4" fill="#fff" />

          <path d="M88 96 Q100 104 112 96" stroke="#7f1d1d" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {shooting && (
          <g className="web-puff">
            <circle cx="176" cy="88" r="10" fill="#fff" opacity="0.9" />
            <circle cx="190" cy="78" r="5" fill="#fff" opacity="0.7" />
          </g>
        )}
      </svg>
      <span className="wrist-mark" />
    </div>
  )
}
