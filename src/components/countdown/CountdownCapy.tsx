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
        <path d="M90 112 L96 122 H84 Z" fill="#fff" transform="translate(0 8)" />
        <path
          d="M90 118 C90 118 82 110 82 104 C82 100 86 98 90 102 C94 98 98 100 98 104 C98 110 90 118 90 118 Z"
          fill="#e11d48"
        />
      </svg>
    </div>
  )
}
