import type { CSSProperties } from 'react'
import type { Recipe } from '../../data/cafeCapys'

export type DishStage = 'raw' | 'washed' | 'chopped' | 'cooked' | 'plated'

type Props = {
  recipe: Recipe
  stage: DishStage
  size?: number
  bites?: number
}

const BOARD_SPOTS: Array<[number, number]> = [
  [62, 92],
  [88, 86],
  [114, 88],
  [140, 94],
  [76, 106],
  [126, 106],
]

const PLATE_SPOTS: Array<[number, number]> = [
  [74, 96],
  [100, 86],
  [126, 96],
  [86, 106],
  [114, 106],
]

const POT_SPOTS: Array<[number, number]> = [
  [78, 92],
  [100, 84],
  [122, 92],
  [90, 98],
]

function Whole({ recipe, cx, cy, r }: { recipe: Recipe; cx: number; cy: number; r: number }) {
  const { shape, color, inner, accent } = recipe.art

  if (shape === 'cob') {
    const kernels = []
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        kernels.push(
          <circle
            key={`${row}-${col}`}
            cx={cx - r * 0.3 + col * r * 0.3}
            cy={cy - r * 0.78 + row * r * 0.31}
            r={r * 0.12}
            fill={inner}
          />,
        )
      }
    }
    return (
      <g>
        <path
          d={`M${cx - r * 0.5} ${cy + r * 0.5} q${-r * 0.7} ${-r * 0.5} ${-r * 0.3} ${-r * 1.2} q${r * 0.8} ${r * 0.3} ${r * 0.7} ${r * 1} z`}
          fill="#6f9b6a"
        />
        <rect
          x={cx - r * 0.48}
          y={cy - r}
          width={r * 0.96}
          height={r * 2}
          rx={r * 0.48}
          fill={color}
        />
        {kernels}
        <rect
          x={cx - r * 0.48}
          y={cy - r}
          width={r * 0.3}
          height={r * 2}
          rx={r * 0.3}
          fill={inner}
          opacity="0.28"
        />
      </g>
    )
  }

  if (shape === 'leaf') {
    return (
      <g>
        <path
          d={`M${cx} ${cy - r} C ${cx + r * 1.05} ${cy - r * 0.5}, ${cx + r * 0.8} ${cy + r * 0.7}, ${cx} ${cy + r} C ${cx - r * 0.8} ${cy + r * 0.7}, ${cx - r * 1.05} ${cy - r * 0.5}, ${cx} ${cy - r} Z`}
          fill={color}
        />
        <path
          d={`M${cx} ${cy - r * 0.8} L ${cx} ${cy + r * 0.85}`}
          stroke={accent}
          strokeWidth={r * 0.12}
          strokeLinecap="round"
        />
        <path
          d={`M${cx} ${cy - r * 0.2} L ${cx + r * 0.45} ${cy - r * 0.5}`}
          stroke={accent}
          strokeWidth={r * 0.09}
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d={`M${cx} ${cy + r * 0.2} L ${cx - r * 0.45} ${cy - r * 0.1}`}
          stroke={accent}
          strokeWidth={r * 0.09}
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    )
  }

  if (shape === 'melon') {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.88} fill={color} />
        <path
          d={`M${cx - r * 0.75} ${cy - r * 0.35} q ${r * 0.75} ${r * 0.35} ${r * 1.5} 0`}
          stroke={accent}
          strokeWidth={r * 0.11}
          fill="none"
        />
        <path
          d={`M${cx - r * 0.85} ${cy + r * 0.15} q ${r * 0.85} ${r * 0.3} ${r * 1.7} 0`}
          stroke={accent}
          strokeWidth={r * 0.11}
          fill="none"
        />
        <ellipse cx={cx - r * 0.35} cy={cy - r * 0.45} rx={r * 0.22} ry={r * 0.14} fill="#fff" opacity="0.55" />
      </g>
    )
  }

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <circle cx={cx - r * 0.32} cy={cy - r * 0.34} r={r * 0.22} fill="#fff" opacity="0.45" />
      <path
        d={`M${cx} ${cy - r} q ${r * 0.5} ${-r * 0.35} ${r * 0.7} ${r * 0.05} q ${-r * 0.5} ${r * 0.25} ${-r * 0.7} ${-r * 0.05}`}
        fill="#6f9b6a"
      />
      <rect x={cx - r * 0.07} y={cy - r * 1.2} width={r * 0.14} height={r * 0.3} rx={r * 0.07} fill="#6b4428" />
    </g>
  )
}

