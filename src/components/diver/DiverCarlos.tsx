import type { CSSProperties } from 'react'

type Props = {
  size?: number
  swimming?: boolean
  celebrating?: boolean
}

/** Carlos in kid-friendly scuba gear, facing right. */
export function DiverCarlos({ size = 190, swimming = false, celebrating = false }: Props) {
  const style = { width: size, height: size * 0.72 } as CSSProperties

  return (
    <div
      className={`diver-carlos ${swimming ? 'swimming' : ''} ${celebrating ? 'celebrating' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 174" className="diver-carlos-svg">
        <ellipse cx="119" cy="158" rx="76" ry="9" fill="rgba(1,45,73,.18)" />

        {/* fins */}
        <path d="M42 118 L7 135 Q1 144 17 148 L57 137 Z" fill="#168bd2" stroke="#075985" strokeWidth="3" />
        <path d="M51 139 L18 159 Q12 168 29 169 L68 151 Z" fill="#168bd2" stroke="#075985" strokeWidth="3" />

        {/* air tank */}
        <rect x="48" y="43" width="38" height="92" rx="17" fill="#99a7ae" stroke="#344955" strokeWidth="5" />
        <rect x="56" y="35" width="22" height="16" rx="4" fill="#344955" />
        <path d="M82 57 Q115 32 139 64" fill="none" stroke="#233b46" strokeWidth="7" strokeLinecap="round" />

        {/* body and wetsuit */}
        <ellipse cx="116" cy="111" rx="60" ry="44" fill="#a97845" />
        <path d="M63 99 Q75 73 112 72 Q149 77 169 111 L151 149 L85 151 Q66 135 63 99Z" fill="#173f5f" />
        <path d="M93 72 L139 76 L150 145 L86 145 Z" fill="#22577a" opacity=".9" />
        <path d="M101 76 L112 145" stroke="#0f2f47" strokeWidth="5" />
        <path d="M133 78 L128 145" stroke="#0f2f47" strokeWidth="5" />

        {/* arms */}
        <ellipse cx="151" cy="123" rx="28" ry="14" fill="#9a6b3e" transform="rotate(-20 151 123)" />
        <ellipse cx="80" cy="124" rx="26" ry="13" fill="#9a6b3e" transform="rotate(18 80 124)" />
        <circle cx="174" cy="114" r="12" fill="#8b5e36" />
        <circle cx="59" cy="135" r="12" fill="#8b5e36" />

        {/* head */}
        <ellipse cx="143" cy="72" rx="53" ry="48" fill="#b9824b" />
        <ellipse cx="181" cy="83" rx="36" ry="27" fill="#c6915c" />

        {/* ears */}
        <ellipse cx="112" cy="35" rx="14" ry="18" fill="#8b5e36" transform="rotate(-24 112 35)" />
        <ellipse cx="163" cy="29" rx="13" ry="17" fill="#8b5e36" transform="rotate(18 163 29)" />

        {/* mask */}
        <path
          d="M105 51 Q129 36 157 48 L184 43 Q204 45 203 65 Q202 85 183 89 Q166 91 157 73 Q146 87 125 82 Q105 78 101 63Z"
          fill="rgba(151,222,255,.68)"
          stroke="#173f5f"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <ellipse cx="128" cy="61" rx="11" ry="14" fill="#fff" />
        <ellipse cx="181" cy="62" rx="10" ry="13" fill="#fff" />
        <circle cx="132" cy="64" r="6" fill="#3b2417" />
        <circle cx="184" cy="65" r="6" fill="#3b2417" />
        <circle cx="134" cy="61" r="2" fill="#fff" />
        <circle cx="186" cy="62" r="2" fill="#fff" />

        {/* nose and happy mouth */}
        <ellipse cx="195" cy="82" rx="8" ry="7" fill="#5c3d28" />
        <path d="M178 97 Q194 110 209 96" fill="#5b281c" />
        <path d="M184 98 Q194 105 203 98" fill="#f08b7f" />

        {/* regulator */}
        <circle cx="179" cy="108" r="13" fill="#263b45" stroke="#102731" strokeWidth="4" />
        <path d="M171 108 Q143 120 126 145" fill="none" stroke="#263b45" strokeWidth="6" />

        {/* snorkel */}
        <path d="M199 67 L211 63 L209 19" fill="none" stroke="#173f5f" strokeWidth="8" strokeLinecap="round" />
        <path d="M209 19 L218 19" stroke="#38a3db" strokeWidth="8" strokeLinecap="round" />

        {/* bubbles */}
        <g className="diver-own-bubbles" fill="rgba(214,246,255,.72)" stroke="#fff" strokeWidth="1.5">
          <circle cx="218" cy="49" r="5" />
          <circle cx="226" cy="34" r="3.5" />
          <circle cx="220" cy="16" r="2.5" />
        </g>
      </svg>
    </div>
  )
}
