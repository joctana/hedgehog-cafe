import type { CSSProperties } from 'react'

export type BaddieKind = 'snatcher' | 'bot' | 'gloom'

type Props = {
  kind: BaddieKind
  webbed?: boolean
  size?: number
}

const LABEL: Record<BaddieKind, string> = {
  snatcher: 'snack snatcher',
  bot: 'mischief bot',
  gloom: 'grumpy gloom',
}

export function baddieLabel(kind: BaddieKind) {
  return LABEL[kind]
}

/** Silly troublemakers. Webbing them tangles them up; it does not hurt them. */
export function Troublemaker({ kind, webbed = false, size = 120 }: Props) {
  const style = { width: size, height: size } as CSSProperties

  return (
    <span className={`t-art kind-${kind} ${webbed ? 'webbed' : ''}`} style={style} aria-hidden>
      <svg viewBox="0 0 120 120" className="t-svg">
        {kind === 'snatcher' && (
          <g>
            <ellipse cx="60" cy="108" rx="28" ry="6" fill="rgba(0,0,0,0.2)" />
            <ellipse cx="60" cy="78" rx="32" ry="26" fill="#6d28d9" />
            <ellipse cx="60" cy="84" rx="20" ry="14" fill="#c4b5fd" />
            <ellipse cx="60" cy="46" rx="26" ry="22" fill="#7c3aed" />
            <ellipse cx="40" cy="30" rx="8" ry="12" fill="#5b21b6" />
            <ellipse cx="80" cy="30" rx="8" ry="12" fill="#5b21b6" />
            <circle cx="50" cy="46" r="4" fill="#0f172a" />
            <circle cx="72" cy="46" r="4" fill="#0f172a" />
            <path d="M50 58 Q60 52 70 58" stroke="#2e1065" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="92" cy="70" r="10" fill="#fb923c" />
            <path d="M92 62 q4 -8 8 0" stroke="#166534" strokeWidth="2" fill="none" />
          </g>
        )}
        {kind === 'bot' && (
          <g>
            <ellipse cx="60" cy="108" rx="26" ry="6" fill="rgba(0,0,0,0.2)" />
            <rect x="28" y="40" width="64" height="52" rx="14" fill="#64748b" />
            <rect x="36" y="48" width="48" height="28" rx="8" fill="#0f172a" />
            <circle cx="50" cy="62" r="5" fill="#facc15" />
            <circle cx="70" cy="62" r="5" fill="#facc15" />
            <path d="M48 78 Q60 86 72 78" stroke="#e2e8f0" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="54" y="24" width="12" height="18" rx="4" fill="#94a3b8" />
            <circle cx="60" cy="20" r="6" fill="#f87171" />
          </g>
        )}
        {kind === 'gloom' && (
          <g>
            <ellipse cx="60" cy="108" rx="28" ry="6" fill="rgba(0,0,0,0.2)" />
            <ellipse cx="60" cy="70" rx="36" ry="32" fill="#16a34a" />
            <ellipse cx="60" cy="78" rx="22" ry="16" fill="#86efac" />
            <path d="M42 52 L52 62" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
            <path d="M78 52 L68 62" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
            <circle cx="48" cy="66" r="4" fill="#0f172a" />
            <circle cx="74" cy="66" r="4" fill="#0f172a" />
            <path d="M48 84 Q60 76 72 84" stroke="#14532d" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
        {webbed && (
          <g className="cocoon">
            <ellipse cx="60" cy="72" rx="40" ry="34" fill="rgba(255,255,255,0.55)" />
            <path d="M24 60 Q60 40 96 66" stroke="#fff" strokeWidth="3" fill="none" />
            <path d="M26 78 Q60 58 98 82" stroke="#fff" strokeWidth="3" fill="none" />
            <path d="M30 94 Q60 76 94 96" stroke="#fff" strokeWidth="3" fill="none" />
            <path d="M60 40 V104" stroke="#fff" strokeWidth="2" opacity="0.8" />
          </g>
        )}
      </svg>
    </span>
  )
}
