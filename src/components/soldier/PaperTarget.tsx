type Props = {
  hit?: boolean
}

/** A paper bullseye on a stand. Hitting it only adds a star sticker. */
export function PaperTarget({ hit = false }: Props) {
  return (
    <span className={`paper-target ${hit ? 'hit' : ''}`} aria-hidden>
      <svg viewBox="0 0 120 150" className="soldier-svg">
        <rect x="54" y="112" width="12" height="36" rx="3" fill="#a16207" />
        <rect x="36" y="142" width="48" height="6" rx="3" fill="#854d0e" />
        <g className="paper-card">
          <rect x="16" y="6" width="88" height="110" rx="8" fill="#fffef8" stroke="#44403c" strokeWidth="3" />
          <circle cx="60" cy="58" r="34" fill="none" stroke="#ef4444" strokeWidth="7" />
          <circle cx="60" cy="58" r="20" fill="none" stroke="#1c1917" strokeWidth="4" />
          <circle cx="60" cy="58" r="7" fill="#ef4444" />
          <circle cx="52" cy="28" r="2" fill="#44403c" />
          <circle cx="68" cy="28" r="2" fill="#44403c" />
          <path d="M52 36 Q60 32 68 36" stroke="#44403c" strokeWidth="2" fill="none" strokeLinecap="round" />
          <text x="60" y="104" textAnchor="middle" fontSize="11" fontWeight="800" fill="#78716c">
            PAPER
          </text>
          {hit && (
            <g className="star-sticker">
              <circle cx="60" cy="58" r="16" fill="#facc15" />
              <path
                d="M60 46 L63.2 54.2 H72 L65 59.2 L67.6 67.6 L60 62.8 L52.4 67.6 L55 59.2 L48 54.2 H56.8 Z"
                fill="#fff"
              />
            </g>
          )}
        </g>
      </svg>
    </span>
  )
}
