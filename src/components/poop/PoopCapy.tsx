import type { CSSProperties } from 'react'

type Pose = 'sit' | 'back' | 'stand'

type Props = {
  size?: number | string
  pose?: Pose
  /** Brown spots still left on the back view. */
  spots?: number
  shirt?: boolean
  shorts?: boolean
  sparkle?: boolean
}

/** Carlos for potty, wipe, shower, and getting dressed. */
export function PoopCapy({
  size = 220,
  pose = 'stand',
  spots = 0,
  shirt = false,
  shorts = false,
  sparkle = false,
}: Props) {
  const style = { width: size } as CSSProperties
  return (
    <div className={`poop-capy pose-${pose} ${sparkle ? 'poop-sparkle' : ''}`} style={style} aria-hidden>
      <svg viewBox="0 0 180 170" className="poop-svg">
        <ellipse cx="90" cy="160" rx="46" ry="8" fill="rgba(0,0,0,0.12)" />
        {pose === 'back' ? <BackBody spots={spots} /> : <FrontBody shirt={shirt} shorts={shorts} sitting={pose === 'sit'} />}
      </svg>
    </div>
  )
}

function FrontBody({ shirt, shorts, sitting }: { shirt: boolean; shorts: boolean; sitting: boolean }) {
  return (
    <>
      {sitting ? null : (
        <>
          <ellipse cx="58" cy="148" rx="12" ry="14" fill="#8f6540" />
          <ellipse cx="122" cy="148" rx="12" ry="14" fill="#8f6540" />
        </>
      )}
      <ellipse cx="90" cy={sitting ? 128 : 118} rx="52" ry={sitting ? 30 : 36} fill="#b88960" />
      <ellipse cx="90" cy={sitting ? 136 : 128} rx="34" ry="18" fill="#c99a70" />
      <g className={`poop-shirt ${shirt ? 'on' : ''}`}>
        <ellipse cx="90" cy="116" rx="54" ry="38" fill="#14b8a6" />
        <ellipse cx="90" cy="124" rx="30" ry="16" fill="#5eead4" />
      </g>
      <g className={`poop-shorts ${shorts ? 'on' : ''}`}>
        <path d="M46 130 H134 Q130 160 108 162 H98 Q90 148 82 162 H72 Q50 160 46 130 Z" fill="#f97316" />
        <path d="M64 130 H116 L110 146 H70 Z" fill="#fdba74" />
      </g>
      <ellipse cx="90" cy="72" rx="42" ry="34" fill="#b88960" />
      <ellipse cx="90" cy="84" rx="24" ry="14" fill="#c99a70" />
      <ellipse cx="56" cy="50" rx="10" ry="12" fill="#8f6540" />
      <ellipse cx="124" cy="50" rx="10" ry="12" fill="#8f6540" />
      <ellipse cx="56" cy="50" rx="5" ry="6" fill="#d4a882" />
      <ellipse cx="124" cy="50" rx="5" ry="6" fill="#d4a882" />
      <ellipse cx="74" cy="70" rx="5" ry="6" fill="#2a1c12" />
      <ellipse cx="106" cy="70" rx="5" ry="6" fill="#2a1c12" />
      <circle cx="72" cy="68" r="1.6" fill="#fff" />
      <circle cx="104" cy="68" r="1.6" fill="#fff" />
      <ellipse cx="90" cy="86" rx="12" ry="8" fill="#c99a70" />
      <ellipse cx="86" cy="85" rx="2.2" ry="1.5" fill="#2a1c12" />
      <ellipse cx="94" cy="85" rx="2.2" ry="1.5" fill="#2a1c12" />
      <path d="M80 96 Q90 104 100 96" stroke="#6b4428" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  )
}

function BackBody({ spots }: { spots: number }) {
  const marks = [
    { cx: 74, cy: 118 },
    { cx: 106, cy: 122 },
    { cx: 90, cy: 136 },
  ]
  return (
    <>
      <ellipse cx="90" cy="118" rx="54" ry="40" fill="#b88960" />
      <ellipse cx="62" cy="132" rx="18" ry="16" fill="#a97850" />
      <ellipse cx="118" cy="132" rx="18" ry="16" fill="#a97850" />
      <ellipse cx="90" cy="78" rx="40" ry="32" fill="#b88960" />
      <ellipse cx="58" cy="56" rx="10" ry="12" fill="#8f6540" />
      <ellipse cx="122" cy="56" rx="10" ry="12" fill="#8f6540" />
      <ellipse cx="90" cy="108" rx="10" ry="7" fill="#8f6540" />
      {marks.map((mark, index) => (
        <circle
          key={mark.cx}
          className={`poop-spot ${index < spots ? 'show' : ''}`}
          cx={mark.cx}
          cy={mark.cy}
          r="9"
          fill="#6b3a1f"
        />
      ))}
    </>
  )
}
