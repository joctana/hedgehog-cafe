import type { CSSProperties } from 'react'
import type { FishKind } from './RiverFish'

type Stage = 'raw' | 'clean' | 'grill' | 'plated'

type Props = {
  stage: Stage
  /** How many fish are still on the board, pan, or plate. */
  count: number
  size?: number
}

const KINDS: FishKind[] = ['koi', 'blue', 'gold', 'pink']

function FishSide({
  kind,
  cooked,
  x,
  y,
  scale = 1,
}: {
  kind: FishKind
  cooked: boolean
  x: number
  y: number
  scale?: number
}) {
  const raw = {
    koi: '#94a3b8',
    blue: '#7dd3fc',
    gold: '#cbd5e1',
    pink: '#fda4af',
  }[kind]
  const body = cooked ? '#f59e0b' : raw
  const belly = cooked ? '#fde68a' : '#f8fafc'
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="28" ry="14" fill={body} />
      <ellipse cx="-2" cy="4" rx="18" ry="7" fill={belly} />
      <path d="M24 -2 L42 -14 L38 -2 L42 12 Z" fill={cooked ? '#d97706' : '#64748b'} />
      <circle cx="-16" cy="-2" r="3.2" fill="#1e293b" />
      <circle cx="-17" cy="-3" r="1.2" fill="#fff" />
      {cooked && (
        <>
          <path d="M-6 -8 v16" stroke="#b45309" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <path d="M4 -9 v18" stroke="#b45309" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <path d="M14 -7 v14" stroke="#b45309" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        </>
      )}
    </g>
  )
}

function Board() {
  return (
    <g>
      <rect x="28" y="118" width="164" height="18" rx="8" fill="#c9a06e" />
      <rect x="186" y="120" width="22" height="14" rx="6" fill="#b88960" />
      <rect x="28" y="118" width="164" height="6" rx="3" fill="#e7c9a0" />
    </g>
  )
}

function Pan() {
  return (
    <g>
      <rect x="196" y="108" width="46" height="10" rx="5" fill="#44403c" />
      <ellipse cx="112" cy="112" rx="86" ry="22" fill="#57534e" />
      <ellipse cx="112" cy="108" rx="74" ry="16" fill="#292524" />
      <ellipse cx="112" cy="108" rx="64" ry="12" fill="#44403c" />
      <g className="fish-flames">
        <path d="M70 132 q8 16 0 28 q10 -8 6 -20 q8 10 2 18 q12 -16 -8 -26z" fill="#fb923c" />
        <path d="M108 136 q8 14 0 26 q10 -10 4 -20 q8 12 0 18 q12 -14 -4 -24z" fill="#f97316" />
        <path d="M142 132 q6 14 -2 26 q10 -8 4 -18 q8 10 0 16 q10 -16 -2 -24z" fill="#facc15" />
      </g>
    </g>
  )
}

function Plate() {
  return (
    <g>
      <ellipse cx="120" cy="124" rx="92" ry="24" fill="#fff8ef" />
      <ellipse cx="120" cy="120" rx="72" ry="16" fill="#f1e2c9" />
      <path d="M196 96 a16 14 0 1 1 0 22" fill="#fde047" />
      <path d="M196 100 a8 8 0 1 1 0 12" fill="#fef9c3" />
    </g>
  )
}

function Steam() {
  return (
    <g className="fish-steam">
      <path d="M70 70 q-8 -12 0 -22 q8 -8 0 -18" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M112 62 q-8 -12 0 -22 q8 -8 0 -18" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M150 70 q-8 -12 0 -22 q8 -8 0 -18" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  )
}

/** The catch, drawn on a board, in a pan, or on a plate. */
export function MealView({ stage, count, size = 280 }: Props) {
  const style = { width: size, height: size * 0.72 } as CSSProperties
  const cooked = stage === 'grill' || stage === 'plated'
  const spots = [0, 1, 2, 3].slice(0, count).map((index) => ({
    kind: KINDS[index],
    x: 58 + (index % 4) * 40,
    y: stage === 'grill' ? 100 : stage === 'plated' ? 112 : 96,
  }))

  return (
    <div className={`meal-view stage-${stage}`} style={style} aria-hidden>
      <svg viewBox="0 0 240 170" className="meal-svg">
        <ellipse cx="120" cy="156" rx="90" ry="8" fill="rgba(15,23,42,0.12)" />
        {(stage === 'raw' || stage === 'clean') && <Board />}
        {stage === 'grill' && <Pan />}
        {stage === 'plated' && <Plate />}
        {spots.map((spot) => (
          <FishSide key={spot.kind} kind={spot.kind} cooked={cooked} x={spot.x} y={spot.y} scale={count === 1 ? 1.15 : 0.92} />
        ))}
        {stage === 'clean' && (
          <g className="fish-sparkles">
            <path d="M46 58 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#7dd3fc" />
            <path d="M188 64 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#bae6fd" />
          </g>
        )}
        {(stage === 'grill' || stage === 'plated') && <Steam />}
        {count === 0 && (
          <text
            x="120"
            y="78"
            textAnchor="middle"
            fontFamily="Fredoka, Nunito, sans-serif"
            fontSize="28"
            fontWeight="800"
            fill="#c2410c"
          >
            Yum!
          </text>
        )}
      </svg>
    </div>
  )
}
