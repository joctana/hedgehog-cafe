import type { PointerEvent as ReactPointerEvent } from 'react'
import type { CareAction } from '../hooks/useHedgehogCare'

export interface CareTool {
  id: CareAction
  emoji: string
  label: string
  mode: 'tap' | 'drag'
}

export const CARE_TOOLS: CareTool[] = [
  { id: 'feed', emoji: '🍎', label: 'Feed', mode: 'drag' },
  { id: 'drink', emoji: '💧', label: 'Drink', mode: 'tap' },
  { id: 'pet', emoji: '✋', label: 'Pet', mode: 'tap' },
  { id: 'brush', emoji: '🧹', label: 'Brush', mode: 'drag' },
  { id: 'nap', emoji: '🛏️', label: 'Nap', mode: 'tap' },
]

interface CareTrayProps {
  doneActions: CareAction[]
  activeTool: CareAction | null
  onTap: (action: CareAction) => void
  onDragStart: (action: CareAction, emoji: string, event: ReactPointerEvent<HTMLButtonElement>) => void
}

export function CareTray({ doneActions, activeTool, onTap, onDragStart }: CareTrayProps) {
  return (
    <div className="care-tray" role="toolbar" aria-label="Care tools">
      {CARE_TOOLS.map((tool) => {
        const used = doneActions.includes(tool.id)
        return (
          <button
            key={tool.id}
            type="button"
            className={[
              'care-tool',
              used ? 'used' : '',
              activeTool === tool.id ? 'dragging' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label={tool.label}
            onClick={() => {
              if (tool.mode === 'tap') onTap(tool.id)
            }}
            onPointerDown={(event) => {
              if (tool.mode === 'drag') onDragStart(tool.id, tool.emoji, event)
            }}
          >
            <span aria-hidden="true">{tool.emoji}</span>
          </button>
        )
      })}
    </div>
  )
}
