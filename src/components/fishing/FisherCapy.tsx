import type { CSSProperties } from 'react'

type Props = {
  size?: number | string
  scooping?: boolean
  eating?: boolean
  cooking?: boolean
  showNet?: boolean
}

/** Carlos on the riverbank, with a net, a spoon, or a grill mood. */
export function FisherCapy({
  size = 160,
  scooping = false,
  eating = false,
  cooking = false,
  showNet = true,
}: Props) {
  const style = {
    width: size,
    height: typeof size === 'number' ? size * 0.95 : undefined,
  } as CSSProperties

  return (
    <div
      className={['fisher-capy', scooping ? 'scooping' : '', eating ? 'eating' : '', cooking ? 'cooking' : '']
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-hidden
    >
      <svg viewBox="0 0 180 170" className="fisher-capy-svg">
        <ellipse cx="90" cy="160" rx="48" ry="8" fill="rgba(0,0,0,0.12)" />
        <g className="fisher-body">
          <ellipse cx="58" cy="148" rx="12" ry="14" fill="#8f6540" />
          <ellipse cx="122" cy="148" rx="12" ry="14" fill="#8f6540" />
          <ellipse cx="90" cy="118" rx="52" ry="38" fill="#b88960" />
          <ellipse cx="90" cy="124" rx="40" ry="28" fill="#c99a70" />
          <ellipse cx="90" cy="78" rx="42" ry="36" fill="#b88960" />
          <ellipse cx="90" cy="88" rx="28" ry="20" fill="#c99a70" />
          <ellipse cx="58" cy="58" rx="10" ry="12" fill="#8f6540" />
          <ellipse cx="122" cy="58" rx="10" ry="12" fill="#8f6540" />
          <ellipse cx="58" cy="58" rx="5" ry="6" fill="#d4a882" />
          <ellipse cx="122" cy="58" rx="5" ry="6" fill="#d4a882" />
          <ellipse cx="74" cy="74" rx="5" ry="6" fill="#2a1c12" />
          <ellipse cx="106" cy="74" rx="5" ry="6" fill="#2a1c12" />
          <circle cx="72" cy="72" r="1.8" fill="#fff" />
          <circle cx="104" cy="72" r="1.8" fill="#fff" />
          <ellipse cx="90" cy="92" rx="16" ry="12" fill="#c99a70" />
          <ellipse cx="84" cy="90" rx="3.5" ry="2.5" fill="#2a1c12" />
          <ellipse cx="96" cy="90" rx="3.5" ry="2.5" fill="#2a1c12" />
          <path d="M82 100 Q90 106 98 100" stroke="#6b4428" strokeWidth="2" fill="none" strokeLinecap="round" />

          <g className="fisher-hat">
            <ellipse cx="90" cy="46" rx="46" ry="10" fill="#e7c07a" />
            <path d="M52 46 Q90 16 128 46" fill="#f6d48a" />
            <path d="M70 34 h40" stroke="#c2410c" strokeWidth="4" strokeLinecap="round" />
          </g>

          {eating && (
            <g className="fisher-spoon">
              <rect x="124" y="96" width="5" height="30" rx="2.5" fill="#c9a06e" transform="rotate(-32 126 111)" />
              <ellipse cx="112" cy="96" rx="8" ry="6" fill="#e8d5b0" transform="rotate(-32 112 96)" />
            </g>
          )}
        </g>

        {showNet && !eating && (
          <g className="fisher-net">
            <rect x="136" y="78" width="8" height="62" rx="4" fill="#a16207" transform="rotate(18 140 100)" />
            <circle cx="154" cy="70" r="22" fill="none" stroke="#f8fafc" strokeWidth="3" />
            <path d="M138 58 h32 M138 70 h32 M138 82 h32 M146 50 v40 M158 50 v40 M170 50 v40" stroke="#e2e8f0" strokeWidth="1.4" />
          </g>
        )}
      </svg>
    </div>
  )
}
