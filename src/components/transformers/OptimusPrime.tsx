import './transformers.css'

export type OptimusForm = 'truck' | 'toRobot' | 'toTruck' | 'robot'
export type OptimusPose = 'idle' | 'attack' | 'win' | 'driveIn' | 'driveOut' | 'ram'

interface OptimusPrimeProps {
  form: OptimusForm
  pose?: OptimusPose
  onClick?: () => void
}

export function OptimusPrime({ form, pose = 'idle', onClick }: OptimusPrimeProps) {
  const isTransforming = form === 'toRobot' || form === 'toTruck'
  const showTruck = form === 'truck' || isTransforming
  const showRobot = form === 'robot' || isTransforming

  const className = [
    'tf-optimus',
    form,
    pose,
    onClick ? 'clickable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const Tag = onClick ? 'button' : 'div'
  const label =
    form === 'truck' || form === 'toTruck' ? 'Optimus (Truck)' : 'Optimus Prime'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={className}
      onClick={onClick}
      aria-label={label}
    >
      <div className="tf-optimus-stage">
        {showTruck && (
          <svg viewBox="0 0 220 140" className="tf-truck-svg" aria-hidden="true">
            <rect x="18" y="48" width="78" height="52" rx="10" fill="#1f4f9c" />
            <rect x="28" y="56" width="40" height="22" rx="4" fill="#7ec8ff" opacity="0.85" />
            <rect x="18" y="88" width="78" height="14" fill="#c62828" />
            <rect x="30" y="28" width="8" height="24" rx="2" fill="#c0c6d4" />
            <rect x="48" y="24" width="8" height="28" rx="2" fill="#c0c6d4" />
            <rect x="92" y="42" width="110" height="60" rx="8" fill="#c62828" />
            <rect x="102" y="52" width="90" height="18" rx="4" fill="#1f4f9c" />
            <circle cx="147" cy="62" r="10" fill="#f0c040" />
            <path d="M139 58h16l-8 14z" fill="#1f4f9c" />
            <circle cx="40" cy="112" r="16" fill="#222831" />
            <circle cx="40" cy="112" r="8" fill="#f0c040" />
            <circle cx="78" cy="112" r="16" fill="#222831" />
            <circle cx="78" cy="112" r="8" fill="#f0c040" />
            <circle cx="130" cy="112" r="16" fill="#222831" />
            <circle cx="130" cy="112" r="8" fill="#f0c040" />
            <circle cx="180" cy="112" r="16" fill="#222831" />
            <circle cx="180" cy="112" r="8" fill="#f0c040" />
            <circle cx="22" cy="78" r="5" fill="#ffe08a" />
            <circle cx="22" cy="92" r="5" fill="#ffe08a" />
          </svg>
        )}

        {showRobot && (
          <svg viewBox="0 0 160 200" className="tf-robot-svg tf-optimus-robot" aria-hidden="true">
            <rect x="48" y="140" width="22" height="40" rx="6" fill="#1f4f9c" className="part leg-l" />
            <rect x="90" y="140" width="22" height="40" rx="6" fill="#1f4f9c" className="part leg-r" />
            <rect x="44" y="172" width="30" height="12" rx="4" fill="#c62828" className="part foot-l" />
            <rect x="86" y="172" width="30" height="12" rx="4" fill="#c62828" className="part foot-r" />

            <rect x="40" y="70" width="80" height="72" rx="12" fill="#1f4f9c" className="part torso" />
            <rect x="52" y="82" width="56" height="36" rx="8" fill="#c62828" className="part chest" />
            <circle cx="80" cy="100" r="12" fill="#f0c040" className="part badge" />
            <path d="M72 96h16l-8 14z" fill="#1f4f9c" className="part badge" />

            <rect x="18" y="78" width="22" height="48" rx="8" fill="#1f4f9c" className="part arm-l" />
            <rect x="120" y="78" width="22" height="48" rx="8" fill="#1f4f9c" className="part arm-r" />
            <circle cx="29" cy="132" r="10" fill="#f0c040" className="part fist-l" />
            <circle cx="131" cy="132" r="10" fill="#f0c040" className="part fist-r" />

            <rect x="46" y="66" width="8" height="22" rx="2" fill="#c0c6d4" className="part stack-l" />
            <rect x="106" y="66" width="8" height="22" rx="2" fill="#c0c6d4" className="part stack-r" />

            <rect x="58" y="28" width="44" height="40" rx="8" fill="#c0c6d4" className="part head" />
            <rect x="64" y="36" width="32" height="18" rx="4" fill="#1f4f9c" className="part face" />
            <circle cx="72" cy="45" r="3.5" fill="#9ef0ff" className="part face" />
            <circle cx="88" cy="45" r="3.5" fill="#9ef0ff" className="part face" />
            <rect x="70" y="58" width="20" height="6" rx="2" fill="#f0c040" className="part mouth" />
            <path d="M80 12l12 18H68z" fill="#f0c040" className="part crest" />
          </svg>
        )}

        {isTransforming && (
          <div className="tf-transform-fx" aria-hidden="true">
            <span className="ring r1" />
            <span className="ring r2" />
            <span className="spark s1">✦</span>
            <span className="spark s2">✧</span>
            <span className="spark s3">✦</span>
          </div>
        )}
      </div>
      <span className="tf-robot-name">{label}</span>
    </Tag>
  )
}
