import type { CSSProperties } from 'react'

type Props = {
  size?: number | string
  excited?: boolean
}

/** Carlos waiting to see Lachlan. */
export function CountdownCapy({ size = 220, excited = false }: Props) {
  const style = { width: size } as CSSProperties
  return (
    <div className={`count-capy ${excited ? 'excited' : ''}`} style={style} aria-hidden>
      <svg viewBox="0 0 180 170" className="count-svg">
        <ellipse cx="90" cy="160" rx="46" ry="8" fill="rgba(0,0,0,0.12)" />
        <ellipse cx="58" cy="148" rx="12" ry="14" fill="#8f6540" />
        <ellipse cx="122" cy="148" rx="12" ry="14" fill="#8f6540" />
        <ellipse cx="90" cy="118" rx="52" ry="36" fill="#b88960" />
        <ellipse cx="90" cy="128" rx="34" ry="20" fill="#c99a70" />
        <path d="M48 108 Q90 96 132 108 L126 132 H54 Z" fill="#fb7185" />
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
        <path d="M78 96 Q90 106 102 96" stroke="#6b4428" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path
          d="M90 124 C90 124 80 114 80 108 C80 103 85 101 90 106 C95 101 100 103 100 108 C100 114 90 124 90 124 Z"
          fill="#e11d48"
        />
      </svg>
    </div>
  )
}
