export type ActivityKind = 'feed' | 'clean' | 'sleep'

export interface FoodItem {
  id: string
  emoji: string
  label: string
}

export const FOODS: FoodItem[] = [
  { id: 'apple', emoji: '🍎', label: 'Apple' },
  { id: 'berry', emoji: '🫐', label: 'Berries' },
  { id: 'worm', emoji: '🐛', label: 'Treat' },
  { id: 'cucumber', emoji: '🥒', label: 'Cucumber' },
]

export const FEED_BITES_NEEDED = 3
export const CLEAN_SPOTS_NEEDED = 4

export interface DirtSpot {
  id: string
  x: number
  y: number
}

export function createDirtSpots(): DirtSpot[] {
  return [
    { id: 'd1', x: 34, y: 42 },
    { id: 'd2', x: 62, y: 38 },
    { id: 'd3', x: 48, y: 58 },
    { id: 'd4', x: 70, y: 55 },
  ]
}