function Piece({ recipe, cx, cy, s }: { recipe: Recipe; cx: number; cy: number; s: number }) {
  const { shape, color, inner, accent } = recipe.art

  if (shape === 'cob') {
    return (
      <g>
        <rect x={cx - s} y={cy - s * 0.62} width={s * 2} height={s * 1.24} rx={s * 0.5} fill={color} />
        <circle cx={cx - s * 0.45} cy={cy} r={s * 0.2} fill={inner} />
        <circle cx={cx + s * 0.1} cy={cy - s * 0.18} r={s * 0.2} fill={inner} />
        <circle cx={cx + s * 0.55} cy={cy + s * 0.14} r={s * 0.2} fill={inner} />
      </g>
    )
  }

  if (shape === 'leaf') {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={s} ry={s * 0.6} fill={color} transform={`rotate(-18 ${cx} ${cy})`} />
        <path
          d={`M${cx - s * 0.7} ${cy + s * 0.2} L ${cx + s * 0.7} ${cy - s * 0.3}`}
          stroke={accent}
          strokeWidth={s * 0.16}
          strokeLinecap="round"
        />
      </g>
    )
  }

  return (
    <g>
      <path
        d={`M${cx - s} ${cy + s * 0.45} A ${s} ${s} 0 0 1 ${cx + s} ${cy + s * 0.45} Z`}
        fill={inner}
        stroke={color}
        strokeWidth={s * 0.34}
        strokeLinejoin="round"
      />
      <path
        d={`M${cx} ${cy + s * 0.45} L ${cx} ${cy - s * 0.4}`}
        stroke={accent}
        strokeWidth={s * 0.14}
        strokeLinecap="round"
        opacity="0.6"
      />
    </g>
  )
}

function Steam() {
  return (
    <g className="cc-steam" aria-hidden>
      <path d="M84 62 q -8 -12 0 -22 q 8 -10 0 -20" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M100 56 q -8 -12 0 -22 q 8 -10 0 -20" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M116 62 q -8 -12 0 -22 q 8 -10 0 -20" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.85" />
    </g>
  )
}

function Sparkles() {
  return (
    <g className="cc-sparkles" aria-hidden>
      <path d="M56 54 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" fill="#7dd3fc" />
      <path d="M146 62 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#bae6fd" />
      <circle cx="72" cy="40" r="4" fill="#7dd3fc" />
      <circle cx="132" cy="38" r="5" fill="#bae6fd" />
    </g>
  )
}

function Board() {
  return (
    <g>
      <rect x="36" y="108" width="118" height="16" rx="8" fill="#c9a06e" />
      <rect x="150" y="110" width="22" height="12" rx="6" fill="#b88960" />
      <rect x="36" y="108" width="118" height="6" rx="3" fill="#d9b48a" />
    </g>
  )
}

function Pot({ liquid }: { liquid: string }) {
  return (
    <g>
      <rect x="46" y="96" width="12" height="10" rx="5" fill="#4b5563" />
      <rect x="142" y="96" width="12" height="10" rx="5" fill="#4b5563" />
      <path d="M56 92 h88 l-8 40 a10 10 0 0 1 -10 8 h-52 a10 10 0 0 1 -10 -8 z" fill="#64748b" />
      <ellipse cx="100" cy="92" rx="46" ry="10" fill="#94a3b8" />
      <ellipse cx="100" cy="93" rx="38" ry="7" fill={liquid} />
      <path d="M62 118 h76" stroke="#475569" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    </g>
  )
}

