import type { PointerEvent as ReactPointerEvent } from 'react'
import type { AnimState } from '../hooks/useHedgehogCare'
import type { DecorItem, HedgehogProfile } from '../data/hedgehogs'
import './Hedgehog.css'

interface HedgehogProps {
  profile: HedgehogProfile
  anim?: AnimState
  size?: 'sm' | 'lg'
  decor?: DecorItem | null
  interactive?: boolean
  onClick?: () => void
  petHandlers?: {
    onPointerDown: (event: ReactPointerEvent<Element>) => void
    onPointerMove: (event: ReactPointerEvent<Element>) => void
    onPointerUp: () => void
    onPointerCancel: () => void
  }
  stroking?: boolean
}

export function Hedgehog({
  profile,
  anim = 'idle',
  size = 'sm',
  decor = null,
  interactive = false,
  onClick,
  petHandlers,
  stroking = false,
}: HedgehogProps) {
  const className = [
    'hedgehog-wrap',
    size,
    anim,
    interactive ? 'interactive' : '',
    stroking ? 'stroking' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={profile.name}
      {...petHandlers}
    >
      <svg viewBox="0 0 200 180" className="hedgehog-svg" aria-hidden="true">
        <ellipse cx="100" cy="150" rx="52" ry="12" fill="rgba(58,36,24,0.12)" />
        <g className="spines">
          <path d="M48 92c8-34 24-54 52-62 28 8 44 28 52 62-18-16-34-22-52-22s-34 6-52 22z" fill={profile.spines} />
          <path d="M56 78c10-18 22-28 44-34 22 6 34 16 44 34-14-10-28-14-44-14s-30 4-44 14z" fill={profile.body} opacity="0.85" />
        </g>
        <ellipse cx="100" cy="108" rx="54" ry="42" fill={profile.body} />
        <ellipse cx="100" cy="118" rx="34" ry="28" fill={profile.belly} />
        <circle cx="82" cy="108" r="5.5" fill={profile.nose} />
        <circle cx="118" cy="108" r="5.5" fill={profile.nose} />
        <circle cx="83.5" cy="106.5" r="1.6" fill="#fff" />
        <circle cx="119.5" cy="106.5" r="1.6" fill="#fff" />
        <ellipse cx="100" cy="122" rx="7" ry="5" fill={profile.nose} />
        <path d="M90 132c6 6 14 6 20 0" fill="none" stroke={profile.nose} strokeWidth="2.5" strokeLinecap="round" className="smile" />
        <ellipse cx="58" cy="118" rx="10" ry="8" fill={profile.belly} className="paw left" />
        <ellipse cx="142" cy="118" rx="10" ry="8" fill={profile.belly} className="paw right" />
        {anim === 'sleep' && (
          <g className="zzz" fill={profile.spines} fontFamily="Fredoka, sans-serif" fontWeight="700">
            <text x="148" y="70" fontSize="18">z</text>
            <text x="162" y="52" fontSize="22">z</text>
            <text x="178" y="34" fontSize="26">Z</text>
          </g>
        )}
        {decor === 'bow' && (
          <g transform="translate(100 58)">
            <circle cx="-10" cy="0" r="8" fill="#e86b8a" />
            <circle cx="10" cy="0" r="8" fill="#e86b8a" />
            <circle cx="0" cy="0" r="5" fill="#f2a7a0" />
          </g>
        )}
        {decor === 'hat' && (
          <g transform="translate(100 48)">
            <ellipse cx="0" cy="10" rx="28" ry="6" fill="#3a2418" />
            <rect x="-14" y="-18" width="28" height="26" rx="4" fill="#3a2418" />
            <rect x="-14" y="2" width="28" height="5" fill="#c4785a" />
          </g>
        )}
        {decor === 'pillow' && (
          <ellipse cx="100" cy="148" rx="40" ry="14" fill="#fff6ea" stroke="#e6b85c" strokeWidth="3" />
        )}
      </svg>
    </button>
  )
}
