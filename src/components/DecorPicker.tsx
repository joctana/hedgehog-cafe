import { DECOR_EMOJI, DECOR_UNLOCK_ORDER, type DecorItem } from '../data/hedgehogs'

interface DecorPickerProps {
  unlocked: DecorItem[]
  active: DecorItem | null
  onSelect: (decor: DecorItem) => void
}

export function DecorPicker({ unlocked, active, onSelect }: DecorPickerProps) {
  if (unlocked.length === 0) return null

  return (
    <div className="decor-bar" role="group" aria-label="Decorations">
      {DECOR_UNLOCK_ORDER.map((decor) => {
        const isUnlocked = unlocked.includes(decor)
        return (
          <button
            key={decor}
            type="button"
            className={[
              'decor-chip',
              isUnlocked ? 'unlocked' : '',
              active === decor ? 'active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={!isUnlocked}
            aria-label={`Decor ${decor}`}
            onClick={() => onSelect(decor)}
          >
            <span aria-hidden="true">{isUnlocked ? DECOR_EMOJI[decor] : '🔒'}</span>
          </button>
        )
      })}
    </div>
  )
}
