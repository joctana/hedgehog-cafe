import type { CSSProperties } from 'react'

type Props = {
  size?: number | string
  asleep?: boolean
  shirt?: boolean
  shorts?: boolean
}

/** Carlos the capybara, asleep or dressed for the day. */
export function DayCapy({ size = 180, asleep = false, shirt = false, shorts = false }: Props) {
  const style = { width: size } as CSSProperties
  return (
    <div className="day-capy" style={style} aria-hidden>
      <svg viewBox="0 0 180 170" className="day-svg">
        <ellipse cx="90" cy="160" rx="46" ry="8" fill="rgba(0,0,0,0.12)" />
        <ellipse cx="58" cy="148" rx="12" ry="14" fill="#8f6540" />
        <ellipse cx="122" cy="148" rx="12" ry="14" fill="#8f6540" />
        <ellipse cx="90" cy="118" rx="52" ry="36" fill="#b88960" />
        <ellipse cx="90" cy="128" rx="34" ry="20" fill="#c99a70" />
        <g className={`shirt-kit ${shirt ? 'on' : ''}`}>
          <ellipse cx="90" cy="116" rx="54" ry="38" fill="#0ea5e9" />
          <ellipse cx="90" cy="124" rx="30" ry="16" fill="#7dd3fc" />
        </g>
        <g className={`shorts-kit ${shorts ? 'on' : ''}`}>
          <path d="M46 130 H134 Q130 160 108 162 H98 Q90 148 82 162 H72 Q50 160 46 130 Z" fill="#fb923c" />
          <path d="M64 130 H116 L110 146 H70 Z" fill="#fdba74" />
        </g>
        <ellipse cx="90" cy="72" rx="42" ry="34" fill="#b88960" />
        <ellipse cx="90" cy="84" rx="24" ry="14" fill="#c99a70" />
        <ellipse cx="56" cy="50" rx="10" ry="12" fill="#8f6540" />
        <ellipse cx="124" cy="50" rx="10" ry="12" fill="#8f6540" />
        <ellipse cx="56" cy="50" rx="5" ry="6" fill="#d4a882" />
        <ellipse cx="124" cy="50" rx="5" ry="6" fill="#d4a882" />
        {asleep ? (
          <>
            <path d="M68 70 Q74 66 80 70" stroke="#2a1c12" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M100 70 Q106 66 112 70" stroke="#2a1c12" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="74" cy="70" rx="5" ry="6" fill="#2a1c12" />
            <ellipse cx="106" cy="70" rx="5" ry="6" fill="#2a1c12" />
            <circle cx="72" cy="68" r="1.6" fill="#fff" />
            <circle cx="104" cy="68" r="1.6" fill="#fff" />
          </>
        )}
        <ellipse cx="90" cy="86" rx="12" ry="8" fill="#c99a70" />
        <ellipse cx="86" cy="85" rx="2.4" ry="1.6" fill="#2a1c12" />
        <ellipse cx="94" cy="85" rx="2.4" ry="1.6" fill="#2a1c12" />
        <path d="M80 96 Q90 104 100 96" stroke="#6b4428" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}
