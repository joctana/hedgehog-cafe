import type { CSSProperties } from 'react'

type Props = {
  size?: number
  thinking?: boolean
  cheering?: boolean
}

export function ChessCarlos({ size = 150, thinking = false, cheering = false }: Props) {
  const style = { width: size, height: size * 1.02 } as CSSProperties

  return (
    <div
      className={`chess-carlos ${thinking ? 'thinking' : ''} ${cheering ? 'cheering' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 180 184" className="chess-carlos-svg">
        <ellipse cx="90" cy="176" rx="54" ry="8" fill="rgba(48,35,24,.14)" />

        {/* body and smart vest */}
        <ellipse cx="90" cy="130" rx="53" ry="42" fill="#a97845" />
        <path d="M48 112 Q90 88 132 112 L126 164 L54 164Z" fill="#355c4d" />
        <path d="M72 104 L90 129 L108 104 L105 164 L75 164Z" fill="#f6ead6" />
        <path d="M83 112 L90 119 L97 112 L96 128 L84 128Z" fill="#d8923b" />
        <circle cx="90" cy="139" r="2.5" fill="#f6ead6" />
        <circle cx="90" cy="150" r="2.5" fill="#f6ead6" />

        {/* paws */}
        <ellipse cx="48" cy="145" rx="15" ry="20" fill="#8d6038" transform="rotate(18 48 145)" />
        <ellipse cx="132" cy="145" rx="15" ry="20" fill="#8d6038" transform="rotate(-18 132 145)" />

        {/* head */}
        <ellipse cx="90" cy="75" rx="46" ry="39" fill="#b9824b" />
        <ellipse cx="90" cy="88" rx="30" ry="21" fill="#c99562" />
        <ellipse cx="54" cy="56" rx="11" ry="13" fill="#8d6038" />
        <ellipse cx="126" cy="56" rx="11" ry="13" fill="#8d6038" />
        <ellipse cx="54" cy="56" rx="5" ry="6" fill="#d9ad84" />
        <ellipse cx="126" cy="56" rx="5" ry="6" fill="#d9ad84" />

        {/* eyes and spectacles */}
        <circle cx="73" cy="72" r="12" fill="rgba(230,247,240,.55)" stroke="#463323" strokeWidth="4" />
        <circle cx="107" cy="72" r="12" fill="rgba(230,247,240,.55)" stroke="#463323" strokeWidth="4" />
        <path d="M85 71 Q90 68 95 71" fill="none" stroke="#463323" strokeWidth="4" />
        <path d="M61 69 L47 64" fill="none" stroke="#463323" strokeWidth="4" />
        <path d="M119 69 L133 64" fill="none" stroke="#463323" strokeWidth="4" />
        <circle cx="75" cy="74" r="4.5" fill="#2d2016" />
        <circle cx="105" cy="74" r="4.5" fill="#2d2016" />
        <circle cx="76.5" cy="72.5" r="1.5" fill="#fff" />
        <circle cx="106.5" cy="72.5" r="1.5" fill="#fff" />

        {/* nose and smile */}
        <ellipse cx="90" cy="87" rx="9" ry="6.5" fill="#55402e" />
        <path d="M76 98 Q90 110 104 98" fill="none" stroke="#68432c" strokeWidth="3" strokeLinecap="round" />

        {/* little chess cap */}
        <path d="M53 49 Q58 20 90 17 Q122 20 127 49Z" fill="#31594a" />
        <ellipse cx="90" cy="49" rx="42" ry="10" fill="#28483d" />
        <text x="90" y="40" textAnchor="middle" fontSize="19" fill="#fff1a8">
          ♞
        </text>

        {thinking && (
          <g className="chess-thought">
            <circle cx="143" cy="42" r="6" fill="#fff" opacity=".9" />
            <circle cx="154" cy="29" r="9" fill="#fff" opacity=".9" />
            <circle cx="168" cy="13" r="13" fill="#fff" opacity=".92" />
            <text x="168" y="19" textAnchor="middle" fontSize="17" fill="#31594a">
              ?
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
