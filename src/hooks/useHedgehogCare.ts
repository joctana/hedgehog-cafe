import { useCallback, useMemo, useState } from 'react'
import {
  DECOR_UNLOCK_ORDER,
  HEDGEHOGS,
  MAX_HAPPINESS,
  type DecorItem,
  type HedgehogId,
} from '../data/hedgehogs'

export type CareAction = 'feed' | 'drink' | 'pet' | 'clean' | 'sleep'
export type AnimState =
  | 'idle'
  | 'eat'
  | 'drink'
  | 'pet'
  | 'clean'
  | 'sleep'
  | 'happy'

interface HedgehogState {
  happiness: number
  unlockedDecor: DecorItem[]
  activeDecor: DecorItem | null
  doneActions: CareAction[]
}

function createInitialStates(): Record<HedgehogId, HedgehogState> {
  return HEDGEHOGS.reduce(
    (acc, hedgehog) => {
      acc[hedgehog.id] = {
        happiness: 0,
        unlockedDecor: [],
        activeDecor: null,
        doneActions: [],
      }
      return acc
    },
    {} as Record<HedgehogId, HedgehogState>,
  )
}

export function useHedgehogCare() {
  const [states, setStates] = useState(createInitialStates)
  const [selectedId, setSelectedId] = useState<HedgehogId | null>(null)
  const [anim, setAnim] = useState<AnimState>('idle')
  const [celebrating, setCelebrating] = useState(false)
  const [heartBurst, setHeartBurst] = useState(0)

  const selected = useMemo(
    () => HEDGEHOGS.find((h) => h.id === selectedId) ?? null,
    [selectedId],
  )

  const selectedState = selectedId ? states[selectedId] : null

  const selectHedgehog = useCallback((id: HedgehogId) => {
    setSelectedId(id)
    setAnim('idle')
    setCelebrating(false)
  }, [])

  const goHome = useCallback(() => {
    setSelectedId(null)
    setAnim('idle')
    setCelebrating(false)
  }, [])

  const triggerAnim = useCallback((next: AnimState) => {
    setAnim(next)
    window.setTimeout(() => setAnim('idle'), next === 'sleep' ? 1800 : 900)
  }, [])

  const applyCare = useCallback(
    (action: CareAction) => {
      if (!selectedId) return false

      setStates((prev) => {
        const current = prev[selectedId]
        if (current.doneActions.includes(action) && current.happiness >= MAX_HAPPINESS) {
          return prev
        }

        const alreadyDone = current.doneActions.includes(action)
        const happiness = alreadyDone
          ? current.happiness
          : Math.min(MAX_HAPPINESS, current.happiness + 1)

        const doneActions = alreadyDone
          ? current.doneActions
          : [...current.doneActions, action]

        let unlockedDecor = current.unlockedDecor
        if (!alreadyDone && happiness > 0 && happiness <= DECOR_UNLOCK_ORDER.length) {
          const unlock = DECOR_UNLOCK_ORDER[happiness - 1]
          if (!unlockedDecor.includes(unlock)) {
            unlockedDecor = [...unlockedDecor, unlock]
          }
        }

        if (!alreadyDone && happiness >= MAX_HAPPINESS) {
          window.setTimeout(() => setCelebrating(true), 500)
        }

        return {
          ...prev,
          [selectedId]: {
            ...current,
            happiness,
            doneActions,
            unlockedDecor,
            activeDecor: current.activeDecor ?? unlockedDecor[0] ?? null,
          },
        }
      })

      setHeartBurst((n) => n + 1)

      const animMap: Record<CareAction, AnimState> = {
        feed: 'eat',
        drink: 'drink',
        pet: 'pet',
        clean: 'clean',
        sleep: 'sleep',
      }
      triggerAnim(animMap[action])
      return true
    },
    [selectedId, triggerAnim],
  )

  const setActiveDecor = useCallback(
    (decor: DecorItem) => {
      if (!selectedId) return
      setStates((prev) => {
        const current = prev[selectedId]
        if (!current.unlockedDecor.includes(decor)) return prev
        return {
          ...prev,
          [selectedId]: {
            ...current,
            activeDecor: current.activeDecor === decor ? null : decor,
          },
        }
      })
    },
    [selectedId],
  )

  const dismissCelebration = useCallback(() => {
    setCelebrating(false)
    triggerAnim('happy')
  }, [triggerAnim])

  return {
    states,
    selected,
    selectedState,
    selectedId,
    anim,
    celebrating,
    heartBurst,
    selectHedgehog,
    goHome,
    applyCare,
    setActiveDecor,
    dismissCelebration,
  }
}
