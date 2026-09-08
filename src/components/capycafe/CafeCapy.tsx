import type { CSSProperties } from 'react'
import type { CafeCapy as CafeCapyProfile } from '../../data/cafeCapys'

type Props = {
  capy: CafeCapyProfile
  size?: number
  chef?: boolean
  eating?: boolean
  waiting?: boolean
}

export function CafeCapy({
  capy,
  size = 160,
  chef = false,
  eating = false,
  waiting = false,
}: Props) {
  const style = {
    ['--coat']: capy.coat,
    ['--belly']: capy.belly,
    ['--cafe-accent']: capy.accent,
    width: size,
    height: size * 0.95,
  } as CSSProperties

  return (
    <div
      className={['cc-capy', chef ? 'chef' : '', eating ? 'eating' : '', waiting ? 'waiting' : '']
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-hidden
    >
      <svg viewBox="0 0 180 170" className="cc-capy-svg">
        <ellipse cx="90" cy="160" rx="48" ry="8" fill="rgba(0,0,0,0.12)" />

        <g className="cc-capy-body">
          <ellipse cx="58" cy="148" rx="12" ry="14" fill="#8f6540" />
          <ellipse cx="122" cy="148" rx="12" ry="14" fill="#8f6540" />

          <ellipse cx="90" cy="118" rx="52" ry="38" fill="var(--coat)" />
          <ellipse cx="90" cy="124" rx="40" ry="28" fill="var(--belly)" />

          <ellipse cx="90" cy="78" rx="42" ry="36" fill="var(--coat)" />
          <ellipse cx="90" cy="88" rx="28" ry="20" fill="var(--belly)" />

          <ellipse cx="58" cy="58" rx="10" ry="12" fill="#8f6540" />
          <ellipse cx="122" cy="58" rx="10" ry="12" fill="#8f6540" />
          <ellipse cx="58" cy="58" rx="5" ry="6" fill="#d4a882" />
          <ellipse cx="122" cy="58" rx="5" ry="6" fill="#d4a882" />

          <ellipse cx="74" cy="74" rx="5" ry="6" fill="#2a1c12" />
          <ellipse cx="106" cy="74" rx="5" ry="6" fill="#2a1c12" />
          <circle cx="72" cy="72" r="1.8" fill="#fff" />
          <circle cx="104" cy="72" r="1.8" fill="#fff" />

          <ellipse cx="90" cy="92" rx="16" ry="12" fill="var(--belly)" />
          <ellipse cx="84" cy="90" rx="3.5" ry="2.5" fill="#2a1c12" />
          <ellipse cx="96" cy="90" rx="3.5" ry="2.5" fill="#2a1c12" />
          <path
            d="M82 100 Q90 106 98 100"
            stroke="#6b4428"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {chef && (
            <g className="cc-chef-hat">
              <ellipse cx="90" cy="46" rx="40" ry="10" fill="#fff8ef" />
              <ellipse cx="90" cy="28" rx="28" ry="22" fill="#fff" />
              <ellipse cx="70" cy="30" rx="14" ry="16" fill="#fff8ef" />
              <ellipse cx="110" cy="30" rx="14" ry="16" fill="#fff8ef" />
              <rect x="72" y="42" width="36" height="10" rx="3" fill="#fff" />
            </g>
          )}

          {eating && (
            <g className="cc-spoon">
              <rect x="118" y="86" width="6" height="28" rx="3" fill="#c9a06e" transform="rotate(-28 121 100)" />
              <ellipse cx="132" cy="78" rx="10" ry="8" fill="#e8d5b0" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}
