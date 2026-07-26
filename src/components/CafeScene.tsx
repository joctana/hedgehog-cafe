import { HEDGEHOGS, type HedgehogId } from '../data/hedgehogs'
import type { useHedgehogCare } from '../hooks/useHedgehogCare'
import { HappinessMeter } from './HappinessMeter'
import { Hedgehog } from './Hedgehog'

type CareApi = ReturnType<typeof useHedgehogCare>

interface CafeSceneProps {
  states: CareApi['states']
  onSelect: (id: HedgehogId) => void
}

export function CafeScene({ states, onSelect }: CafeSceneProps) {
  return (
    <section className="scene cafe-scene" aria-label="Hedgehog Café">
      <div className="window-glow" aria-hidden="true" />
      <div className="cafe-floor" aria-hidden="true" />

      <header className="brand-block">
        <h1>Hedgehog Café</h1>
        <p>Tap a friend!</p>
      </header>

      <div className="hedgehog-row">
        {HEDGEHOGS.map((hedgehog) => (
          <div key={hedgehog.id} className="hedgehog-spot">
            <HappinessMeter value={states[hedgehog.id].happiness} />
            <Hedgehog
              profile={hedgehog}
              size="sm"
              decor={states[hedgehog.id].activeDecor}
              interactive
              onClick={() => onSelect(hedgehog.id)}
            />
            <div className="cushion" style={{ ['--cushion' as string]: hedgehog.cushion }} />
            <span className="spot-label">{hedgehog.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
