import type { CSSProperties } from 'react'
import type { GymCapy as GymCapyProfile } from '../../data/gymCapys'

export type WorkoutKind = 'lift' | 'jump' | 'run' | 'flex'

type Props = {
  capy: GymCapyProfile
  size?: number
  scale?: number
  workout?: WorkoutKind | null
  celebrating?: boolean
}

export function GymCapy({
  capy,
  size = 220,
  scale = 1,
  workout = null,
  celebrating = false,
}: Props) {
  const style = {
    ['--coat']: capy.coat,
    ['--belly']: capy.belly,
    ['--gym-accent']: capy.accent,
    width: size * scale,
    height: size * scale * 0.92,
  } as CSSProperties

  return (
    <div
      className={[
        'gym-capy',
        workout ? `doing-${workout}` : '',
        celebrating ? 'celebrating' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-hidden
    >
      <svg viewBox="0 0 200 190" className="gym-capy-svg">
        <ellipse cx="100" cy="178" rx="58" ry="9" fill="rgba(0,0,0,0.14)" />

        <g className="gym-capy-body">
          <ellipse cx="62" cy="156" rx="16" ry="18" fill="#8f6540" />
          <ellipse cx="138" cy="156" rx="16" ry="18" fill="#8f6540" />

          <ellipse cx="100" cy="122" rx={52 + scale * 8} ry={38 + scale * 6} fill="var(--coat)" />
          <ellipse cx="100" cy="128" rx={38 + scale * 6} ry={26 + scale * 4} fill="var(--belly)" />

          <g className="gym-capy-arms">
            <ellipse cx="48" cy="118" rx="16" ry="22" fill="var(--coat)" transform="rotate(18 48 118)" />
            <ellipse cx="152" cy="118" rx="16" ry="22" fill="var(--coat)" transform="rotate(-18 152 118)" />
            {workout === 'lift' && (
              <>
                <rect x="22" y="92" width="52" height="8" rx="4" fill="#2f2f2f" />
                <circle cx="22" cy="96" r="12" fill="#444" />
                <circle cx="74" cy="96" r="12" fill="#444" />
                <rect x="126" y="92" width="52" height="8" rx="4" fill="#2f2f2f" />
                <circle cx="126" cy="96" r="12" fill="#444" />
                <circle cx="178" cy="96" r="12" fill="#444" />
              </>
            )}
          </g>

          <ellipse cx="100" cy="72" rx="44" ry="38" fill="var(--coat)" />
          <ellipse cx="100" cy="82" rx="28" ry="20" fill="var(--belly)" />

          <ellipse cx="66" cy="50" rx="12" ry="14" fill="#8f6540" />
          <ellipse cx="134" cy="50" rx="12" ry="14" fill="#8f6540" />
          <ellipse cx="66" cy="50" rx="6" ry="7" fill="#d4a882" />
          <ellipse cx="134" cy="50" rx="6" ry="7" fill="#d4a882" />

          <ellipse cx="82" cy="68" rx="6" ry="7" fill="#2a1c12" />
          <ellipse cx="118" cy="68" rx="6" ry="7" fill="#2a1c12" />
          <circle cx="80" cy="66" r="2" fill="#fff" />
          <circle cx="116" cy="66" r="2" fill="#fff" />

          <ellipse cx="100" cy="86" rx="16" ry="12" fill="var(--belly)" />
          <ellipse cx="94" cy="84" rx="3.5" ry="2.6" fill="#2a1c12" />
          <ellipse cx="106" cy="84" rx="3.5" ry="2.6" fill="#2a1c12" />
          <path
            d="M86 96 Q100 108 114 96"
            stroke="#6b4428"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          <path d="M58 48 Q100 18 142 48" fill="var(--gym-accent)" opacity="0.95" />
          <ellipse cx="100" cy="48" rx="46" ry="12" fill="var(--gym-accent)" />
          <text
            x="100"
            y="52"
            textAnchor="middle"
            fontFamily="Fredoka, Nunito, sans-serif"
            fontSize="11"
            fontWeight="800"
            fill="#1a1a1a"
          >
            GYM
          </text>
        </g>
      </svg>
    </div>
  )
}
