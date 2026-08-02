import type { CSSProperties } from 'react'
import type { BlueyCharacter } from '../../data/blueyCharacters'

export type HairTuftId = 'bangL' | 'bangR' | 'top' | 'sideL' | 'sideR' | 'fluff'

interface BlueyPupProps {
  character: BlueyCharacter
  /** 0 = fully grown messy hair, 1 = fresh haircut */
  cutProgress: number
  /** Which tufts are already snipped */
  cutTufts: Set<HairTuftId>
  size?: number
  happy?: boolean
}

export const HAIR_TUFTS: HairTuftId[] = ['bangL', 'bangR', 'top', 'sideL', 'sideR', 'fluff']

export function BlueyPup({
  character,
  cutProgress,
  cutTufts,
  size = 220,
  happy = false,
}: BlueyPupProps) {
  const style = {
    ['--coat']: character.coat,
    ['--patch']: character.patch,
    ['--cream']: character.cream,
    ['--nose']: character.nose,
    width: size,
    height: size,
  } as CSSProperties

  const show = (id: HairTuftId) => !cutTufts.has(id)

  return (
    <div className={`bluey-pup ${happy ? 'happy' : ''}`} style={style} aria-hidden>
      <svg viewBox="0 0 200 220" className="bluey-pup-svg">
        {/* cape / shoulders hint */}
        <ellipse cx="100" cy="210" rx="70" ry="18" fill="rgba(0,0,0,0.08)" />

        {/* ears */}
        <ellipse cx="42" cy="78" rx="28" ry="42" fill="var(--coat)" transform="rotate(-18 42 78)" />
        <ellipse cx="42" cy="78" rx="16" ry="28" fill="var(--patch)" transform="rotate(-18 42 78)" />
        <ellipse cx="158" cy="78" rx="28" ry="42" fill="var(--coat)" transform="rotate(18 158 78)" />
        <ellipse cx="158" cy="78" rx="16" ry="28" fill="var(--patch)" transform="rotate(18 158 78)" />

        {/* head */}
        <ellipse cx="100" cy="118" rx="62" ry="58" fill="var(--coat)" />
        {/* forehead patch */}
        <ellipse cx="100" cy="96" rx="34" ry="28" fill="var(--patch)" opacity="0.85" />
        {/* muzzle */}
        <ellipse cx="100" cy="138" rx="36" ry="28" fill="var(--cream)" />

        {/* eyes */}
        <ellipse cx="78" cy="112" rx="8" ry="10" fill="#1f2937" />
        <ellipse cx="122" cy="112" rx="8" ry="10" fill="#1f2937" />
        <circle cx="75" cy="108" r="2.5" fill="#fff" />
        <circle cx="119" cy="108" r="2.5" fill="#fff" />

        {/* brows / happy squint */}
        {happy ? (
          <>
            <path d="M68 104 Q78 98 88 104" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M112 104 Q122 98 132 104" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : null}

        {/* nose */}
        <ellipse cx="100" cy="132" rx="12" ry="9" fill="var(--nose)" />
        <ellipse cx="96" cy="129" rx="3" ry="2" fill="rgba(255,255,255,0.35)" />

        {/* smile */}
        <path
          d={happy ? 'M82 150 Q100 168 118 150' : 'M86 152 Q100 162 114 152'}
          stroke="var(--nose)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* messy hair tufts — hide as cut */}
        {show('top') && (
          <g className="hair-tuft tuft-top">
            <path d="M70 58 Q88 18 100 48 Q112 18 130 58 Z" fill="var(--patch)" />
            <path d="M82 52 Q100 28 118 52" fill="var(--coat)" opacity="0.7" />
          </g>
        )}
        {show('bangL') && (
          <g className="hair-tuft tuft-bangL">
            <path d="M55 78 Q48 48 72 70 Q78 88 62 92 Z" fill="var(--patch)" />
          </g>
        )}
        {show('bangR') && (
          <g className="hair-tuft tuft-bangR">
            <path d="M145 78 Q152 48 128 70 Q122 88 138 92 Z" fill="var(--patch)" />
          </g>
        )}
        {show('sideL') && (
          <g className="hair-tuft tuft-sideL">
            <path d="M40 110 Q22 100 38 130 Q48 140 52 122 Z" fill="var(--coat)" />
            <path d="M38 118 Q28 112 40 132" fill="var(--patch)" opacity="0.8" />
          </g>
        )}
        {show('sideR') && (
          <g className="hair-tuft tuft-sideR">
            <path d="M160 110 Q178 100 162 130 Q152 140 148 122 Z" fill="var(--coat)" />
            <path d="M162 118 Q172 112 160 132" fill="var(--patch)" opacity="0.8" />
          </g>
        )}
        {show('fluff') && (
          <g className="hair-tuft tuft-fluff">
            <path d="M88 70 Q100 42 112 70 Q100 62 88 70" fill="var(--coat)" />
            <circle cx="100" cy="58" r="10" fill="var(--patch)" />
          </g>
        )}

        {/* neat short fur after cut */}
        {cutProgress > 0.4 && (
          <g opacity={Math.min(1, (cutProgress - 0.4) / 0.6)}>
            <ellipse cx="100" cy="72" rx="28" ry="10" fill="var(--patch)" opacity="0.55" />
            <ellipse cx="72" cy="88" rx="10" ry="6" fill="var(--patch)" opacity="0.4" />
            <ellipse cx="128" cy="88" rx="10" ry="6" fill="var(--patch)" opacity="0.4" />
          </g>
        )}
      </svg>
    </div>
  )
}

/** Hit targets in % of the chair stage for each tuft. */
export const TUFT_TARGETS: Record<
  HairTuftId,
  { left: string; top: string; label: string }
> = {
  top: { left: '42%', top: '8%', label: 'Top fluff' },
  bangL: { left: '22%', top: '22%', label: 'Left bang' },
  bangR: { left: '62%', top: '22%', label: 'Right bang' },
  sideL: { left: '8%', top: '42%', label: 'Left side' },
  sideR: { left: '76%', top: '42%', label: 'Right side' },
  fluff: { left: '42%', top: '18%', label: 'Fringe' },
}
