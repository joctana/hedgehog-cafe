import type { CareAction } from '../hooks/useHedgehogCare'
import type { ActivityKind } from '../data/careActivities'

export interface CareTool {
  id: CareAction
  emoji: string
  label: string
  mode: 'tap' | 'activity'
  activity?: ActivityKind
}

export const CARE_TOOLS: CareTool[] = [
  { id: 'feed', emoji: '🍎', label: 'Feed', mode: 'activity', activity: 'feed' },
  { id: 'drink', emoji: '💧', label: 'Drink', mode: 'tap' },
  { id: 'pet', emoji: '✋', label: 'Pet', mode: 'tap' },
  { id: 'clean', emoji: '🧽', label: 'Clean', mode: 'activity', activity: 'clean' },
  { id: 'sleep', emoji: '🌙', label: 'Sleep', mode: 'activity', activity: 'sleep' },
]

interface CareTrayProps {
  doneActions: CareAction[]
  onTap: (action: CareAction) => void
  onOpenActivity: (activity: ActivityKind) => void
}

export function CareTray({ doneActions, onTap, onOpenActivity }: CareTrayProps) {
  return (
    <div className="care-tray" role="toolbar" aria-label="Care tools">
      {CARE_TOOLS.map((tool) => {
        const used = doneActions.includes(tool.id)
        return (
          <button
            key={tool.id}
            type="button"
            className={['care-tool', used ? 'used' : ''].filter(Boolean).join(' ')}
            aria-label={tool.label}
            onClick={() => {
              if (tool.mode === 'activity' && tool.activity) onOpenActivity(tool.activity)
              else onTap(tool.id)
            }}
          >
            <span aria-hidden="true">{tool.emoji}</span>
          </button>
        )
      })}
    </div>
  )
}
