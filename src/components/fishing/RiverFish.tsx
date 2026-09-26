import type { CSSProperties } from 'react'

export type FishKind = 'koi' | 'blue' | 'gold' | 'pink'

const PALETTE: Record<FishKind, { body: string; belly: string; fin: string }> = {
  koi: { body: '#fb923c', belly: '#ffedd5', fin: '#ea580c' },
  blue: { body: '#38bdf8', belly: '#e0f2fe', fin: '#0284c7' },
  gold: { body: '#facc15', belly: '#fef9c3', fin: '#ca8a04' },
  pink: { body: '#fb7185', belly: '#ffe4e6', fin: '#e11d48' },
}

type Props = {
  kind: FishKind
  size?: number | string
  flip?: boolean
}

/** A side-view fish, used in the river and in the catch bucket. */
export function RiverFish({ kind, size = 120, flip = false }: Props) {
  const { body, belly, fin } = PALETTE[kind]
  const style = {
    width: size,
    height: typeof size === 'number' ? size * 0.56 : undefined,
  } as CSSProperties

  return (
    <span className={`river-fish-art ${flip ? 'flip' : ''}`} style={style} aria-hidden>
      <svg viewBox="0 0 160 90" className="river-fish-svg">
        <ellipse cx="78" cy="50" rx="46" ry="24" fill={body} />
        <ellipse cx="74" cy="58" rx="32" ry="12" fill={belly} />
        <path d="M118 48 L154 22 L146 48 L154 74 Z" fill={fin} />
        <ellipse cx="46" cy="34" rx="16" ry="9" fill={fin} transform="rotate(-18 46 34)" />
        <ellipse cx="70" cy="68" rx="14" ry="7" fill={fin} opacity="0.85" />
        <circle cx="42" cy="46" r="6" fill="#1e293b" />
        <circle cx="40" cy="44" r="2.2" fill="#fff" />
        <circle cx="62" cy="44" r="4" fill="#fff" opacity="0.35" />
        <circle cx="86" cy="50" r="3.5" fill="#fff" opacity="0.28" />
        <path d="M34 50 q8 4 0 9" stroke={fin} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  )
}
