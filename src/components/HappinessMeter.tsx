import { MAX_HAPPINESS } from '../data/hedgehogs'

interface HappinessMeterProps {
  value: number
}

export function HappinessMeter({ value }: HappinessMeterProps) {
  return (
    <div className="happiness-pill" aria-label={`Happiness ${value} of ${MAX_HAPPINESS}`}>
      {Array.from({ length: MAX_HAPPINESS }, (_, index) => (
        <span key={index} className={`star ${index < value ? 'filled' : ''}`} aria-hidden="true">
          ⭐
        </span>
      ))}
    </div>
  )
}
