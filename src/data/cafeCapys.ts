export type CafeCapyId = 'carlos' | 'coco' | 'pip' | 'nugget' | 'bean'

export interface CafeCapy {
  id: CafeCapyId
  name: string
  vibe: string
  coat: string
  belly: string
  accent: string
}

export const CAFE_CAPYS: CafeCapy[] = [
  {
    id: 'carlos',
    name: 'Carlos',
    vibe: 'Head chef',
    coat: '#b88960',
    belly: '#c99a70',
    accent: '#f5c518',
  },
  {
    id: 'coco',
    name: 'Coco',
    vibe: 'Hungry',
    coat: '#8f6540',
    belly: '#d4a882',
    accent: '#fb7185',
  },
  {
    id: 'pip',
    name: 'Pip',
    vibe: 'Snacky',
    coat: '#c99a70',
    belly: '#f3e0c8',
    accent: '#38bdf8',
  },
  {
    id: 'nugget',
    name: 'Nugget',
    vibe: 'Always hungry',
    coat: '#a67c52',
    belly: '#e8c9a8',
    accent: '#34d399',
  },
  {
    id: 'bean',
    name: 'Bean',
    vibe: 'Tea time',
    coat: '#7a5538',
    belly: '#c9a882',
    accent: '#c084fc',
  },
]

export const CHEF = CAFE_CAPYS[0]
export const GUESTS = CAFE_CAPYS.slice(1)

export type StationId = 'wash' | 'chop' | 'cook' | 'plate'

export const STATIONS: Array<{ id: StationId; label: string; emoji: string }> = [
  { id: 'wash', label: 'Wash', emoji: '🚿' },
  { id: 'chop', label: 'Chop', emoji: '🔪' },
  { id: 'cook', label: 'Cook', emoji: '🔥' },
  { id: 'plate', label: 'Plate', emoji: '🍽️' },
]

export interface Recipe {
  id: string
  name: string
  emoji: string
  steps: StationId[]
  coins: number
}

export const RECIPES: Recipe[] = [
  { id: 'orange', name: 'Orange bowl', emoji: '🍊', steps: ['wash', 'chop', 'plate'], coins: 3 },
  { id: 'soup', name: 'Grass soup', emoji: '🥣', steps: ['wash', 'cook', 'plate'], coins: 4 },
  { id: 'melon', name: 'Melon cups', emoji: '🍈', steps: ['chop', 'plate'], coins: 2 },
  { id: 'corn', name: 'Corn cakes', emoji: '🌽', steps: ['chop', 'cook', 'plate'], coins: 5 },
  { id: 'tea', name: 'Warm tea', emoji: '🍵', steps: ['cook', 'plate'], coins: 2 },
]
