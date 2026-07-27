import type { RobotProfile } from '../../data/transformers'
import './transformers.css'

interface RobotProps {
  profile: RobotProfile
  pose?: 'idle' | 'hit' | 'ko' | 'windup' | 'fly'
  size?: 'md' | 'lg'
  mirror?: boolean
  onClick?: () => void
}

export function Robot({
  profile,
  pose = 'idle',
  size = 'md',
  mirror = false,
  onClick,
}: RobotProps) {
  const className = [
    'tf-robot',
    size,
    pose,
    mirror ? 'mirror' : '',
    onClick ? 'clickable' : '',
    `bot-${profile.id}`,
  ]
    .filter(Boolean)
    .join(' ')

  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={className}
      onClick={onClick}
      aria-label={profile.name}
    >
      <svg viewBox="0 0 160 200" className="tf-robot-svg" aria-hidden="true">
        <rect x="48" y="140" width="22" height="40" rx="6" fill={profile.primary} />
        <rect x="90" y="140" width="22" height="40" rx="6" fill={profile.primary} />
        <rect x="44" y="172" width="30" height="12" rx="4" fill={profile.secondary} />
        <rect x="86" y="172" width="30" height="12" rx="4" fill={profile.secondary} />

        <rect x="40" y="70" width="80" height="72" rx="12" fill={profile.primary} />
        <rect x="52" y="82" width="56" height="36" rx="8" fill={profile.secondary} />
        <circle cx="80" cy="100" r="10" fill={profile.accent} />
        <path d="M70 94h20v12H70z" fill={profile.primary} />

        <rect x="18" y="78" width="22" height="48" rx="8" fill={profile.primary} />
        <rect x="120" y="78" width="22" height="48" rx="8" fill={profile.primary} />
        <circle cx="29" cy="132" r="10" fill={profile.accent} />
        <circle cx="131" cy="132" r="10" fill={profile.accent} />

        <rect x="58" y="28" width="44" height="40" rx="8" fill={profile.secondary} />
        <rect x="64" y="36" width="32" height="18" rx="4" fill={profile.primary} />
        <circle cx="72" cy="45" r="3.5" fill="#ff8a8a" />
        <circle cx="88" cy="45" r="3.5" fill="#ff8a8a" />
        <rect x="70" y="58" width="20" height="6" rx="2" fill={profile.accent} />

        <rect x="66" y="14" width="6" height="16" rx="2" fill={profile.accent} />
        <rect x="88" y="14" width="6" height="16" rx="2" fill={profile.accent} />
        <path d="M40 70l-16-18 10 28z" fill={profile.accent} />
        <path d="M120 70l16-18-10 28z" fill={profile.accent} />

        {profile.id === 'starscream' && (
          <>
            <path d="M20 90l-18 8 18 8z" fill={profile.secondary} className="wing" />
            <path d="M140 90l18 8-18 8z" fill={profile.secondary} className="wing" />
          </>
        )}
      </svg>
      <span className="tf-robot-name">{profile.name}</span>
    </Tag>
  )
}