function Vessel({ recipe }: { recipe: Recipe }) {
  const { vessel, liquid } = recipe.art

  if (vessel === 'cup') {
    return (
      <g>
        <path d="M138 96 a16 16 0 0 1 0 24" stroke="#e8d5b0" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M64 88 h72 l-7 44 a10 10 0 0 1 -10 8 h-38 a10 10 0 0 1 -10 -8 z" fill="#fff8ef" />
        <ellipse cx="100" cy="88" rx="36" ry="8" fill="#ffffff" />
        {liquid && <ellipse cx="100" cy="89" rx="30" ry="6" fill={liquid} />}
        <ellipse cx="100" cy="146" rx="26" ry="6" fill="#e8d5b0" />
      </g>
    )
  }

  if (vessel === 'plate') {
    return (
      <g>
        <ellipse cx="100" cy="118" rx="62" ry="18" fill="#fff8ef" />
        <ellipse cx="100" cy="116" rx="46" ry="12" fill="#f1e2c9" />
        <ellipse cx="100" cy="132" rx="46" ry="8" fill="#e8d5b0" opacity="0.7" />
      </g>
    )
  }

  return (
    <g>
      <path d="M50 98 h100 l-12 34 a14 14 0 0 1 -13 8 h-50 a14 14 0 0 1 -13 -8 z" fill="#fff8ef" />
      <ellipse cx="100" cy="98" rx="50" ry="11" fill="#ffffff" />
      {liquid && <ellipse cx="100" cy="99" rx="42" ry="8" fill={liquid} />}
      <ellipse cx="100" cy="146" rx="28" ry="6" fill="#e8d5b0" />
    </g>
  )
}

export function Dish({ recipe, stage, size = 200, bites = 0 }: Props) {
  const style = { width: size, height: size * 0.85 } as CSSProperties
  const showWhole = stage === 'raw' || stage === 'washed'
  const plateSpots = PLATE_SPOTS.slice(0, Math.max(0, PLATE_SPOTS.length - bites))

  return (
    <div className={`cc-dish stage-${stage}`} style={style} aria-hidden>
      <svg viewBox="0 0 200 170" className="cc-dish-svg">
        <ellipse cx="100" cy="152" rx="62" ry="8" fill="rgba(58, 36, 24, 0.14)" />

        {(stage === 'raw' || stage === 'washed' || stage === 'chopped') && <Board />}
        {stage === 'cooked' && <Pot liquid={recipe.art.liquid ?? recipe.art.inner} />}
        {stage === 'plated' && <Vessel recipe={recipe} />}

        {showWhole && (
          <g className="cc-food-whole">
            <Whole recipe={recipe} cx={76} cy={80} r={26} />
            <Whole recipe={recipe} cx={126} cy={84} r={22} />
          </g>
        )}

        {stage === 'chopped' &&
          BOARD_SPOTS.map(([cx, cy], index) => (
            <g key={index} className="cc-food-piece" style={{ animationDelay: `${index * 30}ms` }}>
              <Piece recipe={recipe} cx={cx} cy={cy} s={13} />
            </g>
          ))}

        {stage === 'cooked' &&
          POT_SPOTS.map(([cx, cy], index) => (
            <g key={index} className="cc-food-bob" style={{ animationDelay: `${index * 160}ms` }}>
              <Piece recipe={recipe} cx={cx} cy={cy} s={12} />
            </g>
          ))}

        {stage === 'plated' &&
          plateSpots.map(([cx, cy], index) => (
            <g key={index} className="cc-food-piece" style={{ animationDelay: `${index * 35}ms` }}>
              <Piece recipe={recipe} cx={cx} cy={cy} s={14} />
            </g>
          ))}

        {stage === 'washed' && <Sparkles />}
        {stage === 'cooked' && <Steam />}
        {stage === 'plated' && bites === 0 && (
          <path d="M158 46 l5 12 12 5 -12 5 -5 12 -5 -12 -12 -5 12 -5 z" fill="#facc15" className="cc-sparkles" />
        )}
        {stage === 'plated' && bites >= PLATE_SPOTS.length && (
          <g className="cc-crumbs">
            <circle cx="88" cy="104" r="3" fill={recipe.art.accent} opacity="0.7" />
            <circle cx="106" cy="108" r="2.4" fill={recipe.art.accent} opacity="0.6" />
            <circle cx="116" cy="100" r="2" fill={recipe.art.accent} opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  )
}
